import { useState } from "react";
import { FiMoon, FiSun, FiInfo, FiRefreshCw, FiGitBranch } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import { useSettings } from "../store/SettingsContext";
import { useRepoContext } from "../store/RepoContext";
import { useToast } from "../store/ToastContext";
import { settingsApi } from "../api/settingsApi";

export default function SettingsPage() {
  const { settings, toggleTheme } = useSettings();
  const { refreshRepos } = useRepoContext();
  const { showToast } = useToast();
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      await settingsApi.reset();
      await refreshRepos();
      showToast("Demo data has been reset");
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setResetting(false);
      setResetOpen(false);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Application preferences and information." />

      <div className="flex flex-col gap-5">
        <section className="rounded-xl2 border border-border bg-surface p-5 shadow-card">
          <h2 className="font-display text-sm font-semibold text-ink">Appearance</h2>
          <p className="mt-1 text-xs text-ink-muted">Switch between dark and light theme.</p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => settings.theme !== "dark" && toggleTheme()}
              className={`focus-ring flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                settings.theme === "dark" ? "border-amber bg-amber/10 text-amber" : "border-border text-ink-muted"
              }`}
            >
              <FiMoon size={14} /> Dark
            </button>
            <button
              onClick={() => settings.theme !== "light" && toggleTheme()}
              className={`focus-ring flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                settings.theme === "light" ? "border-amber bg-amber/10 text-amber" : "border-border text-ink-muted"
              }`}
            >
              <FiSun size={14} /> Light
            </button>
          </div>
        </section>

        <section className="rounded-xl2 border border-border bg-surface p-5 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
            <FiInfo size={15} className="text-amber" /> Application Info
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <InfoItem label="App name" value={settings.appName} />
            <InfoItem label="Version" value={settings.version} />
            <InfoItem label="Storage" value="Local JSON files" />
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface-hover px-3.5 py-3 text-xs text-ink-muted">
            <FiGitBranch className="shrink-0 text-amber" size={14} />
            An educational project simulating the core Git workflow: file tracking, staging, commits and version
            history — built without any external Git library.
          </div>
        </section>

        <section className="rounded-xl2 border border-diff-del/30 bg-diff-delBg/30 p-5">
          <h2 className="font-display text-sm font-semibold text-ink">Reset Demo Data</h2>
          <p className="mt-1 text-xs text-ink-muted">
            Permanently deletes every repository, file, commit and history entry. Use this to start fresh.
          </p>
          <Button variant="danger" size="sm" icon={<FiRefreshCw size={13} />} className="mt-4" onClick={() => setResetOpen(true)}>
            Reset Demo Data
          </Button>
        </section>
      </div>

      <ConfirmDialog
        open={resetOpen}
        title="Reset demo data"
        message="This will permanently delete all repositories, files, commits and history. This action cannot be undone."
        confirmLabel={resetting ? "Resetting..." : "Reset everything"}
        onCancel={() => setResetOpen(false)}
        onConfirm={handleReset}
      />
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="mt-1 font-mono text-ink">{value}</p>
    </div>
  );
}
