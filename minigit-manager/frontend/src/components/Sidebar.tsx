import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiDatabase,
  FiFolder,
  FiLayers,
  FiGitCommit,
  FiClock,
  FiSettings,
  FiGitBranch,
} from "react-icons/fi";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/repository", label: "Repository", icon: FiDatabase },
  { to: "/files", label: "File Manager", icon: FiFolder },
  { to: "/staging", label: "Staging Area", icon: FiLayers },
  { to: "/commits", label: "Commits", icon: FiGitCommit },
  { to: "/history", label: "Version History", icon: FiClock },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface/60 px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber/15 text-amber">
          <FiGitBranch size={18} />
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-ink">Mini Git Manager</p>
          <p className="text-[11px] text-ink-faint">Local version control</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `focus-ring group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-amber/10 text-amber font-medium"
                  : "text-ink-muted hover:bg-surface-hover hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? "text-amber" : "text-ink-faint group-hover:text-ink"} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-xl2 border border-border bg-surface-raised px-3.5 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">Internship Build</p>
        <p className="mt-1 text-xs text-ink-muted">Educational Git workflow simulator — v1.0.0</p>
      </div>
    </aside>
  );
}
