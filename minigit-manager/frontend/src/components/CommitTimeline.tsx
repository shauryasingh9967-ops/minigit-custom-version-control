import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CommitTimelineProps {
  children: ReactNode;
}

export function CommitTimeline({ children }: CommitTimelineProps) {
  return <div className="commit-rail flex flex-col gap-1 pl-1">{children}</div>;
}

interface CommitTimelineItemProps {
  hash: string;
  title: string;
  meta: string;
  tone?: "amber" | "muted";
  action?: ReactNode;
  index: number;
}

export function CommitTimelineItem({ hash, title, meta, tone = "muted", action, index }: CommitTimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
      className="relative flex items-start gap-4 py-3 pl-9"
    >
      <span
        className={`absolute left-[9px] top-[18px] h-3 w-3 rounded-full border-2 ${
          tone === "amber" ? "border-amber bg-amber" : "border-border bg-surface"
        }`}
      />
      <div className="min-w-0 flex-1 rounded-xl2 border border-border bg-surface px-4 py-3 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-ink">{title}</p>
          <code className="shrink-0 rounded-md bg-surface-hover px-2 py-0.5 font-mono text-[11px] text-amber">
            {hash}
          </code>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <p className="text-xs text-ink-faint">{meta}</p>
          {action}
        </div>
      </div>
    </motion.div>
  );
}
