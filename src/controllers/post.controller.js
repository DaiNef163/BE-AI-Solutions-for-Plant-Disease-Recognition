const postNews = require("../models/postNews");
const { uploadSingleFile } = require("../services/fileServiceUpload.service");

const viewPostNews = async (req, res) => {
  try {
    const result = await postNews.find();
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

const createPostNews = async (req, res) => {
  console.log("User role:", req.user.role);

  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({
      code: 403,
      message: "Bạn không có quyền này",
    });
  }
  const { user, title, description } = req.body;
  let imageURL = "";
  console.log(req.files);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "Không có tệp nào được tải lên" });
  }

  let resultsArr = [];
  resultsArr = await uploadSingleFile(req.files.images);

  console.log(resultsArr);

  if (Array.isArray(resultsArr)) {
    imageURL = resultsArr.map((result) => result.path).filter((path) => path);
    if (imageURL.length === 0) {
      return res
        .status(500)
        .json({ message: "Không có ảnh hợp lệ nào được tải lên" });
    }
  } else {
    console.error("resultsArr is not an array:", resultsArr);
    return res.status(500).json({ message: "Lỗi trong quá trình tải ảnh" });
  }
  try {
    let result = await postNews.create({
      user: req.user._id,
      title,
      description,
      images: imageURL,
    });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Tao bai viet that bai" });
  }
};
module.exports = { viewPostNews, createPostNews };
