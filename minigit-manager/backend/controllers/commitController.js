const commitService = require("../services/commitService");

function list(req, res, next) {
  try {
    res.json(commitService.listCommits(req.params.repoId));
  } catch (err) {
    next(err);
  }
}

function getOne(req, res, next) {
  try {
    res.json(commitService.getCommit(req.params.repoId, req.params.commitId));
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const commit = commitService.createCommit(req.params.repoId, req.body);
    res.status(201).json(commit);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create };
