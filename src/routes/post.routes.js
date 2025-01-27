const express = require("express");
const router = express.Router();
const auth = require("../middleware/authAdmin");
// const multer  = require('multer')
// const storageMulter =require('../helper/storageMulter')
// const upload = multer({ storage: storageMulter() })
const {
  viewPostNews,
  createPostNews,
  viewPostNewsUser,
  deletePost,
} = require("../controllers/post.controller");
const { deleteUser } = require("../controllers/userController.controller");

router.get("/view", viewPostNews);
router.get("/viewpost", auth.requireAuth, viewPostNewsUser);
router.post("/createPostNews", auth.requireAuth, createPostNews);
router.delete("/delete/:id", auth.requireAuth, deletePost);
// router.post("/create",auth.requireAuth,upload.array('images'),postController.Create)
// router.patch("/update/:id",auth.requireAuth,upload.array('images'),postController.Update)
// router.get("/detail/:id",postController.detailPost)
// router.post("/comments/:id",auth.requireAuth,postController.createComment)
// router.delete("/uncomments/:id/:comment_id",auth.requireAuth,postController.deleteComment)
// router.patch("/accept/:id",auth.requireAuth,postController.acceptPost)
// router.get("/postadmin",auth.requireAuth,postController.postAdmin)
// router.delete("/unaccept/:id",auth.requireAuth,postController.unAccept)
module.exports = router;
