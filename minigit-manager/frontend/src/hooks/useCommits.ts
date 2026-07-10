import { useCallback, useEffect, useState } from "react";
import { Commit } from "../types";
import { commitApi } from "../api/commitApi";

export function useCommits(repoId: string | null) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!repoId) {
      setCommits([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await commitApi.list(repoId);
      setCommits(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createCommit = useCallback(
    async (message: string) => {
      if (!repoId) return;
      await commitApi.create(repoId, message);
      await refresh();
    },
    [repoId, refresh]
  );

  return { commits, loading, error, refresh, createCommit };
}
