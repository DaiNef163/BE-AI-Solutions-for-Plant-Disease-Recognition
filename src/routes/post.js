const express = require('express')
const router = express.Router()
const postController = require("../controllers/admin/postController")
const multer  = require('multer')
const storageMulter =require('../helper/storageMulter')
const upload = multer({ storage: storageMulter() })
const auth = require('../middleware/authAdmin')

router.get("/",postController.allPost)
router.post("/create",auth.requireAuth,upload.array('images'),postController.Create)
router.patch("/update/:id",auth.requireAuth,upload.array('images'),postController.Update)
router.delete("/delete/:id",auth.requireAuth,postController.Delete) 
router.get("/detail/:id",postController.detailPost)
router.post("/comments/:id",auth.requireAuth,postController.createComment)
router.delete("/uncomments/:id/:comment_id",auth.requireAuth,postController.deleteComment)
router.patch("/accept/:id",auth.requireAuth,postController.acceptPost)

module.exports = router