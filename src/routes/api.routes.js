const express = require("express");
const {
  createAccount,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController.controller");
const delay = require("../middleware/delay");
const storeRouter = require("./store.routes");
const treatmentRouter = require("./treatment.routes");
const postRouter = require("./post.routes");
const productRouter = require("./product.routes");
const cartRoutes = require("./shoppingcart.routes");
const order = require("./order.routes");
const nameLeaf = require("./leaf.routes");
const routerAPI = express.Router();
// const roleRouter = require("./role.routes");
// const authAdmin = require("../middleware/authAdmin");
//routerAPI.all("*", auth);

routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api 1");
});



routerAPI.use("/carts", cartRoutes);
routerAPI.use("/order", order);
routerAPI.use("/stores", storeRouter);
routerAPI.use("/treatments", treatmentRouter);
routerAPI.use("/post", postRouter);
routerAPI.use("/product", productRouter);
routerAPI.use("/leaf", nameLeaf);
// routerAPI.use("/role", authAdmin.requireAuth, roleRouter);
module.exports = routerAPI;
