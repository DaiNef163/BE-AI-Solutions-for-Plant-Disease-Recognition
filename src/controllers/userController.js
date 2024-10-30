const SendmailTransport = require("nodemailer/lib/sendmail-transport");
const Accounts = require("../models/Account");
const {
  createUserService,
  loginService,
  getUserService,
} = require("../services/userService");
const nodeMailer = require("nodemailer");
const { text } = require("express");
const forgotPassword = require("../models/forgot-password");
const bcrypt = require("bcrypt");
const {
  uploadSingleFile,
  uploadMultipleFile,
} = require("../services/fileServiceUpload");

const createUser = async (req, res) => {
  const { name, email, password, phone, gender } = req.body;
  const data = await createUserService(name, email, password, phone, gender);
  return res.status(201).json(data);
};
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  return res.status(200).json(data);
};
const getUser = async (req, res) => {
  // const { name, email, password } = req.body;
  const data = await getUserService();

  return res.status(200).json(data);
};
const getAccount = async (req, res) => {
  return res.status(200).json(req.users);
};

const userForgetPassword = async (req, res) => {
  if (!req.body.email) {
    res.status(400).json("Yêu cầu nhập email");
    return;
  }

  const email = req.body.email;
  const account = await Accounts.findOne({ email: email });

  if (!account) {
    res.status(400).json("Email không đúng");
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + 15 * 60 * 1000,
  };

  const forgot = new forgotPassword(objectForgotPassword);
  await forgot.save();

  const html = `
        Mã OTP xác minh lấy lại mật khẩu là ${otp}. Thời gian mã có hiệu lực là 15 phút
    `;

  const sendOtpMail = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "hoainambld2003@gmail.com",
      pass: "dpsb ultx dfen qkvt",
    },
  });
  const mailOption = {
    from: "hoainambld2003@gmail.com",
    to: email,
    subject: "Quên mật khẩu",
    text: html,
  };
  sendOtpMail.sendMail(mailOption, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  console.log(otp);

  res.status(200).json("Hãy kiểm tra mail của bạn");
};
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json("Yêu cầu nhập đầy đủ email và OTP");
  }

  const forgotPasswordRecord = await forgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!forgotPasswordRecord) {
    return res.status(400).json("Email không tồn tại trong yêu cầu OTP");
  }

  // if (forgotPasswordRecord.expireAt < Date.now()) {
  //   return res.status(400).json("OTP đã hết hạn");
  // }
  if (forgotPasswordRecord.otp.toString() !== otp.toString()) {
    return res.status(400).json("OTP không đúng 1");
  }
  console.log("OTP từ người dùng nhập:", otp);
  console.log("OTP từ cơ sở dữ liệu:", forgotPasswordRecord.otp);

  return res.status(200).json("OTP xác minh thành công");
  // return res.json("OTP xác minh thành công");
};
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json("Yêu cầu nhập email và mật khẩu mới");
  }

  const user = await Accounts.findOne({ email: email });

  if (!user) {
    return res.status(400).json("Người dùng không tồn tại");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  await forgotPassword.deleteMany({ email: email });

  res.status(200).json("Đặt lại mật khẩu thành công");
};

const uploadSingleImage = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }
  uploadSingleFile(req.files.image);
  console.log("req.file", req.files);
  console.log("check array", Array.isArray(req.files.image));
  res.send("ok file");
};

const uploadMultipleImage = async (req, res) => {
  console.log("req.file", req.files);

  console.log("check array", Array.isArray(req.files.image));
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }
  uploadMultipleFile(req.files.image);
  res.send("ok file");
};
module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  userForgetPassword,
  verifyOTP,
  resetPassword,
  uploadSingleImage,
  uploadMultipleImage,
};
