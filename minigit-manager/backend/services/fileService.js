const { v4: uuidv4 } = require("uuid");
const { readJSON, writeJSON, repoFilePath } = require("../utils/fileStore");
const { contentHash } = require("../utils/hash");
const { rootFolder } = require("./repoService");

function loadTree(repoId) {
  return readJSON(repoFilePath(repoId, "files.json"), rootFolder());
}

function saveTree(repoId, tree) {
  writeJSON(repoFilePath(repoId, "files.json"), tree);
}

function findNode(node, id) {
  if (node.id === id) return node;
  if (node.type === "folder" && node.children) {
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
}

function findParent(node, childId) {
  if (node.type === "folder" && node.children) {
    for (const child of node.children) {
      if (child.id === childId) return node;
      const found = findParent(child, childId);
      if (found) return found;
    }
  }
  return null;
}

function assertUniqueSibling(parent, name, excludeId) {
  const clash = (parent.children || []).some(
    (c) => c.id !== excludeId && c.name.toLowerCase() === name.toLowerCase()
  );
  if (clash) {
    const err = new Error(`"${name}" already exists in this folder`);
    err.status = 409;
    throw err;
  }
}

function createNode(repoId, { parentId = "root", name, type, content = "" }) {
  if (!name || !name.trim()) {
    const err = new Error("Name is required");
    err.status = 400;
    throw err;
  }
  if (!["file", "folder"].includes(type)) {
    const err = new Error("Type must be 'file' or 'folder'");
    err.status = 400;
    throw err;
  }
  const tree = loadTree(repoId);
  const parent = findNode(tree, parentId);
  if (!parent || parent.type !== "folder") {
    const err = new Error("Parent folder not found");
    err.status = 404;
    throw err;
  }
  assertUniqueSibling(parent, name.trim());

  const now = new Date().toISOString();
  const node =
    type === "folder"
      ? { id: uuidv4(), name: name.trim(), type: "folder", children: [], createdAt: now, updatedAt: now }
      : {
          id: uuidv4(),
          name: name.trim(),
          type: "file",
          content,
          contentHash: contentHash(content),
          createdAt: now,
          updatedAt: now,
        };

  parent.children.push(node);
  saveTree(repoId, tree);
  return node;
}

function renameNode(repoId, nodeId, name) {
  if (!name || !name.trim()) {
    const err = new Error("Name is required");
    err.status = 400;
    throw err;
  }
  const tree = loadTree(repoId);
  const node = findNode(tree, nodeId);
  if (!node) {
    const err = new Error("File or folder not found");
    err.status = 404;
    throw err;
  }
  const parent = findParent(tree, nodeId);
  if (parent) assertUniqueSibling(parent, name.trim(), nodeId);

  node.name = name.trim();
  node.updatedAt = new Date().toISOString();
  saveTree(repoId, tree);
  return node;
}

function updateFileContent(repoId, nodeId, content) {
  const tree = loadTree(repoId);
  const node = findNode(tree, nodeId);
  if (!node || node.type !== "file") {
    const err = new Error("File not found");
    err.status = 404;
    throw err;
  }
  node.content = content;
  node.contentHash = contentHash(content);
  node.updatedAt = new Date().toISOString();
  saveTree(repoId, tree);
  return node;
}

function deleteNode(repoId, nodeId) {
  if (nodeId === "root") {
    const err = new Error("Cannot delete the root folder");
    err.status = 400;
    throw err;
  }
  const tree = loadTree(repoId);
  const parent = findParent(tree, nodeId);
  if (!parent) {
    const err = new Error("File or folder not found");
    err.status = 404;
    throw err;
  }
  parent.children = parent.children.filter((c) => c.id !== nodeId);
  saveTree(repoId, tree);
  return true;
}

/**
 * Flattens the tree into a list of file leaf nodes with their folder path.
 */
function flattenFiles(node = null, repoId = null, currentPath = "") {
  const tree = node || loadTree(repoId);
  const results = [];
  const walk = (n, p) => {
    if (n.type === "file") {
      results.push({ ...n, path: p ? `${p}/${n.name}` : n.name });
    } else if (n.children) {
      for (const child of n.children) {
        walk(child, n.id === "root" ? "" : `${p ? p + "/" : ""}${n.name}`);
      }
    }
  };
  walk(tree, currentPath);
  return results;
}

module.exports = {
  loadTree,
  saveTree,
  findNode,
  findParent,
  createNode,
  renameNode,
  updateFileContent,
  deleteNode,
  flattenFiles,
};
