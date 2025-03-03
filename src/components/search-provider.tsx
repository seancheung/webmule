"use client";

import { ClientSession } from "emuled";
import { createContext, use, useCallback, useEffect, useState } from "react";
import { useSession } from "./session-provider";

const Context = createContext<SearchContext | null>(null);

export interface SearchContext {
  searches: readonly SearchItem[];
  push(...items: SearchItem[]): void;
  update(item: SearchItem): void;
  clear(): void;
}

export interface SearchItem {
  type: "local" | "server";
  query: string;
  name: string;
}

export interface SearchProviderProps {
  children?: React.ReactNode;
}

export default function SearchProvider({ children }: SearchProviderProps) {
  const { session } = useSession();
  const [searches, setSearches] = useState<SearchItem[]>(() =>
    mapSessionResults(session),
  );

  const push = useCallback((...items: SearchItem[]) => {
    setSearches((prev) => {
      const list = Array.from(prev);
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const j = list.findIndex(
          (e) => e.type === item.type && e.query === item.query,
        );
        if (j >= 0) {
          list.splice(j, 1, item);
        } else {
          list.push(item);
        }
      }
      return list;
    });
  }, []);

  const update = useCallback((item: SearchItem) => {
    setSearches((prev) => {
      const i = prev.findIndex(
        (e) => e.type === item.type && e.query === item.query,
      );
      if (i >= 0) {
        const list = Array.from(prev);
        list.splice(i, 1, item);
        return list;
      }
      return prev;
    });
  }, []);

  const clear = useCallback(() => {
    setSearches([]);
  }, []);

  const context: SearchContext = {
    searches,
    push,
    update,
    clear,
  };

  useEffect(() => {
    push(...mapSessionResults(session));
  }, [push, session]);

  return <Context.Provider value={context}>{children}</Context.Provider>;
}

export function useSearch() {
  const context = use(Context);
  if (!context) {
    throw new Error("search context not found");
  }
  return context;
}

function mapSessionResults(session: ClientSession): SearchItem[] {
  return session.results
    ? Object.entries(session.results)
        .map(
          ([key, value]) =>
            ({
              type: "server",
              query: key,
              name: `${key} (${value.length})`,
            }) satisfies SearchItem,
        )
        .sort((a, b) => {
          if (a.query === session.lastQuery) {
            return -1;
          }
          if (b.query === session.lastQuery) {
            return 1;
          }
          return 0;
        })
    : [];
}
