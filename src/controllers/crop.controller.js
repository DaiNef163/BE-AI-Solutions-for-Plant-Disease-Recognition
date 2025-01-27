const Crop = require("../models/crop");
const mongoose = require("mongoose");

module.exports.getAll = async function (req, res) {
  try {
    const tokenUser = req.user?.tokenUser;
    if (!tokenUser) {
      return res.status(400).json({ message: "tokenUser is required" });
    }
    const crops = await Crop.find({ tokenUser: tokenUser });

    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json("Fail !!");
  }
};

module.exports.createCrop = async function (req, res) {
  try {
    const illnessHistory = {
      diseaseName: req.body.diseaseName,
      sickDay: req.body.sickDay,
      location: req.body.location,
    };
    const cropBody = {
      tokenUser: req.user.tokenUser,
      plantName: req.body.plantName,
      quantity: req.body.quantity,
      status: req.body.status,
      plantDate: req.body.plantDate,
      illnessHistory: [illnessHistory], // Lưu dưới dạng mảng
    };

    const crop = new Crop(cropBody);
    console.log(cropBody);

    await crop.save();

    res.status(200).json(crop);
  } catch (error) {
    console.error(error);
    res.status(500).json("Fail !!");
  }
};

module.exports.detailCrop = async function (req, res) {
  try {
    // Lấy cropId từ params (được truyền từ frontend)
    const { cropId } = req.params;
    console.log(cropId); // Kiểm tra cropId

    // Kiểm tra xem cropId có phải ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(cropId)) {
      return res.status(400).json({ message: "ID cây trồng không hợp lệ!" });
    }

    // Tìm cây trồng theo cropId
    const detailCrop = await Crop.findOne({
      _id: cropId,
    });

    if (!detailCrop) {
      return res.status(404).json({ message: "Không tìm thấy cây trồng!" });
    }

    res.status(200).json(detailCrop); // Trả về chi tiết cây trồng
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết cây trồng:", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// crop.controller.js

module.exports.updateSick = async function (req, res) {
  const { cropId } = req.params;
  const { illnessHistory, status } = req.body;

  try {
    // Tìm cây trồng theo cropId
    const crop = await Crop.findById(cropId);

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    if (illnessHistory && illnessHistory.length > 0) {
      crop.illnessHistory.push(...illnessHistory);
    }

    const validStatuses = ["healthy", "sick", "recovered"];
    if (status && validStatuses.includes(status)) {
      crop.status = status; // Cập nhật status cho cây trồng
    }

    await crop.save();

    res
      .status(200)
      .json({ message: "Illness history and status updated successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update illness history and status" });
  }
};

module.exports.editCrop = async function (req, res) {
  try {
    const updateCrop = {
      status: req.body.status,
      quantity: req.body.quantity,
    };

    await Crop.updateOne(
      { user_id: req.user._id, _id: req.params.id },
      updateCrop
    );

    res.status(200).json("Update Success");
  } catch (error) {
    res.status(500).json("Fail !!");
  }
};

module.exports.deleteCrop = async function (req, res) {
  try {
    await Crop.deleteOne({ user_id: req.user._id, _id: req.params.id });
    res.status(200).json("Delete Success");
  } catch (error) {
    res.status(500).json("Fail !!");
  }
};
module.exports.updateCropStatus = async (cropId) => {
  const crop = await Crop.findById(cropId);
  if (!crop) return null;

  if (crop.illnessHistory.length === 0) {
    crop.status = "healthy";
  } else {
    crop.status = "sick";
  }

  await crop.save();
  return crop;
};
module.exports.addIllness = async (req, res) => {
  try {
    const { cropId, diseaseName } = req.body;

    const crop = await Crop.findById(cropId);
    if (!crop)
      return res.status(404).json({ message: "Cây trồng không tồn tại" });

    crop.illnessHistory.push({ diseaseName });
    crop.status = "sick"; // Cập nhật trạng thái
    await crop.save();

    res.json({ message: "Thêm bệnh thành công", crop });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
module.exports.recoverIllness = async (req, res) => {
  try {
    const { cropId, illnessIndex } = req.body;

    const crop = await Crops.findById(cropId);
    if (!crop)
      return res.status(404).json({ message: "Cây trồng không tồn tại" });

    // Xóa bệnh hoặc đánh dấu khỏi bệnh
    crop.illnessHistory.splice(illnessIndex, 1);

    // Cập nhật trạng thái
    if (crop.illnessHistory.length === 0) {
      crop.status = "healthy";
    }

    await crop.save();

    res.json({ message: "Cập nhật bệnh thành công", crop });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
