import Link from "next/link";
import ClockIcon from "./icons/clock-icon";
import CogIcon from "./icons/cog-icon";
import HomeIcon from "./icons/home-icon";

export default function NavBar() {
  return (
    <div className="sticky top-0 z-30 navbar bg-base-100/90 shadow-xs backdrop-blur-sm">
      <div className="navbar-start">
        <Link href="/" className="btn text-xl btn-ghost">
          <HomeIcon />
        </Link>
      </div>
      <div className="navbar-end">
        <Link
          href="/history"
          prefetch={false}
          className="btn text-xl font-normal btn-ghost"
        >
          <ClockIcon />
        </Link>
        <Link
          href="/config"
          prefetch={false}
          className="btn text-xl font-normal btn-ghost"
        >
          <CogIcon />
        </Link>
      </div>
    </div>
  );
}
