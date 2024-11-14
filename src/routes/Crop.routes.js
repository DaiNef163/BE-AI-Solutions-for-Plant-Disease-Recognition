const express = require("express")
const router = express.Router()
const CropController = require("../controllers/crop.controller")
const auth = require("../middleware/authAdmin")


router.get("/",auth.requireAuth,CropController.getAll)
router.post("/create",auth.requireAuth,CropController.createCrop)
router.get("/detail/:id",auth.requireAuth,CropController.detailCrop)
router.patch("/update/:id",auth.requireAuth,CropController.updateSick)
router.patch("/edit/:id",auth.requireAuth,CropController.editCrop)
router.delete("/delete/:id",auth.requireAuth,CropController.deleteCrop)
module.exports = router