"use client";

import { connectToServer, disconnectFromServer } from "@/lib/actions";
import clsx from "clsx";
import Link from "next/link";
import LinkIcon from "./icons/link-icon";
import LinkSlashIcon from "./icons/link-slash-icon";
import PencilIcon from "./icons/pencil-icon";
import { useSession } from "./session-provider";

export interface ServerListProps {
  items: ServerInfo[];
}

export default function ServerList({ items }: ServerListProps) {
  const { checkIdle } = useSession();

  const handleConnect = (host: string, port: number) => {
    connectToServer(host, port).then(checkIdle);
  };

  const handleDisconnect = () => {
    disconnectFromServer().then(checkIdle);
  };

  return (
    <ul className="list">
      {items.map((item) => (
        <ServerListItem
          key={item.id}
          item={item}
          onConnect={() => handleConnect(item.host, item.port)}
          onDisconnect={handleDisconnect}
        />
      ))}
      <li className="pt-2">
        <Link className="btn btn-block btn-sm" prefetch={false} href="/server">
          <PencilIcon />
          Edit
        </Link>
      </li>
    </ul>
  );
}

export interface ServerInfo {
  id: number;
  name: string;
  host: string;
  port: number;
}

interface ServerListItemProps {
  item: ServerInfo;
  onConnect: () => void;
  onDisconnect: () => void;
}

function ServerListItem({
  item,
  onConnect,
  onDisconnect,
}: ServerListItemProps) {
  const { session } = useSession();
  const { state, server } = session;
  const isMatch = server?.host === item.host && server?.port === item.port;

  return (
    <li className="list-row group">
      <div
        className={clsx(
          "list-col-grow",
          isMatch
            ? state >= 4
              ? "text-primary"
              : state >= 2
                ? "animate-pulse text-success"
                : state >= 1
                  ? "animate-pulse text-warning"
                  : null
            : null,
        )}
      >
        <div>{item.name}</div>
        <div className="text-xs font-semibold uppercase opacity-60">
          {item.host}:{item.port}
        </div>
      </div>
      {state < 1 ? (
        <button
          className="btn invisible btn-circle btn-sm btn-ghost group-hover:visible"
          onClick={onConnect}
        >
          <LinkIcon />
        </button>
      ) : !isMatch ? (
        <button className="btn invisible btn-circle btn-sm btn-ghost">
          <LinkIcon />
        </button>
      ) : (
        <button
          className="btn btn-circle btn-sm btn-ghost btn-primary"
          onClick={onDisconnect}
          disabled={state === 1}
        >
          <LinkSlashIcon />
        </button>
      )}
    </li>
  );
}
