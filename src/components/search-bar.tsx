"use client";

import { searchFiles } from "@/lib/actions";
import clsx from "clsx";
import { MouseEventHandler, useState } from "react";
import ClockIcon from "./icons/clock-icon";
import GlobeAltIcon from "./icons/globe-alt-icon";
import SearchIcon from "./icons/search-icon";
import { useSearch } from "./search-provider";
import { useSession } from "./session-provider";

export default function SearchBar() {
  const { session, checkIdle } = useSession();
  const { push } = useSearch();
  const [query, setQuery] = useState("");

  const isConnected = session.state >= 4;
  const isSearching = session.state >= 5;

  const handleServerSearch: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    e.currentTarget.parentElement.parentElement.blur();
    const q = query.trim();
    if (q) {
      push({ type: "server", query: q, name: q });
      searchFiles(query.trim()).then(checkIdle);
    }
  };
  const handleLocalSearch: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    e.currentTarget.parentElement.parentElement.blur();
    const q = query.trim();
    if (q) {
      push({ type: "local", query: q, name: q });
    }
  };

  return (
    <div className="join w-full max-w-4xl py-2">
      <label className="input join-item w-full focus-within:border-transparent focus-within:outline-2 focus-within:outline-offset-[calc(2px*-1)] focus-within:outline-primary/50">
        <SearchIcon className="opacity-50" />
        <input
          type="search"
          placeholder="Search for files..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </label>
      <div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className={clsx(
            "btn join-item btn-primary",
            (isSearching || !query.trim()) && "btn-disabled",
          )}
          aria-disabled={isSearching || !query.trim()}
        >
          <SearchIcon /> Search
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu z-1 w-24 rounded-box bg-base-100 p-2 shadow-sm"
        >
          <li className={clsx(!isConnected && "menu-disabled")}>
            <a onClick={handleServerSearch} aria-disabled={!isConnected}>
              <GlobeAltIcon />
              Server
            </a>
          </li>
          <li>
            <a onClick={handleLocalSearch}>
              <ClockIcon />
              Local
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
