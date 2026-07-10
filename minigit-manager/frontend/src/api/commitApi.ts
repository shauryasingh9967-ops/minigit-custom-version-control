import { apiClient } from "./client";
import { Commit } from "../types";

export const commitApi = {
  list: async (repoId: string): Promise<Commit[]> => {
    const { data } = await apiClient.get(`/repos/${repoId}/commits`);
    return data;
  },
  get: async (repoId: string, commitId: string): Promise<Commit> => {
    const { data } = await apiClient.get(`/repos/${repoId}/commits/${commitId}`);
    return data;
  },
  create: async (repoId: string, message: string): Promise<Commit> => {
    const { data } = await apiClient.post(`/repos/${repoId}/commits`, { message });
    return data;
  },
};
