const express = require('express')
const multer  = require('multer')
const storageMulter =require('../helper/storageMulter')
const upload = multer({ storage: storageMulter() })
const router = express.Router()
const productController = require("../controllers/admin/productController")
const auth = require("../middleware/authAdmin")

router.get("/",productController.getAll)
router.post('/create',upload.single('thumbnail'),productController.createProduct)
router.get("/detail/:id",productController.Detail)
router.patch("/update/:id",upload.single('thumbnail'),productController.updateProduct)
router.delete("/delete/:id",productController.deleteProduct)
module.exports = router