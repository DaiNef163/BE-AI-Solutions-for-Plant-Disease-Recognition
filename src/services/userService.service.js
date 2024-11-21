const Accounts = require("../models/account");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const cart = require("../models/cart");
require("dotenv").config();

const createUserService = async (
  name,
  age,
  phone,
  gender,
  email,
  password,
  role,
  tokenUser
) => {
  try {
    const existingUser = await Accounts.findOne({ email });
    if (existingUser) {
      throw new Error("Email đã tồn tại. Vui lòng chọn email khác.");
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);

    let result = await Accounts.create({
      name: name,
      age: age,
      phone: phone,
      gender: gender,
      email: email,
      password: hashPassword,
      role: role,
      tokenUser: tokenUser,
    });
    const newCart = new cart({ owner: result._id, products: [] });
    await newCart.save();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const getUserService = async () => {
  try {
    let result = await Accounts.find({}).select("-password");
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const loginService = async (email, password) => {
  try {
    const user = await Accounts.findOne({ email: email });
    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: "Email/Password is invalid",
        };
      } else {
        const payload = {
          tokenUser: user.tokenUser,
          email: user.email,
          name: user.name,
        };
        const access_token = await jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return {
          EC: 0,
          access_token,
          tokenUser: user.tokenUser,
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            age: user.age,
            gender: user.gender,
            avatar: user.avatar,
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password is invalid",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message || "Có lỗi xảy ra khi tạo tài khoản.",
    };
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
};
