const express = require("express");
const router = express.Router({ mergeParams: true });
const historyController = require("../controllers/historyController");

router.get("/", historyController.getHistory);
router.post("/restore/:commitId", historyController.restore);

module.exports = router;
