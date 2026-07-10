import { FiDatabase, FiFile, FiGitCommit, FiEdit2, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { Repository } from "../types";
import { formatRelativeTime } from "../utils/format";

interface RepoCardProps {
  repo: Repository;
  active: boolean;
  onSelect: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export default function RepoCard({ repo, active, onSelect, onRename, onDelete }: RepoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative rounded-xl2 border p-5 transition-colors ${
        active ? "border-amber/50 bg-amber/[0.04] shadow-glow" : "border-border bg-surface hover:border-ink-faint"
      }`}
    >
      <button className="focus-ring block w-full text-left" onClick={onSelect}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber">
            <FiDatabase size={16} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-ink">{repo.name}</p>
            <p className="text-[11px] text-ink-faint">Updated {formatRelativeTime(repo.updatedAt)}</p>
          </div>
        </div>

        {repo.description && <p className="mt-3 line-clamp-2 text-xs text-ink-muted">{repo.description}</p>}

        <div className="mt-4 flex items-center gap-4 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <FiFile size={13} /> {repo.filesCount ?? 0} files
          </span>
          <span className="flex items-center gap-1.5">
            <FiGitCommit size={13} /> {repo.commitsCount ?? 0} commits
          </span>
        </div>
      </button>

      <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
        <button
          className="focus-ring rounded-md border border-border bg-surface-raised p-1.5 text-ink-muted hover:text-amber"
          title="Rename repository"
          onClick={onRename}
        >
          <FiEdit2 size={12} />
        </button>
        <button
          className="focus-ring rounded-md border border-border bg-surface-raised p-1.5 text-ink-muted hover:text-diff-del"
          title="Delete repository"
          onClick={onDelete}
        >
          <FiTrash2 size={12} />
        </button>
      </div>

      {active && (
        <span className="absolute -top-2 left-4 rounded-full bg-amber px-2 py-0.5 text-[10px] font-semibold text-base">
          ACTIVE
        </span>
      )}
    </motion.div>
  );
}
