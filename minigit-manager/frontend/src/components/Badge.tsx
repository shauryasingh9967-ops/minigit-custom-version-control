import { ReactNode } from "react";

type Tone = "amber" | "add" | "del" | "mod" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  amber: "bg-amber/10 text-amber border-amber/30",
  add: "bg-diff-addBg text-diff-add border-diff-add/30",
  del: "bg-diff-delBg text-diff-del border-diff-del/30",
  mod: "bg-diff-modBg text-diff-mod border-diff-mod/30",
  neutral: "bg-surface-hover text-ink-muted border-border",
};

export default function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
