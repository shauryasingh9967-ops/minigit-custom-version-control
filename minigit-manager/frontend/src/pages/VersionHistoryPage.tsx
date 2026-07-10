import { useState } from "react";
import { FiClock, FiRotateCcw } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { CommitTimeline, CommitTimelineItem } from "../components/CommitTimeline";
import { useRepoContext } from "../store/RepoContext";
import { useHistory } from "../hooks/useHistory";
import { useToast } from "../store/ToastContext";
import { formatDateTime } from "../utils/format";
import { HistoryEntry } from "../types";

export default function VersionHistoryPage() {
  const { activeRepo, activeRepoId } = useRepoContext();
  const { entries, loading, restore } = useHistory(activeRepoId);
  const { showToast } = useToast();
  const [restoreTarget, setRestoreTarget] = useState<HistoryEntry | null>(null);

  if (!activeRepoId) {
    return (
      <div>
        <PageHeader title="Version History" subtitle="Browse and restore previous versions of your repository." />
        <EmptyState
          icon={<FiClock size={20} />}
          title="No repository selected"
          description="Select a repository from the Repository page to view its version history."
        />
      </div>
    );
  }

  const handleRestore = async () => {
    if (!restoreTarget) return;
    try {
      await restore(restoreTarget.commitId);
      showToast("Working tree restored to selected version");
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setRestoreTarget(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Version History"
        subtitle={`Full timeline of commits and restores for ${activeRepo?.name || "repository"}.`}
      />

      {loading ? (
        <Loader label="Loading history..." />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<FiClock size={20} />}
          title="No history yet"
          description="Once you make commits, their timeline will appear here."
        />
      ) : (
        <CommitTimeline>
          {entries.map((entry, i) => (
            <CommitTimelineItem
              key={`${entry.commitId}-${entry.timestamp}`}
              index={i}
              hash={entry.commitId}
              title={entry.message}
              meta={formatDateTime(entry.timestamp)}
              tone={entry.isRestore ? "muted" : i === 0 ? "amber" : "muted"}
              action={
                !entry.isRestore && (
                  <button
                    className="focus-ring flex items-center gap-1 text-xs font-medium text-amber hover:underline"
                    onClick={() => setRestoreTarget(entry)}
                  >
                    <FiRotateCcw size={12} /> Restore this version
                  </button>
                )
              }
            />
          ))}
        </CommitTimeline>
      )}

      <ConfirmDialog
        open={!!restoreTarget}
        title="Restore version"
        message={`This will replace your current working files with the snapshot from "${restoreTarget?.message}". Your staging area will be cleared. Later commits will not be deleted.`}
        confirmLabel="Restore"
        danger={false}
        onCancel={() => setRestoreTarget(null)}
        onConfirm={handleRestore}
      />
    </div>
  );
}
