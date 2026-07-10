import { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { Input } from "./Input";

interface RenameModalProps {
  open: boolean;
  initialValue: string;
  label?: string;
  onClose: () => void;
  onSubmit: (value: string) => Promise<void> | void;
}

export default function RenameModal({ open, initialValue, label = "Name", onClose, onSubmit }: RenameModalProps) {
  const [value, setValue] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setValue(initialValue), [initialValue, open]);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(value.trim());
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Rename ${label.toLowerCase()}`}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting || !value.trim()}>
            Save
          </Button>
        </>
      }
    >
      <Input
        label={label}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
    </Modal>
  );
}
