const express = require("express");
const router = express.Router();
const { viewNameLeaf, createLeaf } = require("../controllers/leaf.controller");

router.get("/nameLeaf", viewNameLeaf);
router.post("/create", createLeaf);
module.exports = router;
