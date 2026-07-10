const { v4: uuidv4 } = require("uuid");
const {
  DATA_ROOT,
  readJSON,
  writeJSON,
  repoDir,
  repoFilePath,
  deleteDir,
  ensureDir,
} = require("../utils/fileStore");

const INDEX_PATH = () => require("path").join(DATA_ROOT, "repositories.json");

function readIndex() {
  return readJSON(INDEX_PATH(), []);
}

function writeIndex(list) {
  writeJSON(INDEX_PATH(), list);
}

function rootFolder() {
  return {
    id: "root",
    name: "root",
    type: "folder",
    children: [],
  };
}

function listRepos() {
  return readIndex();
}

function getRepo(repoId) {
  const repos = readIndex();
  return repos.find((r) => r.id === repoId) || null;
}

function createRepo({ name, description }) {
  if (!name || !name.trim()) {
    const err = new Error("Repository name is required");
    err.status = 400;
    throw err;
  }
  const repos = readIndex();
  if (repos.some((r) => r.name.toLowerCase() === name.trim().toLowerCase())) {
    const err = new Error("A repository with this name already exists");
    err.status = 409;
    throw err;
  }

  const repo = {
    id: uuidv4(),
    name: name.trim(),
    description: description || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  repos.push(repo);
  writeIndex(repos);

  ensureDir(repoDir(repo.id));
  writeJSON(repoFilePath(repo.id, "repository.json"), repo);
  writeJSON(repoFilePath(repo.id, "files.json"), rootFolder());
  writeJSON(repoFilePath(repo.id, "stage.json"), { stagedFileIds: [] });
  writeJSON(repoFilePath(repo.id, "commits.json"), []);
  writeJSON(repoFilePath(repo.id, "history.json"), []);

  return repo;
}

function renameRepo(repoId, name) {
  if (!name || !name.trim()) {
    const err = new Error("Repository name is required");
    err.status = 400;
    throw err;
  }
  const repos = readIndex();
  const repo = repos.find((r) => r.id === repoId);
  if (!repo) {
    const err = new Error("Repository not found");
    err.status = 404;
    throw err;
  }
  repo.name = name.trim();
  repo.updatedAt = new Date().toISOString();
  writeIndex(repos);
  writeJSON(repoFilePath(repoId, "repository.json"), repo);
  return repo;
}

function deleteRepo(repoId) {
  const repos = readIndex();
  const next = repos.filter((r) => r.id !== repoId);
  if (next.length === repos.length) {
    const err = new Error("Repository not found");
    err.status = 404;
    throw err;
  }
  writeIndex(next);
  deleteDir(repoDir(repoId));
  return true;
}

function touchRepo(repoId) {
  const repos = readIndex();
  const repo = repos.find((r) => r.id === repoId);
  if (repo) {
    repo.updatedAt = new Date().toISOString();
    writeIndex(repos);
  }
}

module.exports = {
  listRepos,
  getRepo,
  createRepo,
  renameRepo,
  deleteRepo,
  touchRepo,
  rootFolder,
};
