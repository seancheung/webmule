import ConfigProvider from "@/components/config-provider";
import RouterFileTable from "@/components/router-file-table";
import RouterPagination from "@/components/router-pagination";
import { getConfig, getFiles } from "@/lib/actions";
import { ConfigKey } from "@/lib/constants";

const size = 20;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const { id } = await params;
  const { p } = await searchParams;
  const page = p ? parseInt(p) : undefined;
  const { list, current, total } = await getFiles({
    page,
    size,
    queryId: parseInt(id),
  });
  const config = await getConfig();
  const sortKey = config[ConfigKey.FileSortKey];
  const sortDesc = config[ConfigKey.FileSortDesc];

  return (
    <div className="mx-auto my-4 flex max-w-6xl flex-col items-center gap-1">
      <ConfigProvider intialConfig={config}>
        <RouterFileTable items={list} sortKey={sortKey} sortDesc={sortDesc} />
      </ConfigProvider>
      <RouterPagination page={current} total={total} size={size} />
    </div>
  );
}
