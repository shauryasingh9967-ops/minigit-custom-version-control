const { readJSON, writeJSON, repoFilePath } = require("../utils/fileStore");
const { flattenFiles, findNode } = require("./fileService");

function loadStage(repoId) {
  return readJSON(repoFilePath(repoId, "stage.json"), { stagedFileIds: [] });
}

function saveStage(repoId, stage) {
  writeJSON(repoFilePath(repoId, "stage.json"), stage);
}

function getStagedIds(repoId) {
  return loadStage(repoId).stagedFileIds;
}

function lastSnapshotFiles(repoId) {
  // Lazily require to avoid circular-require issues at module load time.
  const { getLastCommit } = require("./commitService");
  const last = getLastCommit(repoId);
  if (!last) return [];
  return flattenFiles(last.snapshot);
}

/**
 * Computes the working status of every file in the repo:
 * - untracked: never committed
 * - modified: committed before, content has since changed
 * - unmodified: matches the last commit exactly
 * Plus whether it is currently staged.
 */
function getStatus(repoId) {
  const currentFiles = flattenFiles(null, repoId);
  const committedFiles = lastSnapshotFiles(repoId);
  const committedById = new Map(committedFiles.map((f) => [f.id, f]));
  const staged = new Set(getStagedIds(repoId));

  return currentFiles.map((file) => {
    const committed = committedById.get(file.id);
    let status = "untracked";
    if (committed) {
      status = committed.contentHash === file.contentHash ? "unmodified" : "modified";
    }
    return {
      id: file.id,
      name: file.name,
      path: file.path,
      status,
      staged: staged.has(file.id),
      updatedAt: file.updatedAt,
    };
  });
}

function assertFileExists(repoId, fileId) {
  const tree = require("./fileService").loadTree(repoId);
  const node = findNode(tree, fileId);
  if (!node || node.type !== "file") {
    const err = new Error("File not found");
    err.status = 404;
    throw err;
  }
}

function stageFile(repoId, fileId) {
  assertFileExists(repoId, fileId);
  const stage = loadStage(repoId);
  if (!stage.stagedFileIds.includes(fileId)) {
    stage.stagedFileIds.push(fileId);
    saveStage(repoId, stage);
  }
  return stage;
}

function unstageFile(repoId, fileId) {
  const stage = loadStage(repoId);
  stage.stagedFileIds = stage.stagedFileIds.filter((id) => id !== fileId);
  saveStage(repoId, stage);
  return stage;
}

function stageAll(repoId) {
  const status = getStatus(repoId).filter((f) => f.status !== "unmodified");
  const stage = { stagedFileIds: status.map((f) => f.id) };
  saveStage(repoId, stage);
  return stage;
}

function clearStage(repoId) {
  const stage = { stagedFileIds: [] };
  saveStage(repoId, stage);
  return stage;
}

module.exports = {
  loadStage,
  getStagedIds,
  getStatus,
  stageFile,
  unstageFile,
  stageAll,
  clearStage,
};
