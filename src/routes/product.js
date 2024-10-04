const express = require('express')
const multer  = require('multer')
const storageMulter =require('../helper/storageMulter')
const upload = multer({ storage: storageMulter() })
const router = express.Router()
const productController = require("../controllers/admin/productController")
const auth = require("../middleware/authAdmin")

router.post('/create',upload.single('thumbnail'),productController.createProduct)

module.exports = router