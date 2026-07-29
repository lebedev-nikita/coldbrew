import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { Bell, Ellipsis, LayoutDashboard, Moon, Plug, Settings, Sun, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

const navItem =
  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#77758b] transition hover:bg-violet-50 hover:text-violet-700";
const activeNavItem = "bg-violet-100 font-bold text-violet-700";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <main className="flex h-screen min-w-80 bg-[#f7f7fb] font-sans text-[#242238] transition-colors duration-300 dark:bg-[#11111a] dark:text-[#f1efff]">
      <aside className="hidden w-[244px] shrink-0 flex-col border-r border-[#ebeaf1] bg-white px-4 pt-8 pb-5 transition-colors duration-300 lg:flex dark:border-white/10 dark:bg-[#181722]">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 text-xl font-bold tracking-tight text-[#292640] dark:text-white"
        >
          <span className="flex size-6 rotate-[-7deg] items-center justify-center rounded-lg bg-linear-to-br from-violet-400 to-violet-700">
            <span className="size-2.5 rotate-45 rounded-[3px] bg-white" />
          </span>
          omnistream
        </Link>
        <nav className="mt-11 grid gap-1" aria-label="Main navigation">
          <Link
            activeOptions={{ exact: true }}
            activeProps={{ className: activeNavItem }}
            className={navItem}
            to="/"
          >
            <LayoutDashboard aria-hidden="true" />
            Overview
          </Link>
          <Link activeProps={{ className: activeNavItem }} className={navItem} to="/donations">
            <Wallet aria-hidden="true" />
            Donations
          </Link>
          <Link activeProps={{ className: activeNavItem }} className={navItem} to="/integrations">
            <Plug aria-hidden="true" />
            Integrations
            <span className="ml-auto grid size-[18px] place-items-center rounded-full bg-violet-500 text-[11px] text-white">
              1
            </span>
          </Link>
          <Link activeProps={{ className: activeNavItem }} className={navItem} to="/alerts">
            <Bell aria-hidden="true" />
            Alerts
          </Link>
        </nav>

        <div className="mt-auto flex flex-col gap-5">
          <button
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
            className="flex w-full items-center justify-between rounded-xl border border-[#e8e6ef] bg-[#faf9fc] p-1 text-xs font-semibold text-[#6d697d] shadow-sm transition hover:border-violet-200 hover:text-violet-700 dark:border-white/10 dark:bg-white/5 dark:text-violet-100 dark:hover:border-violet-400/40 dark:hover:bg-violet-400/10"
            onClick={() => setIsDark((value) => !value)}
            type="button"
          >
            <span className="flex items-center gap-2 px-2">
              {isDark ? (
                <Moon aria-hidden="true" size={15} />
              ) : (
                <Sun aria-hidden="true" size={15} />
              )}
              {isDark ? "Dark mode" : "Light mode"}
            </span>
            <span className="grid size-7 place-items-center rounded-lg bg-white text-violet-600 shadow-sm transition-transform duration-300 dark:translate-x-0 dark:bg-violet-500 dark:text-white">
              {isDark ? (
                <Moon aria-hidden="true" size={14} />
              ) : (
                <Sun aria-hidden="true" size={14} />
              )}
            </span>
          </button>

          <Link activeProps={{ className: activeNavItem }} className={navItem} to="/settings">
            <Settings aria-hidden="true" />
            Settings
          </Link>
          <div className="flex items-center gap-2.5 border-t border-[#eeedf2] px-2 pt-5 dark:border-white/10">
            <div className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-orange-300 to-orange-500 text-[11px] font-bold text-white">
              NL
            </div>
            <div>
              <strong className="block text-xs text-[#373449]">nikita_live</strong>
              <small className="mt-0.5 block text-[10px] text-[#9391a1]">Professional plan</small>
            </div>
            <button className="ml-auto text-[#9694a3]" aria-label="Open account menu">
              <Ellipsis aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>
      <div className="grow overflow-y-auto">
        <Outlet />
      </div>
    </main>
  );
}
