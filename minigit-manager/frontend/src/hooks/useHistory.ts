import { useCallback, useEffect, useState } from "react";
import { HistoryEntry } from "../types";
import { historyApi } from "../api/historyApi";

export function useHistory(repoId: string | null) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!repoId) {
      setEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await historyApi.list(repoId);
      setEntries(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const restore = useCallback(
    async (commitId: string) => {
      if (!repoId) return;
      await historyApi.restore(repoId, commitId);
      await refresh();
    },
    [repoId, refresh]
  );

  return { entries, loading, error, refresh, restore };
}
