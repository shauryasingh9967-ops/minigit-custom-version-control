const fs = require("fs");
const path = require("path");

const DATA_ROOT = path.join(__dirname, "..", "data");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readJSON(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf-8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read JSON at ${filePath}:`, err.message);
    return fallback;
  }
}

function writeJSON(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function repoDir(repoId) {
  return path.join(DATA_ROOT, repoId);
}

function repoFilePath(repoId, fileName) {
  return path.join(repoDir(repoId), fileName);
}

function deleteDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

module.exports = {
  DATA_ROOT,
  ensureDir,
  readJSON,
  writeJSON,
  repoDir,
  repoFilePath,
  deleteDir,
};
