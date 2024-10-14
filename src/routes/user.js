const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  userForgetPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/userController");
const delay = require("../middleware/delay");
const auth = require("../middleware/auth");
const routerAPI = express.Router();
const authAdmin = require("../middleware/authAdmin");
//routerAPI.all("*", auth);

routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api 1");
});

routerAPI.post("/register", auth, createUser);
routerAPI.post("/login", auth, handleLogin);
routerAPI.get("/user", auth, getUser);
routerAPI.get("/account", auth, getAccount);
routerAPI.post("/userForgetPassword", userForgetPassword);
routerAPI.post("/verifyotp",verifyOTP);
routerAPI.post("/resetPassword",resetPassword);

// routerAPI.use("/admin", accountRouter);
// routerAPI.use("/stores", authAdmin.requireAuth, storeRouter);
// routerAPI.use("/treatments", authAdmin.requireAuth, treatmentRouter);
// routerAPI.use("/posts", authAdmin.requireAuth, postRouter);
// routerAPI.use("/product", authAdmin.requireAuth, productRouter);
// routerAPI.use("/role", authAdmin.requireAuth, roleRouter);
module.exports = routerAPI; //export default
