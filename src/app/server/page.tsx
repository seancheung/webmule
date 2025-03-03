import ServerTable from "@/components/server-table";
import { getServers } from "@/lib/actions";

export default async function Page() {
  const servers = await getServers();

  return (
    <div className="mx-auto my-4 flex max-w-6xl flex-col items-center gap-1">
      <ServerTable items={servers} />
    </div>
  );
}
