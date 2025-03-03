"use client";

import { getSession } from "@/lib/actions";
import { ClientSession } from "emuled";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const Context = createContext<SessionContext | null>(null);

export interface SessionContext {
  session: ClientSession;
  refresh(): Promise<ClientSession>;
  checkIdle(): void;
}

export interface SessionProviderProps {
  children?: React.ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<ClientSession>({ state: 0 });
  const prevState = useRef(session.state);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = useCallback(async () => {
    const session = await getSession();
    if (session.state !== prevState.current) {
      prevState.current = session.state;
      setSession(session);
    }
    return session;
  }, []);

  const checkIdle = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const session = await refresh();
    if (!isIdle(session.state)) {
      timerRef.current = setTimeout(checkIdle, 1000);
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!isIdle(session.state)) {
      checkIdle();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [checkIdle, session.state]);

  const context: SessionContext = {
    session,
    refresh,
    checkIdle,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
}

export function useSession() {
  const context = use(Context);
  if (!context) {
    throw new Error("session context not found");
  }
  return context;
}

function isIdle(state: number) {
  return state === 4 || state === 0;
}
