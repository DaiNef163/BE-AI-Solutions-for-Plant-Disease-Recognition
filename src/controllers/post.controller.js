const postNews = require("../models/postNews");
const { post } = require("../routes/post.routes");
const {
  uploadSingleFile,
  uploadMultipleFile,
} = require("../services/fileServiceUpload.service");

const viewPostNews = async (req, res) => {
  try {
    const result = await postNews.find();
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};
const viewPostNewsUser = async (req, res) => {
  try {
    const tokenUser = req.user?.tokenUser;
    const userRole = req.user?.role;
    let post;
    if (userRole === "admin") {
      post = await postNews.find({});
    } else {
      post = await postNews.find({ tokenUser: tokenUser });
    }
    // const post = await postNews.find({ tokenUser: tokenUser });
    res.json(post);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
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

  const { title, description } = req.body;
  let imageURL = [];

  console.log("Files received:", req.files);

  if (!req.files?.images) {
    return res.status(400).json({ message: "Không có tệp nào được tải lên" });
  }

  const images = Array.isArray(req.files.images)
    ? req.files.images
    : [req.files.images];

  const resultsArr = await uploadMultipleFile(images);

  if (Array.isArray(resultsArr)) {
    imageURL = resultsArr.map((result) => result.path).filter(Boolean);

    if (imageURL.length === 0) {
      return res
        .status(500)
        .json({ message: "Không có ảnh hợp lệ nào được tải lên" });
    }
  } else {
    console.error("Error: resultsArr is not an array", resultsArr);
    return res.status(500).json({ message: "Lỗi trong quá trình tải ảnh" });
  }

  // Tạo dữ liệu bài viết
  const postData = {
    user: req.user._id, // ID của người đăng bài
    title,
    description,
    images: imageURL,
    tokenUser: req.user.tokenUser,
    author: req.user.name || "Tên tác giả không có", // Tên tác giả từ req.user.name
  };

  try {
    let result = await postNews.create(postData);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Tạo bài viết thất bại" });
  }
};

const editPost = async (req, res) => {
  const postId = req.params.id;
  const { title, description } = req.body;
  const image = req.file?.path; // Lấy đường dẫn hình ảnh nếu có

  console.log("check postId", postId);

  try {
    // Cập nhật dữ liệu bài viết
    const updateData = {
      title,
      description,
    };

    // Kiểm tra nếu có hình ảnh mới thì thêm vào updateData
    if (image) updateData.image = image;

    // Cập nhật bài viết theo postId
    const result = await postNews.updateOne(
      { _id: postId },
      { $set: updateData }
    );

    // Kiểm tra nếu không có bài viết nào được cập nhật
    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài viết để cập nhật." });
    }

    // Trả về kết quả khi cập nhật thành công
    res.status(200).json({ message: "Bài viết đã được cập nhật thành công." });
    console.log(updateData);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: "Cập nhật bài viết thất bại.", error });
  }
};
const getPost = async (req, res) => {
  const postId = req.params.id; // Lấy postId từ tham số URL

  try {
    // Tìm bài viết theo postId
    const post = await postNews.findById(postId);

    // Nếu bài viết không tồn tại
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại." });
    }

    // Trả về thông tin bài viết
    res.status(200).json(post);
  } catch (error) {
    console.log(error);

    // Trả về lỗi khi có sự cố
    res
      .status(500)
      .json({ message: "Lấy thông tin bài viết thất bại.", error });
  }
};
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Tìm và xóa bài viết theo id
    const post = await postNews.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }

    res.status(200).json({ message: "Bài viết đã được xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa bài viết:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi xóa bài viết" });
  }
};
module.exports = {
  viewPostNews,
  createPostNews,
  viewPostNewsUser,
  editPost,
  getPost,
  deletePost,
};
