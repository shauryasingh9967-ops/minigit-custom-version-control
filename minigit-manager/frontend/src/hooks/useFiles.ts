import { useCallback, useEffect, useState } from "react";
import { FileNode, NodeType } from "../types";
import { fileApi } from "../api/fileApi";

export function useFiles(repoId: string | null) {
  const [tree, setTree] = useState<FileNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!repoId) {
      setTree(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fileApi.getTree(repoId);
      setTree(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createNode = useCallback(
    async (parentId: string, name: string, type: NodeType, content = "") => {
      if (!repoId) return;
      await fileApi.create(repoId, { parentId, name, type, content });
      await refresh();
    },
    [repoId, refresh]
  );

  const renameNode = useCallback(
    async (nodeId: string, name: string) => {
      if (!repoId) return;
      await fileApi.rename(repoId, nodeId, name);
      await refresh();
    },
    [repoId, refresh]
  );

  const updateContent = useCallback(
    async (nodeId: string, content: string) => {
      if (!repoId) return;
      await fileApi.updateContent(repoId, nodeId, content);
      await refresh();
    },
    [repoId, refresh]
  );

  const removeNode = useCallback(
    async (nodeId: string) => {
      if (!repoId) return;
      await fileApi.remove(repoId, nodeId);
      await refresh();
    },
    [repoId, refresh]
  );

  return { tree, loading, error, refresh, createNode, renameNode, updateContent, removeNode };
}
