const express = require('express')
const router = express.Router()
const accountController = require("../controllers/admin/accountController")
const auth = require("../middleware/authAdmin")

router.get('/',accountController.allAccount)
router.post('/register',accountController.Register)
router.get('/detail/:id',accountController.Detail)
router.patch('/update/:id',accountController.Update)
router.post('/login',accountController.Login)
router.post('/password/forgot',accountController.forgotPassword)
router.post('/password/otp',accountController.otpPost)
router.post('/password/resetPassword',accountController.resetPassword)
router.post("/logout",auth.requireAuth,accountController.Logout)
module.exports = router