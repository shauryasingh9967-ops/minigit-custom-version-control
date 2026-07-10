const { readJSON, writeJSON, repoFilePath } = require("../utils/fileStore");
const { getCommit } = require("./commitService");
const { saveTree } = require("./fileService");
const stageService = require("./stageService");

function getHistory(repoId) {
  return readJSON(repoFilePath(repoId, "history.json"), []).sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}

/**
 * Restores the working tree to the state captured in the given commit's
 * snapshot. This does NOT delete later commits (matching a "checkout"-style
 * restore rather than a destructive history rewrite), keeping the mental
 * model simple for a student project.
 */
function restoreVersion(repoId, commitId) {
  const commit = getCommit(repoId, commitId);
  const restoredTree = JSON.parse(JSON.stringify(commit.snapshot));
  saveTree(repoId, restoredTree);
  stageService.clearStage(repoId);

  const history = readJSON(repoFilePath(repoId, "history.json"), []);
  history.push({
    commitId: commit.id,
    message: `Restored working tree to "${commit.message}" (${commit.id})`,
    timestamp: new Date().toISOString(),
    filesChanged: 0,
    isRestore: true,
  });
  writeJSON(repoFilePath(repoId, "history.json"), history);

  return restoredTree;
}

module.exports = { getHistory, restoreVersion };
