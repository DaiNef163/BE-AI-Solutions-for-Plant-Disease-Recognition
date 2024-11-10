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
const auth = require("../middleware/auth");
const routerUser = express.Router();
const authAdmin = require("../middleware/authAdmin");
//routerUser.all("*", auth);

routerUser.get("/", (req, res) => {
  return res.status(200).json("Hello world api 1");
});

routerUser.post("/register", auth, createAccount);
routerUser.post("/login", auth, handleLogin);
routerUser.get("/user", auth, getUser);
routerUser.get("/account", auth, getAccount);
routerUser.post("/userForgetPassword", userForgetPassword);
routerUser.post("/verifyotp", verifyOTP);
routerUser.post("/resetPassword", resetPassword);
routerUser.post("/uploadsinglefile", uploadSingleImage);
routerUser.post("/uploadmultiplefile", uploadMultipleImage);

module.exports = routerUser;
