import { useState } from "react";
import { FiPlus, FiDatabase } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import RepoCard from "../components/RepoCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import RenameModal from "../components/RenameModal";
import { Input, Textarea } from "../components/Input";
import { useRepoContext } from "../store/RepoContext";
import { useToast } from "../store/ToastContext";
import { repoApi } from "../api/repoApi";
import { Repository } from "../types";

export default function RepositoryPage() {
  const { repos, activeRepoId, loading, refreshRepos, setActiveRepoId } = useRepoContext();
  const { showToast } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [renameTarget, setRenameTarget] = useState<Repository | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Repository | null>(null);

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

  const handleRename = async (newName: string) => {
    if (!renameTarget) return;
    try {
      await repoApi.rename(renameTarget.id, newName);
      await refreshRepos();
      showToast("Repository renamed");
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await repoApi.remove(deleteTarget.id);
      await refreshRepos();
      showToast("Repository deleted");
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Repository"
        subtitle="Create and manage your local repositories."
        action={
          <Button icon={<FiPlus size={15} />} onClick={() => setCreateOpen(true)}>
            New Repository
          </Button>
        }
      />

      {loading ? (
        <Loader label="Loading repositories..." />
      ) : repos.length === 0 ? (
        <EmptyState
          icon={<FiDatabase size={20} />}
          title="No repositories yet"
          description="Create your first repository to start tracking files and commits."
          action={
            <Button icon={<FiPlus size={15} />} onClick={() => setCreateOpen(true)}>
              Create Repository
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              active={repo.id === activeRepoId}
              onSelect={() => setActiveRepoId(repo.id)}
              onRename={() => setRenameTarget(repo)}
              onDelete={() => setDeleteTarget(repo)}
            />
          ))}
        </div>
      )}

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

      <RenameModal
        open={!!renameTarget}
        initialValue={renameTarget?.name || ""}
        label="Repository name"
        onClose={() => setRenameTarget(null)}
        onSubmit={handleRename}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete repository"
        message={`This will permanently delete "${deleteTarget?.name}" along with all its files, commits and history. This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
