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
const routerAPI = express.Router();
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

module.exports = routerAPI; //export default
