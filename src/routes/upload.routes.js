const express = require("express");
const multer = require("multer");
const storageMulter = require("../helper/storageMulter");
const router = express.Router();
const auth = require("../middleware/authAdmin");
const {
  uploadSingleFile,
  uploadMultipleFile,
} = require("../services/fileServiceUpload.service");

router.post("/upload", uploadSingleFile);
router.post("/uploads", uploadMultipleFile);

module.exports = router;
