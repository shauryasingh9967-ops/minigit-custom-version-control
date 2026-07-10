const express = require("express");
const router = express.Router();
const repoController = require("../controllers/repoController");

router.get("/", repoController.list);
router.post("/", repoController.create);
router.get("/:repoId", repoController.getOne);
router.put("/:repoId", repoController.rename);
router.delete("/:repoId", repoController.remove);

module.exports = router;
