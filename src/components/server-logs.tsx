"use client";

import { useMemo } from "react";
import { useSession } from "./session-provider";

export default function ServerLogs() {
  const { session } = useSession();
  const logs = useMemo(() => session.logs?.map(formatLog), [session.logs]);

  return (
    <div className="flex flex-col gap-1 pb-4 text-sm opacity-90">
      {logs?.map((log, i) => <div key={i}>- {log}</div>)}
    </div>
  );
}

function formatLog(log: { text: string; time: number }) {
  return `[${new Date(log.time).toLocaleTimeString("en", { hour12: false })}]${log.text}`;
}
