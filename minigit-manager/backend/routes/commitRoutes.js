const express = require("express");
const router = express.Router({ mergeParams: true });
const commitController = require("../controllers/commitController");

router.get("/", commitController.list);
router.post("/", commitController.create);
router.get("/:commitId", commitController.getOne);

module.exports = router;
