const repoService = require("../services/repoService");
const fileService = require("../services/fileService");
const commitService = require("../services/commitService");
const stageService = require("../services/stageService");

function list(req, res, next) {
  try {
    const repos = repoService.listRepos().map((repo) => {
      const files = fileService.flattenFiles(null, repo.id);
      const commits = commitService.listCommits(repo.id);
      return {
        ...repo,
        filesCount: files.length,
        commitsCount: commits.length,
        lastCommit: commits[0] || null,
      };
    });
    res.json(repos);
  } catch (err) {
    next(err);
  }
}

function getOne(req, res, next) {
  try {
    const repo = repoService.getRepo(req.params.repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });
    const files = fileService.flattenFiles(null, repo.id);
    const commits = commitService.listCommits(repo.id);
    const stagedCount = stageService.getStagedIds(repo.id).length;
    res.json({
      ...repo,
      filesCount: files.length,
      commitsCount: commits.length,
      stagedCount,
      lastCommit: commits[0] || null,
    });
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const repo = repoService.createRepo(req.body);
    res.status(201).json(repo);
  } catch (err) {
    next(err);
  }
}

function rename(req, res, next) {
  try {
    const repo = repoService.renameRepo(req.params.repoId, req.body.name);
    res.json(repo);
  } catch (err) {
    next(err);
  }
}

function remove(req, res, next) {
  try {
    repoService.deleteRepo(req.params.repoId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, rename, remove };
