const historyService = require("../services/historyService");

function getHistory(req, res, next) {
  try {
    res.json(historyService.getHistory(req.params.repoId));
  } catch (err) {
    next(err);
  }
}

function restore(req, res, next) {
  try {
    const tree = historyService.restoreVersion(req.params.repoId, req.params.commitId);
    res.json(tree);
  } catch (err) {
    next(err);
  }
}

module.exports = { getHistory, restore };
