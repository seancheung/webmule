"use client";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useDebounced } from "./hooks";
import GlobeAltIcon from "./icons/globe-alt-icon";
import SearchIcon from "./icons/search-icon";
import LocalFileTable from "./local-file-table";
import { useSearch } from "./search-provider";
import ServerFileTable from "./server-file-table";

export default function SearchResults() {
  const { searches } = useSearch();
  const [tabIndex, setTabIndex] = useState(searches.length - 1);
  const [filter, debouncedFilter, setFilter] = useDebounced(500, "");

  const activeSearch = useMemo(() => searches[tabIndex], [searches, tabIndex]);

  useEffect(() => {
    setTabIndex(searches.length - 1);
  }, [searches.length]);

  return (
    <div className="flex w-full flex-col">
      <div className="sticky top-[-8px] z-1 flex items-center justify-between bg-base-100/90 py-2 shadow-xs backdrop-blur-sm">
        <div role="tablist" className="tabs-border tabs">
          {searches.map((item, index) => (
            <a
              key={index}
              role="tab"
              className={clsx(
                "tab flex items-center gap-1",
                index === tabIndex && "tab-active",
              )}
              onClick={() => setTabIndex(index)}
            >
              {item.type === "server" && <GlobeAltIcon />}
              {item.name}
            </a>
          ))}
        </div>
        <label className="input input-sm w-60 focus-within:border-transparent focus-within:outline-2 focus-within:outline-offset-[calc(2px*-1)] focus-within:outline-primary/50">
          <SearchIcon className="opacity-50" />
          <input
            type="search"
            placeholder="Filter results"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
        </label>
      </div>
      <div className="overflow-x-auto px-2 pb-2">
        {activeSearch ? (
          activeSearch.type === "server" ? (
            <ServerFileTable
              query={activeSearch.query}
              filter={debouncedFilter}
            />
          ) : activeSearch.type === "local" ? (
            <LocalFileTable
              query={activeSearch.query}
              filter={debouncedFilter}
            />
          ) : null
        ) : null}
      </div>
    </div>
  );
}
