import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiDatabase, FiFile, FiGitCommit, FiLayers, FiPlus, FiArrowRight, FiGitBranch } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import { CommitTimeline, CommitTimelineItem } from "../components/CommitTimeline";
import Modal from "../components/Modal";
import { Input, Textarea } from "../components/Input";
import { useRepoContext } from "../store/RepoContext";
import { useCommits } from "../hooks/useCommits";
import { useStage } from "../hooks/useStage";
import { useToast } from "../store/ToastContext";
import { repoApi } from "../api/repoApi";
import { formatRelativeTime } from "../utils/format";

export default function Dashboard() {
  const { repos, activeRepoId, activeRepo, refreshRepos, setActiveRepoId } = useRepoContext();
  const { commits, loading: commitsLoading } = useCommits(activeRepoId);
  const { changedCount, stagedCount } = useStage(activeRepoId);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const repo = await repoApi.create({ name: name.trim(), description: description.trim() });
      await refreshRepos();
      setActiveRepoId(repo.id);
      showToast(`Repository "${repo.name}" created`);
      setName("");
      setDescription("");
      setCreateOpen(false);
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="A quick overview of your local repositories and recent activity."
        action={
          <Button icon={<FiPlus size={15} />} onClick={() => setCreateOpen(true)}>
            New Repository
          </Button>
        }
      />

      <div className="mb-8 rounded-xl2 border border-border bg-gradient-to-br from-surface to-surface-raised p-6 shadow-card">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/15 text-amber">
              <FiGitBranch size={20} />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">
                Welcome back{activeRepo ? `, working on ${activeRepo.name}` : ""}
              </p>
              <p className="text-sm text-ink-muted">
                {repos.length === 0
                  ? "Create your first repository to start tracking changes."
                  : "Stage your changes and commit whenever you're ready."}
              </p>
            </div>
          </div>
          {activeRepo && (
            <Button variant="secondary" icon={<FiArrowRight size={14} />} onClick={() => navigate("/staging")}>
              Go to Staging
            </Button>
          )}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Repositories" value={repos.length} icon={<FiDatabase size={18} />} />
        <StatCard label="Files" value={activeRepo?.filesCount ?? 0} icon={<FiFile size={18} />} accent="text-diff-mod" />
        <StatCard label="Commits" value={activeRepo?.commitsCount ?? 0} icon={<FiGitCommit size={18} />} accent="text-diff-add" />
        <StatCard label="Staged Files" value={stagedCount} icon={<FiLayers size={18} />} accent="text-amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Recent Commits
          </h2>
          {commitsLoading ? (
            <Loader label="Loading commits..." />
          ) : commits.length === 0 ? (
            <EmptyState
              icon={<FiGitCommit size={20} />}
              title="No commits yet"
              description={
                activeRepo
                  ? "Stage some files and create your first commit to see it here."
                  : "Select or create a repository to get started."
              }
            />
          ) : (
            <CommitTimeline>
              {commits.slice(0, 5).map((commit, i) => (
                <CommitTimelineItem
                  key={commit.id}
                  index={i}
                  hash={commit.id}
                  title={commit.message}
                  meta={`${formatRelativeTime(commit.timestamp)} · ${commit.filesChanged} file(s) changed`}
                  tone={i === 0 ? "amber" : "muted"}
                />
              ))}
            </CommitTimeline>
          )}
        </div>

        <div>
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-2.5">
            <QuickAction label="Manage files" hint="Create, edit, delete" onClick={() => navigate("/files")} />
            <QuickAction
              label="Review staging area"
              hint={`${changedCount} file(s) changed`}
              onClick={() => navigate("/staging")}
            />
            <QuickAction label="View commit history" hint="Browse the commit log" onClick={() => navigate("/commits")} />
            <QuickAction label="Version history" hint="Restore an earlier snapshot" onClick={() => navigate("/history")} />
          </div>
        </div>
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create new repository"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={submitting || !name.trim()}>
              Create
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Repository name" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. eduplex-backend" />
          <Textarea
            label="Description (optional)"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this repository for?"
          />
        </div>
      </Modal>
    </div>
  );
}

function QuickAction({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="focus-ring flex items-center justify-between rounded-xl2 border border-border bg-surface px-4 py-3.5 text-left transition-colors hover:border-amber/40 hover:bg-surface-hover"
    >
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-faint">{hint}</p>
      </div>
      <FiArrowRight size={14} className="text-ink-faint" />
    </button>
  );
}
