const Account = require("../models/account");

module.exports.requireAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = await Account.findOne({
      tokenUser: token,
      deleted: false,
    }).select("-password");

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Token không hợp lệ",
      });
    }

    req.user = user;
    next();
  } else {
    res.status(400).json({
      code: 400,
      message: "Vui lòng gửi kèm token",
    });
  }
};
