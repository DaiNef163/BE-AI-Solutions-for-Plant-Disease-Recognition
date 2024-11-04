const express = require("express");
const {
  createAccount,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");
const delay = require("../middleware/delay");
const auth = require("../middleware/auth");
const accountRouter = require("./accccount");
const storeRouter = require("./store.routes");
const treatmentRouter = require("./treatment.routes");
const postRouter = require("./post.routes");
const productRouter = require("./product.routes");
const roleRouter = require("./role.routes");
const order = require("./order.routes");
const routerAPI = express.Router();
const authAdmin = require("../middleware/authAdmin");
//routerAPI.all("*", auth);

routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api 1");
});

routerAPI.post("/register", auth, createAccount);
routerAPI.post("/login", auth, handleLogin);
routerAPI.get("/user", auth, getUser);
routerAPI.get("/account", auth, getAccount);

routerAPI.use("/order", order);
routerAPI.use("/admin", accountRouter);
routerAPI.use("/stores", storeRouter);
routerAPI.use("/treatments", treatmentRouter);
routerAPI.use("/posts", postRouter);
routerAPI.use("/product", productRouter);
routerAPI.use("/role", authAdmin.requireAuth, roleRouter);
module.exports = routerAPI;
