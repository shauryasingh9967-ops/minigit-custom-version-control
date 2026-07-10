const { readJSON, writeJSON, repoFilePath } = require("../utils/fileStore");
const { shortHash } = require("../utils/hash");
const { loadTree } = require("./fileService");
const stageService = require("./stageService");

function loadCommits(repoId) {
  return readJSON(repoFilePath(repoId, "commits.json"), []);
}

function saveCommits(repoId, commits) {
  writeJSON(repoFilePath(repoId, "commits.json"), commits);
}

function listCommits(repoId) {
  return loadCommits(repoId)
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function getCommit(repoId, commitId) {
  const commit = loadCommits(repoId).find((c) => c.id === commitId);
  if (!commit) {
    const err = new Error("Commit not found");
    err.status = 404;
    throw err;
  }
  return commit;
}

function getLastCommit(repoId) {
  const commits = listCommits(repoId);
  return commits.length ? commits[0] : null;
}

function createCommit(repoId, { message, author = "Student Developer" }) {
  if (!message || !message.trim()) {
    const err = new Error("Commit message is required");
    err.status = 400;
    throw err;
  }
  const staged = stageService.getStagedIds(repoId);
  if (staged.length === 0) {
    const err = new Error("No files staged for commit");
    err.status = 400;
    throw err;
  }

  const tree = loadTree(repoId);
  const commits = loadCommits(repoId);
  const parentId = commits.length ? commits[commits.length - 1].id : null;

  const commit = {
    id: shortHash(`${repoId}-${Date.now()}-${message}-${Math.random()}`),
    message: message.trim(),
    author,
    timestamp: new Date().toISOString(),
    parentId,
    stagedFileIds: staged,
    filesChanged: staged.length,
    snapshot: JSON.parse(JSON.stringify(tree)),
  };

  commits.push(commit);
  saveCommits(repoId, commits);
  stageService.clearStage(repoId);

  // append to history timeline
  const history = readJSON(repoFilePath(repoId, "history.json"), []);
  history.push({
    commitId: commit.id,
    message: commit.message,
    timestamp: commit.timestamp,
    filesChanged: commit.filesChanged,
  });
  writeJSON(repoFilePath(repoId, "history.json"), history);

  return commit;
}

module.exports = {
  loadCommits,
  listCommits,
  getCommit,
  getLastCommit,
  createCommit,
};
