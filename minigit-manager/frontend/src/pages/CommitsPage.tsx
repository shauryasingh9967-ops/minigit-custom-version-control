import { useState } from "react";
import { FiGitCommit } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import { Textarea } from "../components/Input";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import { CommitTimeline, CommitTimelineItem } from "../components/CommitTimeline";
import { useRepoContext } from "../store/RepoContext";
import { useCommits } from "../hooks/useCommits";
import { useStage } from "../hooks/useStage";
import { useToast } from "../store/ToastContext";
import { Commit } from "../types";
import { formatDateTime, formatRelativeTime } from "../utils/format";
import { flattenSnapshot } from "../utils/tree";

export default function CommitsPage() {
  const { activeRepo, activeRepoId } = useRepoContext();
  const { commits, loading, createCommit } = useCommits(activeRepoId);
  const { stagedCount, refresh: refreshStage } = useStage(activeRepoId);
  const { showToast } = useToast();

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [viewing, setViewing] = useState<Commit | null>(null);

  if (!activeRepoId) {
    return (
      <div>
        <PageHeader title="Commits" subtitle="Create commits and browse the commit log." />
        <EmptyState
          icon={<FiGitCommit size={20} />}
          title="No repository selected"
          description="Select a repository from the Repository page to view its commits."
        />
      </div>
    );
  }

  const handleCommit = async () => {
    if (!message.trim() || stagedCount === 0) return;
    setSubmitting(true);
    try {
      await createCommit(message.trim());
      await refreshStage();
      setMessage("");
      showToast("Commit created");
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Commits" subtitle={`Commit history for ${activeRepo?.name || "repository"}.`} />

      <div className="mb-8 rounded-xl2 border border-border bg-surface p-5 shadow-card">
        <p className="mb-3 text-sm font-medium text-ink">
          Create commit {stagedCount > 0 ? `(${stagedCount} file(s) staged)` : ""}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Textarea
              rows={2}
              placeholder={stagedCount === 0 ? "Stage files first from the Staging Area" : "Describe your changes..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={stagedCount === 0}
            />
          </div>
          <Button onClick={handleCommit} disabled={stagedCount === 0 || !message.trim() || submitting}>
            {submitting ? "Committing..." : "Commit"}
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading commit history..." />
      ) : commits.length === 0 ? (
        <EmptyState
          icon={<FiGitCommit size={20} />}
          title="No commits yet"
          description="Stage some files and create your first commit."
        />
      ) : (
        <CommitTimeline>
          {commits.map((commit, i) => (
            <CommitTimelineItem
              key={commit.id}
              index={i}
              hash={commit.id}
              title={commit.message}
              meta={`${formatDateTime(commit.timestamp)} · ${commit.filesChanged} file(s) changed`}
              tone={i === 0 ? "amber" : "muted"}
              action={
                <button
                  className="focus-ring text-xs font-medium text-amber hover:underline"
                  onClick={() => setViewing(commit)}
                >
                  View details
                </button>
              }
            />
          ))}
        </CommitTimeline>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`Commit ${viewing?.id || ""}`}>
        {viewing && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-faint">Message</p>
              <p className="mt-1 text-sm text-ink">{viewing.message}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-faint">Author</p>
                <p className="mt-1 text-ink">{viewing.author}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-faint">Timestamp</p>
                <p className="mt-1 text-ink">{formatRelativeTime(viewing.timestamp)}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-ink-faint">
                Files changed ({viewing.filesChanged})
              </p>
              <ul className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-lg border border-border bg-base p-2">
                {viewing.snapshot &&
                  flattenSnapshot(viewing.snapshot)
                    .filter((f) => viewing.stagedFileIds.includes(f.id))
                    .map((f) => (
                      <li key={f.id} className="rounded-md px-2 py-1 font-mono text-xs text-ink-muted">
                        {f.path}
                      </li>
                    ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
