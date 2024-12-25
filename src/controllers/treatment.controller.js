const Treatment = require("../models/treatment");
const viewDisease = async (req, res) => {
  try {
    const disease = await Treatment.find();
    res.json(disease);
  } catch (error) {
    console.log(error);
  }
};

const createTreatment = async (req, res) => {
  try {
    const { name, symptoms, causes, treatment, prevention, severityLevel } =
      req.body;
    console.log(req.body);

    // Kiểm tra các trường bắt buộc
    if (!name || !symptoms || !causes || !treatment || !prevention) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc!",
      });
    }

    // Tạo mã bệnh tự động
    const randomString = () =>
      Math.random().toString(36).substring(2, 4).toUpperCase();
    const randomNumber = () => Math.floor(10 + Math.random() * 90).toString();
    const code = randomString() + randomNumber();

    // Kiểm tra trùng lặp mã bệnh
    const existingTreatment = await Treatment.findOne({ code });
    if (existingTreatment) {
      return res.status(500).json({
        success: false,
        message: "Trùng lặp mã bệnh, vui lòng thử lại!",
      });
    }

    // Tạo tài liệu mới
    const newTreatment = new Treatment({
      code,
      name,
      symptoms,
      causes,
      treatment,
      prevention,
      severityLevel, // Giá trị mặc định
    });

    // Lưu tài liệu vào database
    const savedTreatment = await newTreatment.save();

    // Trả về kết quả
    res.status(201).json({
      success: true,
      message: "Thêm bệnh thành công!",
      data: savedTreatment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Lỗi server: ${error.message}`,
    });
  }
};

module.exports = { viewDisease, createTreatment };
