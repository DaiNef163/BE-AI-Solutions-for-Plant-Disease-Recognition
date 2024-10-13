const express = require('express')
const router = express.Router()
const postController = require("../controllers/admin/postController")
const multer  = require('multer')
const storageMulter =require('../helper/storageMulter')
const upload = multer({ storage: storageMulter() })

router.get("/",postController.allPost)
router.post("/create",upload.single('image'),postController.Create)
router.patch("/update/:id",upload.single('image'),postController.Update)
router.delete("/delete/:id",postController.Delete) 
router.get("/detail/:id",postController.detailPost)
router.post("/comments/:id",postController.createComment)
router.delete("/uncomments/:id/:comment_id",postController.deleteComment)

module.exports = router