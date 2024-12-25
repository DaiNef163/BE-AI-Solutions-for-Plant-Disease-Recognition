const SendmailTransport = require("nodemailer/lib/sendmail-transport");
const Accounts = require("../models/account");
const {
  createUserService,
  loginService,
  getUserService,
} = require("../services/userService.service");
const nodeMailer = require("nodemailer");
const forgotPassword = require("../models/forgot-password");
const bcrypt = require("bcrypt");
const {
  uploadSingleFile,
  uploadMultipleFile,
} = require("../services/fileServiceUpload.service");

const viewALlUSer = async (req, res) => {
  try {
    const user = await Accounts.find({});
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};
const getUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await Accounts.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      age: user.age,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      address: user.address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createAccount = async (req, res) => {
  const { name, age, phone, gender, email, password, role, tokenUser } =
    req.body;
  console.log(req.body);

  try {
    const data = await createUserService(
      name,
      age,
      phone,
      gender,
      email,
      password,
      role,
      tokenUser
    );
    return res.status(201).json(data);
  } catch (error) {
    console.log(error);
  }
};
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  return res.status(200).json(data);
};

const editUser = async (req, res) => {
  const userId = req.user.id;
  const { name, email, age, phone } = req.body;

  console.log("Received data:", { name, email, age, phone }); // Kiểm tra dữ liệu nhận được

  try {
    const user = await Accounts.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.age = age || user.age;
    user.phone = phone || user.phone;

    const updatedUser = await user.save(); // Lưu thông tin người dùng đã cập nhật

    console.log("Updated User:", updatedUser); // Kiểm tra thông tin đã cập nhật

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error:", err); // Kiểm tra lỗi
    res.status(500).json({ message: "Server error" });
  }
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

const updateUserProfile = async (req, res) => {
  const { name, email, phone, address, avatar } = req.body;

  const updateData = { name, email, phone, address };

  if (avatar) {
    updateData.avatar = avatar;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Failed to update profile" });
  }
};
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Accounts.findByIdAndDelete(userId);
    console.log(user);

    if (!user) {
      return res.status(404).send({ message: "Người dùng không tồn tại!" });
    }
    res.status(200).send({ message: "Người dùng đã được xóa thành công!" });
  } catch (error) {
    res.status(500).send({ message: "Có lỗi xảy ra khi xóa người dùng!" });
  }
};

module.exports = {
  getUser,
  createAccount,
  handleLogin,
  editUser,
  userForgetPassword,
  verifyOTP,
  resetPassword,
  uploadSingleImage,
  uploadMultipleImage,
  updateUserProfile,
  viewALlUSer,
  deleteUser,
};
