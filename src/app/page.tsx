import ConfigProvider from "@/components/config-provider";
import SearchBar from "@/components/search-bar";
import SearchProvider from "@/components/search-provider";
import SearchResults from "@/components/search-results";
import ServerList from "@/components/server-list";
import ServerLogs from "@/components/server-logs";
import SessionProvider from "@/components/session-provider";
import { getConfig, getServers, getSession } from "@/lib/actions";

export default async function Home() {
  const config = await getConfig();
  const session = await getSession();
  const servers = await getServers();

  return (
    <ConfigProvider intialConfig={config}>
      <SessionProvider initialSession={session}>
        <div className="flex flex-col divide-x divide-base-300 px-4 md:flex-row">
          <div className="min-w-sm pt-4 md:h-[calc(100vh-64px)] md:max-w-sm md:overflow-auto">
            <div className="flex flex-col gap-4">
              <div>
                <div className="px-4 pb-2 text-sm tracking-wide opacity-60">
                  Available Servers
                </div>
                <ServerList items={servers} />
              </div>
              <div>
                <div className="px-4 pb-2 text-sm tracking-wide opacity-60">
                  Server Logs
                </div>
                <ServerLogs />
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center pt-2 md:h-[calc(100vh-64px)] md:overflow-auto">
            <SearchProvider>
              <SearchBar />
              <SearchResults />
            </SearchProvider>
          </div>
        </div>
      </SessionProvider>
    </ConfigProvider>
  );
}
