"use client";

import { ConfigKey } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useConfig } from "./config-provider";
import FileTable, { FileTableProps } from "./file-table";

export default function RouterFileTable(props: FileTableProps) {
  const router = useRouter();
  const { update } = useConfig();

  function handleSortChange(key: string, desc: boolean): void {
    update({
      [ConfigKey.FileSortKey]: key,
      [ConfigKey.FileSortDesc]: desc,
    }).then(() => {
      router.refresh();
    });
  }

  return <FileTable {...props} onSortChange={handleSortChange} />;
}
