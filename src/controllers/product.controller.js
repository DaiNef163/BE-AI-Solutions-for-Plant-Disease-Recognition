const Products = require("../models/product");
const { uploadSingleFile } = require("../services/fileServiceUpload");
const { faker } = require("@faker-js/faker");

const createProduct = async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({
      code: 403,
      message: "Bạn không có quyền này",
    });
  }
  try {
    let { productName, price, description, discount, accept, slug } = req.body;
    console.log("check body", req.body);
    let imageURL = "";
    // let productName = faker.commerce.productName();
    // let price = parseFloat(faker.commerce.price()); // Chuyển đổi giá thành số thực
    // let description = faker.commerce.productDescription();
    // let discount = faker.number.int({ min: 1, max: 100 }); // Sử dụng faker.datatype.number thay vì faker.random.number
    // let accept = faker.datatype.boolean(); // Sử dụng faker.datatype.boolean thay vì faker.random.boolean
    // let slug = faker.helpers.slugify(productName);
    // let images = faker.image.avatar();

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("khong co file nao dc tai len");
    } else {
      let result = await uploadSingleFile(req.files.images);
      imageURL = result.path;
    }
    console.log("check img", imageURL);
    let product = await Products.create({
      productName,
      price,
      description,
      discount,
      images: [imageURL],
      accept,
      slug,
    });
    res.json(product);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Tạo sản phẩm thất bại", error: error.message });
  }
};

// const viewProduct = async (req, res) => {
//   try {
//     const product = await Products.find({});
//     res.json(product);
//   } catch (error) {
//     console.log(error);
//     console.log("lỗi all view product");

//   }
// };
const viewProduct = async (req, res) => {
  try {
    const product = await Products.find({});
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createProduct, viewProduct };
