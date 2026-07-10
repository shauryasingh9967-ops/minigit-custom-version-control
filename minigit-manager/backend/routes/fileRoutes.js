const express = require("express");
const router = express.Router({ mergeParams: true });
const fileController = require("../controllers/fileController");

router.get("/", fileController.getTree);
router.post("/", fileController.create);
router.get("/:nodeId", fileController.getOne);
router.put("/:nodeId/rename", fileController.rename);
router.put("/:nodeId/content", fileController.updateContent);
router.delete("/:nodeId", fileController.remove);

module.exports = router;
