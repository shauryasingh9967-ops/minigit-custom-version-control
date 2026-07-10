const fileService = require("../services/fileService");

function getTree(req, res, next) {
  try {
    res.json(fileService.loadTree(req.params.repoId));
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const node = fileService.createNode(req.params.repoId, req.body);
    res.status(201).json(node);
  } catch (err) {
    next(err);
  }
}

function rename(req, res, next) {
  try {
    const node = fileService.renameNode(req.params.repoId, req.params.nodeId, req.body.name);
    res.json(node);
  } catch (err) {
    next(err);
  }
}

function updateContent(req, res, next) {
  try {
    const node = fileService.updateFileContent(req.params.repoId, req.params.nodeId, req.body.content);
    res.json(node);
  } catch (err) {
    next(err);
  }
}

function getOne(req, res, next) {
  try {
    const tree = fileService.loadTree(req.params.repoId);
    const node = fileService.findNode(tree, req.params.nodeId);
    if (!node) return res.status(404).json({ message: "File or folder not found" });
    res.json(node);
  } catch (err) {
    next(err);
  }
}

function remove(req, res, next) {
  try {
    fileService.deleteNode(req.params.repoId, req.params.nodeId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getTree, create, rename, updateContent, getOne, remove };
