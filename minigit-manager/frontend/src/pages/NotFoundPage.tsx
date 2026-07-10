import { Link } from "react-router-dom";
import { FiGitMerge, FiArrowLeft } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/10 text-amber">
        <FiGitMerge size={26} />
      </div>
      <p className="font-mono text-sm text-ink-faint">error: 404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">This branch doesn't exist</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">
        The page you're looking for was never committed. Let's get you back on the main branch.
      </p>
      <Link
        to="/"
        className="focus-ring mt-6 inline-flex items-center gap-2 rounded-lg bg-amber px-4 py-2.5 text-sm font-semibold text-base hover:bg-amber-soft"
      >
        <FiArrowLeft size={14} /> Back to Dashboard
      </Link>
    </div>
  );
}
