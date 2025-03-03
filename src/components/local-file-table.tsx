"use client";

import { getFiles } from "@/lib/actions";
import { ConfigKey, DefaultPageSize } from "@/lib/constants";
import { SearchResult } from "emuled";
import { useEffect, useState } from "react";
import { useConfig } from "./config-provider";
import FileTable from "./file-table";
import Pagination from "./pagination";
import { useSearch } from "./search-provider";

export interface LocalFileTableProps {
  query: string;
  filter?: string;
}

export default function LocalFileTable({ query, filter }: LocalFileTableProps) {
  const [items, setItems] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { config, update } = useConfig();
  const { update: patch } = useSearch();

  const sortKey: string = config[ConfigKey.FileSortKey];
  const sortDesc: boolean = config[ConfigKey.FileSortDesc];
  const size: number = config[ConfigKey.PageSize] || DefaultPageSize;

  function handleSortChange(key: string, desc: boolean): void {
    update({
      [ConfigKey.FileSortKey]: key,
      [ConfigKey.FileSortDesc]: desc,
    });
  }

  useEffect(() => {
    getFiles({
      query: filter ? [query, filter].join(" ") : query,
      page,
      size,
    }).then(({ list, current, total }) => {
      setItems(list);
      setPage(current);
      setTotal(total);
      patch({ query, name: `${query} (${total})`, type: "local" });
    });
  }, [page, query, sortKey, sortDesc, size, filter, patch]);

  return (
    <div className="flex flex-col items-center gap-2">
      <FileTable
        items={items}
        sortKey={sortKey}
        sortDesc={sortDesc}
        onSortChange={handleSortChange}
      />
      <Pagination page={page} total={total} size={size} onChange={setPage} />
    </div>
  );
}
