const express = require('express')
const router = express.Router()
const postController = require("../controllers/admin/postController")
const auth = require("../middleware/authAdmin")

router.get("/",postController.allPost)
router.post("/create",auth.requireAuth,postController.Create)
router.patch("/update/:id",auth.requireAuth,postController.Update)
router.delete("/delete/:id",auth.requireAuth,postController.Delete) 
router.post("/comments/:id",auth.requireAuth,postController.createComment)
router.delete("/uncomments/:id/:comment_id",auth.requireAuth,postController.deleteComment)

module.exports = router