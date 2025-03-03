"use client";

import { SearchResult } from "emuled";
import { useMemo } from "react";
import { useClipboard } from "./hooks";
import ArrowDownIcon from "./icons/arrow-down-icon";
import ArrowUpIcon from "./icons/arrow-up-icon";
import ClipboardIcon from "./icons/clipboard-icon";
import DocumentCheckIcon from "./icons/document-check-icon";
import { createEd2kLink, humanFileSize } from "./utils";

export interface FileTableProps {
  items: SearchResult[];
  sortKey?: string;
  sortDesc?: boolean;
  onSortChange?: (key: string, desc: boolean) => void;
}

export default function FileTable({
  items,
  sortKey,
  sortDesc,
  onSortChange,
}: FileTableProps) {
  const [copy, isCopied] = useClipboard();

  const SortIcon = sortDesc ? ArrowDownIcon : ArrowUpIcon;

  const files = useMemo(
    () =>
      items.map((file) => {
        return {
          id: file.hash,
          name: file.name || "",
          size: file.size ? humanFileSize(file.size || BigInt(0)) : "",
          sources: `${file.complete || 0}/${file.sources || 0}`,
          link: createEd2kLink(file),
        };
      }),
    [items],
  );

  const handleSort = (key: string) => {
    onSortChange?.(key, key === sortKey ? !sortDesc : !!sortDesc);
  };

  return (
    <table className="table table-zebra">
      {/* head */}
      <thead>
        <tr>
          <th className="flex-1">
            <button
              className="btn btn-link btn-ghost"
              onClick={() => handleSort("name")}
            >
              Name
              {sortKey === "name" && <SortIcon />}
            </button>
          </th>
          <th className="w-16 flex-0">
            <button
              className="btn btn-link btn-ghost"
              onClick={() => handleSort("size")}
            >
              Size
              {sortKey === "size" && <SortIcon />}
            </button>
          </th>
          <th className="w-16 flex-0">Sources</th>
          <th className="w-16 flex-0"></th>
        </tr>
      </thead>
      <tbody>
        {files?.map((file) => (
          <tr key={file.id}>
            <td>
              <a className="link" target="_blank" href={file.link}>
                {file.name}
              </a>
            </td>
            <td>{file.size}</td>
            <td>{file.sources}</td>
            <td>
              <button
                className="btn btn-circle btn-ghost"
                onClick={() => {
                  copy(file.link, file.id);
                }}
              >
                {isCopied(file.id) ? <DocumentCheckIcon /> : <ClipboardIcon />}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
