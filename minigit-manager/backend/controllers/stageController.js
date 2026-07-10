const stageService = require("../services/stageService");

function getStatus(req, res, next) {
  try {
    res.json(stageService.getStatus(req.params.repoId));
  } catch (err) {
    next(err);
  }
}

function stageFile(req, res, next) {
  try {
    res.json(stageService.stageFile(req.params.repoId, req.body.fileId));
  } catch (err) {
    next(err);
  }
}

function unstageFile(req, res, next) {
  try {
    res.json(stageService.unstageFile(req.params.repoId, req.body.fileId));
  } catch (err) {
    next(err);
  }
}

function stageAll(req, res, next) {
  try {
    res.json(stageService.stageAll(req.params.repoId));
  } catch (err) {
    next(err);
  }
}

function clearStage(req, res, next) {
  try {
    res.json(stageService.clearStage(req.params.repoId));
  } catch (err) {
    next(err);
  }
}

module.exports = { getStatus, stageFile, unstageFile, stageAll, clearStage };
