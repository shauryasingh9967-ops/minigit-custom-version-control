export interface Repository {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  filesCount?: number;
  commitsCount?: number;
  stagedCount?: number;
  lastCommit?: Commit | null;
}

export type NodeType = "file" | "folder";

export interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  content?: string;
  contentHash?: string;
  children?: FileNode[];
  createdAt: string;
  updatedAt: string;
}

export type FileStatus = "untracked" | "modified" | "unmodified";

export interface StagedFileStatus {
  id: string;
  name: string;
  path: string;
  status: FileStatus;
  staged: boolean;
  updatedAt: string;
}

export interface Commit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  parentId: string | null;
  stagedFileIds: string[];
  filesChanged: number;
  snapshot?: FileNode;
}

export interface HistoryEntry {
  commitId: string;
  message: string;
  timestamp: string;
  filesChanged: number;
  isRestore?: boolean;
}

export interface AppSettings {
  theme: "dark" | "light";
  appName: string;
  version: string;
}

export interface ApiError {
  message: string;
}
