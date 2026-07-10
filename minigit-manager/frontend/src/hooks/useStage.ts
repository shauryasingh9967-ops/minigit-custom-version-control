import { useCallback, useEffect, useState } from "react";
import { StagedFileStatus } from "../types";
import { stageApi } from "../api/stageApi";

export function useStage(repoId: string | null) {
  const [status, setStatus] = useState<StagedFileStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!repoId) {
      setStatus([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await stageApi.getStatus(repoId);
      setStatus(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const stageFile = useCallback(
    async (fileId: string) => {
      if (!repoId) return;
      await stageApi.stageFile(repoId, fileId);
      await refresh();
    },
    [repoId, refresh]
  );

  const unstageFile = useCallback(
    async (fileId: string) => {
      if (!repoId) return;
      await stageApi.unstageFile(repoId, fileId);
      await refresh();
    },
    [repoId, refresh]
  );

  const stageAll = useCallback(async () => {
    if (!repoId) return;
    await stageApi.stageAll(repoId);
    await refresh();
  }, [repoId, refresh]);

  const clearStage = useCallback(async () => {
    if (!repoId) return;
    await stageApi.clear(repoId);
    await refresh();
  }, [repoId, refresh]);

  const stagedCount = status.filter((f) => f.staged).length;
  const changedCount = status.filter((f) => f.status !== "unmodified").length;

  return { status, loading, error, refresh, stageFile, unstageFile, stageAll, clearStage, stagedCount, changedCount };
}
