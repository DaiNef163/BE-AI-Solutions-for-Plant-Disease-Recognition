const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const white_lists = ["/", "/register", "/login"];

  // Bypass authentication for whitelisted routes
  if (white_lists.find((item) => "" + item === req.originalUrl)) {
    return next();
  }

  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        _id: decoded._id,
        email: decoded.email,
        name: decoded.name,
      };
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: "Token bị hết hạn hoặc không hợp lệ",
      });
    }
  } else {
    return res.status(401).json({
      message:
        "Bạn chưa truyền access_token trong header hoặc token đã hết hạn",
    });
  }
};

module.exports = auth;
