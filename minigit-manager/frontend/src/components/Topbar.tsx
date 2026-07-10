import { FiSun, FiMoon, FiChevronDown } from "react-icons/fi";
import { useRepoContext } from "../store/RepoContext";
import { useSettings } from "../store/SettingsContext";

export default function Topbar() {
  const { repos, activeRepoId, setActiveRepoId } = useRepoContext();
  const { settings, toggleTheme } = useSettings();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface/60 px-6">
      <div className="flex items-center gap-2 text-sm text-ink-muted">
        <span>Active repository</span>
        <div className="relative">
          <select
            value={activeRepoId || ""}
            onChange={(e) => setActiveRepoId(e.target.value || null)}
            className="focus-ring appearance-none rounded-lg border border-border bg-surface-raised py-1.5 pl-3 pr-8 text-sm font-medium text-ink outline-none"
          >
            {repos.length === 0 && <option value="">No repositories yet</option>}
            {repos.map((repo) => (
              <option key={repo.id} value={repo.id}>
                {repo.name}
              </option>
            ))}
          </select>
          <FiChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint"
            size={14}
          />
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
        aria-label="Toggle theme"
        title="Toggle dark / light theme"
      >
        {settings.theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
      </button>
    </header>
  );
}
