const express = require("express");
const router = express.Router();
const auth = require("../middleware/authAdmin");
const { viewDisease } = require("../controllers/disease.controller");

router.get("/viewDisease", viewDisease);
module.exports = router;
