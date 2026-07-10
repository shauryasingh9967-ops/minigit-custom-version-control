import { useState } from "react";
import { FiPlus, FiFolder } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import FileTree from "../components/FileTree";
import CodeEditor from "../components/CodeEditor";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import NewNodeModal from "../components/NewNodeModal";
import RenameModal from "../components/RenameModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useRepoContext } from "../store/RepoContext";
import { useFiles } from "../hooks/useFiles";
import { useToast } from "../store/ToastContext";
import { FileNode, NodeType } from "../types";

export default function FileManagerPage() {
  const { activeRepo, activeRepoId } = useRepoContext();
  const { tree, loading, createNode, renameNode, updateContent, removeNode } = useFiles(activeRepoId);
  const { showToast } = useToast();

  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [createParentId, setCreateParentId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<FileNode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FileNode | null>(null);

  if (!activeRepoId) {
    return (
      <div>
        <PageHeader title="File Manager" subtitle="Create, edit and organize files in your repository." />
        <EmptyState
          icon={<FiFolder size={20} />}
          title="No repository selected"
          description="Create or select a repository from the Repository page to manage its files."
        />
      </div>
    );
  }

  const handleCreate = async (name: string, type: NodeType) => {
    try {
      await createNode(createParentId || "root", name, type);
      showToast(`${type === "file" ? "File" : "Folder"} "${name}" created`);
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  const handleRename = async (name: string) => {
    if (!renameTarget) return;
    try {
      await renameNode(renameTarget.id, name);
      showToast("Renamed successfully");
      if (selectedFile?.id === renameTarget.id) setSelectedFile({ ...renameTarget, name });
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeNode(deleteTarget.id);
      showToast(`"${deleteTarget.name}" deleted`);
      if (selectedFile?.id === deleteTarget.id) setSelectedFile(null);
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSaveContent = async (content: string) => {
    if (!selectedFile) return;
    try {
      await updateContent(selectedFile.id, content);
      setSelectedFile({ ...selectedFile, content });
      showToast("File saved");
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  return (
    <div>
      <PageHeader
        title="File Manager"
        subtitle={`Managing files in ${activeRepo?.name || "repository"}.`}
        action={
          <Button
            icon={<FiPlus size={15} />}
            onClick={() => {
              setCreateParentId("root");
            }}
          >
            New File / Folder
          </Button>
        }
      />

      {loading || !tree ? (
        <Loader label="Loading file tree..." />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
          <div className="rounded-xl2 border border-border bg-surface p-3 shadow-card">
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-ink-faint">Folder Tree</p>
            <FileTree
              node={tree}
              onSelectFile={setSelectedFile}
              onCreateIn={setCreateParentId}
              onRename={setRenameTarget}
              onDelete={setDeleteTarget}
              selectedId={selectedFile?.id}
            />
          </div>
          <CodeEditor file={selectedFile} onSave={handleSaveContent} />
        </div>
      )}

      <NewNodeModal open={!!createParentId} onClose={() => setCreateParentId(null)} onSubmit={handleCreate} />
      <RenameModal
        open={!!renameTarget}
        initialValue={renameTarget?.name || ""}
        label={renameTarget?.type === "folder" ? "Folder name" : "File name"}
        onClose={() => setRenameTarget(null)}
        onSubmit={handleRename}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.type}`}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? ${
          deleteTarget?.type === "folder" ? "All files inside it will be deleted too." : ""
        }`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
