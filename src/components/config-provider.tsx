"use client";

import { getConfig, updateConfig } from "@/lib/actions";
import { ConfigKey } from "@/lib/constants";
import { createContext, use, useCallback, useEffect, useState } from "react";

const Context = createContext<ConfigContext | null>(null);

export type ConfigObject = Partial<Record<ConfigKey, any>>;

export interface ConfigContext {
  config: Readonly<ConfigObject>;
  refresh(): Promise<ConfigObject>;
  update(partial: Partial<ConfigObject>): Promise<void>;
}

export interface ConfigProviderProps {
  children?: React.ReactNode;
}

export default function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useState<ConfigObject>({});

  const refresh = useCallback(async () => {
    const config = await getConfig();
    setConfig(config);
    return config;
  }, []);

  const update = useCallback(async (partial: Partial<ConfigObject>) => {
    await updateConfig(partial);
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const context: ConfigContext = {
    config,
    refresh,
    update,
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <Context.Provider value={context}>{children}</Context.Provider>;
}

export function useConfig() {
  const context = use(Context);
  if (!context) {
    throw new Error("config context not found");
  }
  return context;
}
