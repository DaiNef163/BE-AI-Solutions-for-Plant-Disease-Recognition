const express = require("express");
const router = express.Router();
const accountController = require("../controllers/admin/accountController");
const auth = require("../middleware/authAdmin");

router.get("/", accountController.allAccount);
router.post("/register", accountController.createAccount);
router.get("/detail/:id", accountController.Detail);
router.patch("/update/:id", accountController.Update);
router.post("/login", accountController.Login);
router.post("/password/forgot", accountController.forgotPassword);
router.post("/password/otp", accountController.otpPost);
router.post("/password/resetPassword", accountController.resetPassword);
router.delete("/delete/:id", accountController.deleteAccount);
router.post("/logout", accountController.Logout);
module.exports = router;
