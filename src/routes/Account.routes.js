const express = require("express");
const {
  handleLogin,
  getUser,
  userForgetPassword,
  verifyOTP,
  resetPassword,
  uploadSingleImage,
  uploadMultipleImage,
  createAccount,
  updateUserProfile,
  editUser,
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
routerUser.put("/user/update", auth.requireAuth, editUser);
routerUser.get("/user/profile", auth.requireAuth, getUser);
routerUser.put("/update", auth.requireAuth, updateUserProfile);
routerUser.post("/userForgetPassword", userForgetPassword);
routerUser.post("/verifyotp", verifyOTP);
routerUser.post("/resetPassword", resetPassword);

module.exports = routerUser;
