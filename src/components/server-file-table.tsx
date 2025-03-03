"use client";

import { ConfigKey } from "@/lib/constants";
import { useMemo } from "react";
import { useConfig } from "./config-provider";
import FileTable from "./file-table";
import { useSession } from "./session-provider";
import { sortArray } from "./utils";

export interface ServerFileTableProps {
  query: string;
  filter?: string;
}

export default function ServerFileTable({
  query,
  filter,
}: ServerFileTableProps) {
  const { session } = useSession();
  const { config, update } = useConfig();

  const sortKey: string = config[ConfigKey.FileSortKey];
  const sortDesc: boolean = config[ConfigKey.FileSortDesc];

  const items = useMemo(() => {
    let list = session.results?.[query];
    if (!list) {
      return [];
    }
    if (filter) {
      const match = new RegExp(filter.replace(/\s+/, ".+"), "i");
      list = list.filter((file) => !file.name || match.test(file.name));
    }
    if (!sortKey) {
      return list;
    }
    return sortArray(list, sortKey, sortDesc);
  }, [filter, query, session.results, sortDesc, sortKey]);

  function handleSortChange(key: string, desc: boolean): void {
    update({
      [ConfigKey.FileSortKey]: key,
      [ConfigKey.FileSortDesc]: desc,
    });
  }

  return (
    <FileTable
      items={items}
      sortKey={sortKey}
      sortDesc={sortDesc}
      onSortChange={handleSortChange}
    />
  );
}
