const express = require('express');
const multer = require('multer');
const storageMulter = require('../helper/storageMulter');
const upload = multer({ storage: storageMulter });
const router = express.Router();
const auth = require("../middleware/authAdmin");
const productController = require("../controllers/admin/productController");

router.get("/", productController.getAll);

// Route để tạo sản phẩm
router.post('/create', auth.requireAuth, upload.array('images'), productController.createProduct);
router.get("/admin",auth.requireAuth,productController.productAdmin)
router.patch("/accept/:id",auth.requireAuth,productController.acceptProduct)
router.delete("/unaccept/:id",auth.requireAuth,productController.unacceptProduct)
router.get("/detail/:id",productController.Detail)
router.patch("/update/:id",auth.requireAuth,upload.array('images'),productController.updateProduct)
router.delete("/delete/:id",auth.requireAuth,productController.deleteProduct)
module.exports = router