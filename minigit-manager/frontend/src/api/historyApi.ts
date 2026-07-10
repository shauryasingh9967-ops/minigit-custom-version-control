import { apiClient } from "./client";
import { FileNode, HistoryEntry } from "../types";

export const historyApi = {
  list: async (repoId: string): Promise<HistoryEntry[]> => {
    const { data } = await apiClient.get(`/repos/${repoId}/history`);
    return data;
  },
  restore: async (repoId: string, commitId: string): Promise<FileNode> => {
    const { data } = await apiClient.post(`/repos/${repoId}/history/restore/${commitId}`);
    return data;
  },
};
