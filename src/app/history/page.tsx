import RouterPagination from "@/components/router-pagination";
import { getConfig, getQueries, getServers } from "@/lib/actions";
import { ConfigKey, DefaultPageSize } from "@/lib/constants";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const servers = await getServers();
  const config = await getConfig();
  const page = p ? parseInt(p) : undefined;
  const size: number = config[ConfigKey.PageSize] || DefaultPageSize;
  const { list, current, total } = await getQueries({ page, size });
  const serverMap = servers.reduce(
    (p, c) => {
      p[c.id] = c.name;
      return p;
    },
    {} as Record<number, string>,
  );

  return (
    <div className="mx-auto my-4 flex max-w-6xl flex-col items-center gap-1">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Server</th>
            <th>Results</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>
                <Link
                  className="link"
                  target="_blank"
                  prefetch={false}
                  href={`/history/${item.id}`}
                >
                  {item.query}
                </Link>
              </td>
              <td>{item.server && serverMap[item.server?.id]}</td>
              <td>{item._count.files}</td>
              <td>{formatDate(item.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <RouterPagination page={current} total={total} size={size} />
    </div>
  );
}

function formatDate(date: Date) {
  return `${date.toLocaleDateString("en", { dateStyle: "short" })} ${date.toLocaleTimeString("en", { hour12: false })}`;
}
