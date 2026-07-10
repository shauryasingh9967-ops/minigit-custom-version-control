import { useEffect, useState } from "react";
import { FiSave, FiFile } from "react-icons/fi";
import Button from "./Button";
import { FileNode } from "../types";

interface CodeEditorProps {
  file: FileNode | null;
  onSave: (content: string) => Promise<void> | void;
}

export default function CodeEditor({ file, onSave }: CodeEditorProps) {
  const [content, setContent] = useState(file?.content || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setContent(file?.content || "");
  }, [file?.id, file?.content]);

  if (!file) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-2 rounded-xl2 border border-dashed border-border text-ink-faint">
        <FiFile size={22} />
        <p className="text-sm">Select a file to view or edit its content</p>
      </div>
    );
  }

  const dirty = content !== (file.content || "");
  const lineCount = content ? content.split("\n").length : 1;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(content);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl2 border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-sm text-ink">
          <FiFile size={14} className="text-diff-mod" />
          {file.name}
          {dirty && <span className="h-1.5 w-1.5 rounded-full bg-amber" title="Unsaved changes" />}
        </div>
        <Button size="sm" icon={<FiSave size={13} />} onClick={handleSave} disabled={!dirty || saving}>
          {saving ? "Saving..." : "Save file"}
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="select-none border-r border-border bg-base/40 px-3 py-3 text-right font-mono text-xs leading-6 text-ink-faint">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          className="focus-ring w-full flex-1 resize-none bg-transparent px-3 py-3 font-mono text-xs leading-6 text-ink outline-none"
        />
      </div>
    </div>
  );
}
