export default function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 text-ink-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-amber" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
