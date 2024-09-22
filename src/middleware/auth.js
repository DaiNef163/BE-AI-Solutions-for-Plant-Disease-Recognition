const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const white_lists = ["/", "/register", "/login"];

  // Bypass authentication for whitelisted routes
  if (white_lists.find((item) => "/v1/api" + item === req.originalUrl)) {
    return next();
  }

  // Kiểm tra xem header có authorization hay không
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    //verify
    try {
      const decoded = jwt.verify(token, process.env.JWT_SERECT);
      req.users = {
        email: decoded.email,
        name: decoded.name,
        createdBy: "hn",
      };
      // console.log("check token 1 ", decoded);
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Token bị hết hạn hoặc không hợp lệ",
      });
    }
  } else {
    // Trường hợp không có token trong header
    return res.status(401).json({
      message:
        "Bạn chưa truyền access_token trong header hoặc token đã hết hạn",
    });
  }
};

module.exports = auth;
