import { apiClient } from "./client";
import { StagedFileStatus } from "../types";

export const stageApi = {
  getStatus: async (repoId: string): Promise<StagedFileStatus[]> => {
    const { data } = await apiClient.get(`/repos/${repoId}/stage`);
    return data;
  },
  stageFile: async (repoId: string, fileId: string): Promise<void> => {
    await apiClient.post(`/repos/${repoId}/stage/stage`, { fileId });
  },
  unstageFile: async (repoId: string, fileId: string): Promise<void> => {
    await apiClient.post(`/repos/${repoId}/stage/unstage`, { fileId });
  },
  stageAll: async (repoId: string): Promise<void> => {
    await apiClient.post(`/repos/${repoId}/stage/stage-all`);
  },
  clear: async (repoId: string): Promise<void> => {
    await apiClient.delete(`/repos/${repoId}/stage`);
  },
};
