const express = require("express");
const router = express.Router();
const auth = require("../middleware/authAdmin");
const { viewDisease, createTreatment } = require("../controllers/treatment.controller");

router.get("/", viewDisease);
router.post("/create", createTreatment);

module.exports = router;
