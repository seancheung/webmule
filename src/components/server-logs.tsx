"use client";

import { clearLogs } from "@/lib/actions";
import { useMemo } from "react";
import TrashIcon from "./icons/trash-icon";
import { useSession } from "./session-provider";

export default function ServerLogs() {
  const { session, refresh } = useSession();
  const logs = useMemo(() => session.logs?.map(formatLog), [session.logs]);

  const handleClear = () => {
    clearLogs().then(() => refresh(true));
  };

  return (
    <div className="flex flex-col gap-1 pb-4 text-sm opacity-90">
      {logs?.map((log, i) => <div key={i}>- {log}</div>)}
      {logs?.length > 0 && (
        <button className="btn mt-2 btn-block btn-sm" onClick={handleClear}>
          <TrashIcon />
          Clear
        </button>
      )}
    </div>
  );
}

function formatLog(log: { text: string; time: number }) {
  return `[${new Date(log.time).toLocaleTimeString("en", { hour12: false })}]${log.text}`;
}
