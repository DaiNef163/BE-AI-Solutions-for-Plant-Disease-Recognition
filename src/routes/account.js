const express = require("express");
const router = express.Router();
const accountController = require("../controllers/admin/accountController");
const auth = require("../middleware/authAdmin");

router.get('/',accountController.allAccount)
router.post('/create',auth.requireAuth,accountController.createAccount)
router.get('/detail/:id',auth.requireAuth,accountController.Detail)
router.patch('/update/:id',auth.requireAuth,accountController.Update)
router.post('/login',accountController.Login)
router.post('/password/forgot',accountController.forgotPassword)
router.post('/password/otp',accountController.otpPost)
router.post('/password/resetPassword',accountController.resetPassword)
router.delete("/delete/:id",auth.requireAuth,accountController.deleteAccount)
router.post("/logout",auth.requireAuth,accountController.Logout)
module.exports = router
