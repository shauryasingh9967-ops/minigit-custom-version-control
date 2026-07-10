import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  accent?: string;
}

export default function StatCard({ label, value, icon, accent = "text-amber" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl2 border border-border bg-surface p-5 shadow-card"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</span>
        <span className={`${accent}`}>{icon}</span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold text-ink">{value}</p>
    </motion.div>
  );
}
