import { apiClient } from "./client";
import { Repository } from "../types";

export const repoApi = {
  list: async (): Promise<Repository[]> => {
    const { data } = await apiClient.get("/repos");
    return data;
  },
  get: async (repoId: string): Promise<Repository> => {
    const { data } = await apiClient.get(`/repos/${repoId}`);
    return data;
  },
  create: async (payload: { name: string; description?: string }): Promise<Repository> => {
    const { data } = await apiClient.post("/repos", payload);
    return data;
  },
  rename: async (repoId: string, name: string): Promise<Repository> => {
    const { data } = await apiClient.put(`/repos/${repoId}`, { name });
    return data;
  },
  remove: async (repoId: string): Promise<void> => {
    await apiClient.delete(`/repos/${repoId}`);
  },
};
