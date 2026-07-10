import { FileNode } from "../types";

export interface FlatFile extends FileNode {
  path: string;
}

export function flattenSnapshot(node: FileNode, parentPath = ""): FlatFile[] {
  const results: FlatFile[] = [];
  const walk = (n: FileNode, p: string) => {
    if (n.type === "file") {
      results.push({ ...n, path: p ? `${p}/${n.name}` : n.name });
    } else if (n.children) {
      const nextPath = n.id === "root" ? "" : `${p ? p + "/" : ""}${n.name}`;
      for (const child of n.children) {
        walk(child, nextPath);
      }
    }
  };
  walk(node, parentPath);
  return results;
}
