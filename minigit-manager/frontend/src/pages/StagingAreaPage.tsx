import { FiLayers, FiPlus, FiMinus, FiCheckSquare, FiXCircle } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useRepoContext } from "../store/RepoContext";
import { useStage } from "../hooks/useStage";
import { useToast } from "../store/ToastContext";
import { FileStatus } from "../types";
import { formatRelativeTime } from "../utils/format";

const STATUS_TONE: Record<FileStatus, "add" | "mod" | "neutral"> = {
  untracked: "add",
  modified: "mod",
  unmodified: "neutral",
};

const STATUS_LABEL: Record<FileStatus, string> = {
  untracked: "New",
  modified: "Modified",
  unmodified: "Unchanged",
};

export default function StagingAreaPage() {
  const { activeRepo, activeRepoId } = useRepoContext();
  const { status, loading, stageFile, unstageFile, stageAll, clearStage, stagedCount, changedCount } =
    useStage(activeRepoId);
  const { showToast } = useToast();

  if (!activeRepoId) {
    return (
      <div>
        <PageHeader title="Staging Area" subtitle="Review and stage your changes before committing." />
        <EmptyState
          icon={<FiLayers size={20} />}
          title="No repository selected"
          description="Select a repository from the Repository page to review its staging area."
        />
      </div>
    );
  }

  const changed = status.filter((f) => f.status !== "unmodified");

  const handleStageAll = async () => {
    try {
      await stageAll();
      showToast("All changed files staged");
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  const handleClear = async () => {
    try {
      await clearStage();
      showToast("Staging area cleared");
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  return (
    <div>
      <PageHeader
        title="Staging Area"
        subtitle={`${changedCount} changed file(s) in ${activeRepo?.name || "repository"} · ${stagedCount} staged`}
        action={
          <>
            <Button variant="secondary" size="sm" icon={<FiXCircle size={14} />} onClick={handleClear} disabled={stagedCount === 0}>
              Clear Stage
            </Button>
            <Button size="sm" icon={<FiCheckSquare size={14} />} onClick={handleStageAll} disabled={changed.length === 0}>
              Stage All
            </Button>
          </>
        }
      />

      {loading ? (
        <Loader label="Checking working tree..." />
      ) : changed.length === 0 ? (
        <EmptyState
          icon={<FiLayers size={20} />}
          title="Working tree clean"
          description="There are no new or modified files. Edit files in the File Manager to see them appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-xl2 border border-border bg-surface shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-faint">
                <th className="px-4 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last Updated</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {changed.map((file) => (
                <tr key={file.id} className="border-b border-border/60 last:border-0 hover:bg-surface-hover">
                  <td className="px-4 py-3 font-mono text-[13px] text-ink">{file.path}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[file.status]}>{STATUS_LABEL[file.status]}</Badge>
                    {file.staged && (
                      <span className="ml-2">
                        <Badge tone="amber">Staged</Badge>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-faint">{formatRelativeTime(file.updatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {file.staged ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<FiMinus size={12} />}
                        onClick={() => unstageFile(file.id)}
                      >
                        Unstage
                      </Button>
                    ) : (
                      <Button size="sm" icon={<FiPlus size={12} />} onClick={() => stageFile(file.id)}>
                        Stage
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
