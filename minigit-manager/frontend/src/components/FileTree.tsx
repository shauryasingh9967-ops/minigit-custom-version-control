import { useState } from "react";
import { FiChevronRight, FiFolder, FiFile, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FileNode } from "../types";

interface FileTreeProps {
  node: FileNode;
  depth?: number;
  onSelectFile: (node: FileNode) => void;
  onCreateIn: (parentId: string) => void;
  onRename: (node: FileNode) => void;
  onDelete: (node: FileNode) => void;
  selectedId?: string | null;
}

export default function FileTree({
  node,
  depth = 0,
  onSelectFile,
  onCreateIn,
  onRename,
  onDelete,
  selectedId,
}: FileTreeProps) {
  const [expanded, setExpanded] = useState(depth < 1);
  const isFolder = node.type === "folder";
  const isRoot = node.id === "root";

  return (
    <div>
      <div
        className={`group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-colors ${
          selectedId === node.id ? "bg-amber/10 text-amber" : "text-ink-muted hover:bg-surface-hover hover:text-ink"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <button
          className="focus-ring flex flex-1 items-center gap-1.5 overflow-hidden text-left"
          onClick={() => (isFolder ? setExpanded((v) => !v) : onSelectFile(node))}
        >
          {isFolder ? (
            <FiChevronRight
              size={13}
              className={`shrink-0 transition-transform text-ink-faint ${expanded ? "rotate-90" : ""}`}
            />
          ) : (
            <span className="w-[13px] shrink-0" />
          )}
          {isFolder ? (
            <FiFolder size={15} className="shrink-0 text-amber/80" />
          ) : (
            <FiFile size={15} className="shrink-0 text-diff-mod" />
          )}
          <span className="truncate font-mono text-[13px]">{node.name}</span>
        </button>

        <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
          {isFolder && (
            <button
              className="focus-ring rounded p-1 hover:bg-surface hover:text-amber"
              title="New file / folder here"
              onClick={() => onCreateIn(node.id)}
            >
              <FiPlus size={13} />
            </button>
          )}
          {!isRoot && (
            <>
              <button
                className="focus-ring rounded p-1 hover:bg-surface hover:text-amber"
                title="Rename"
                onClick={() => onRename(node)}
              >
                <FiEdit2 size={12} />
              </button>
              <button
                className="focus-ring rounded p-1 hover:bg-surface hover:text-diff-del"
                title="Delete"
                onClick={() => onDelete(node)}
              >
                <FiTrash2 size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {isFolder && expanded && node.children && (
        <div>
          {node.children.length === 0 && (
            <p className="py-1 text-[12px] text-ink-faint" style={{ paddingLeft: `${(depth + 1) * 16 + 28}px` }}>
              Empty folder
            </p>
          )}
          {node.children
            .slice()
            .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "folder" ? -1 : 1))
            .map((child) => (
              <FileTree
                key={child.id}
                node={child}
                depth={depth + 1}
                onSelectFile={onSelectFile}
                onCreateIn={onCreateIn}
                onRename={onRename}
                onDelete={onDelete}
                selectedId={selectedId}
              />
            ))}
        </div>
      )}
    </div>
  );
}
