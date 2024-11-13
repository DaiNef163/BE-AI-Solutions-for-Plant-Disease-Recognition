const express = require("express");
const {
  handleLogin,
  getUser,
  getAccount,
  userForgetPassword,
  verifyOTP,
  resetPassword,
  uploadSingleImage,
  uploadMultipleImage,
  createAccount,
} = require("../controllers/userController.controller");
const delay = require("../middleware/delay");
const routerUser = express.Router();
const auth = require("../middleware/authAdmin");
//routerUser.all("*", auth);

routerUser.get("/", (req, res) => {
  return res.status(200).json("Hello world api 1");
});

routerUser.post("/register", createAccount);
routerUser.post("/login", handleLogin);
routerUser.get("/user/profile", auth.requireAuth, getUser);

module.exports = routerUser;
