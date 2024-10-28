const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");
const delay = require("../middleware/delay");
const auth = require("../middleware/auth");
const accountRouter = require("../routes/account")
const storeRouter = require("./store")
const treatmentRouter = require("./treatment")
const postRouter = require("./post")
const productRouter = require("./product")
const roleRouter = require("./role")
const routerAPI = express.Router();
const authAdmin = require("../middleware/authAdmin")
//routerAPI.all("*", auth);

routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api 1");
});

routerAPI.post("/register", auth,createUser);
routerAPI.post("/login",auth, handleLogin);
routerAPI.get("/user",auth, getUser);
routerAPI.get("/account",auth, getAccount);
routerAPI.use("/admin",accountRouter)
routerAPI.use("/stores",storeRouter)
routerAPI.use("/treatments",treatmentRouter)
routerAPI.use("/posts",postRouter)
routerAPI.use("/product",productRouter)
routerAPI.use("/role",authAdmin.requireAuth,roleRouter)
module.exports = routerAPI; //export default
