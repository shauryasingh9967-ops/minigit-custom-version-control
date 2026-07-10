const express = require("express");
const router = express.Router({ mergeParams: true });
const stageController = require("../controllers/stageController");

router.get("/", stageController.getStatus);
router.post("/stage", stageController.stageFile);
router.post("/unstage", stageController.unstageFile);
router.post("/stage-all", stageController.stageAll);
router.delete("/", stageController.clearStage);

module.exports = router;
