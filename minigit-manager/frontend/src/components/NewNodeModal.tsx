import { useState } from "react";
import { FiFile, FiFolder } from "react-icons/fi";
import Modal from "./Modal";
import Button from "./Button";
import { Input } from "./Input";
import { NodeType } from "../types";

interface NewNodeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, type: NodeType) => Promise<void> | void;
}

export default function NewNodeModal({ open, onClose, onSubmit }: NewNodeModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<NodeType>("file");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(name.trim(), type);
      setName("");
      setType("file");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create new item"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting || !name.trim()}>
            Create
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            className={`focus-ring flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-sm transition-colors ${
              type === "file" ? "border-amber bg-amber/10 text-amber" : "border-border text-ink-muted hover:text-ink"
            }`}
            onClick={() => setType("file")}
          >
            <FiFile size={14} /> File
          </button>
          <button
            className={`focus-ring flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-sm transition-colors ${
              type === "folder"
                ? "border-amber bg-amber/10 text-amber"
                : "border-border text-ink-muted hover:text-ink"
            }`}
            onClick={() => setType("folder")}
          >
            <FiFolder size={14} /> Folder
          </button>
        </div>
        <Input
          label="Name"
          autoFocus
          value={name}
          placeholder={type === "file" ? "e.g. index.js" : "e.g. src"}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
    </Modal>
  );
}
