import { apiClient } from "./client";
import { FileNode, NodeType } from "../types";

export const fileApi = {
  getTree: async (repoId: string): Promise<FileNode> => {
    const { data } = await apiClient.get(`/repos/${repoId}/files`);
    return data;
  },
  getNode: async (repoId: string, nodeId: string): Promise<FileNode> => {
    const { data } = await apiClient.get(`/repos/${repoId}/files/${nodeId}`);
    return data;
  },
  create: async (
    repoId: string,
    payload: { parentId?: string; name: string; type: NodeType; content?: string }
  ): Promise<FileNode> => {
    const { data } = await apiClient.post(`/repos/${repoId}/files`, payload);
    return data;
  },
  rename: async (repoId: string, nodeId: string, name: string): Promise<FileNode> => {
    const { data } = await apiClient.put(`/repos/${repoId}/files/${nodeId}/rename`, { name });
    return data;
  },
  updateContent: async (repoId: string, nodeId: string, content: string): Promise<FileNode> => {
    const { data } = await apiClient.put(`/repos/${repoId}/files/${nodeId}/content`, { content });
    return data;
  },
  remove: async (repoId: string, nodeId: string): Promise<void> => {
    await apiClient.delete(`/repos/${repoId}/files/${nodeId}`);
  },
};
