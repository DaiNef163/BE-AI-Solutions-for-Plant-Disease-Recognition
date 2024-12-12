const path = require("path");
const cloudinary = require("./cloudinary.service");

const uploadSingleFile = async (fileObject) => {
  let resultsArr = [];

  try {
    if (!fileObject.data) {
      console.error("Dữ liệu tệp không tồn tại:", fileObject.name);
      resultsArr.push({ path: null, error: "Dữ liệu tệp không tồn tại" });
      return resultsArr; // Trả về nếu không có tệp
    }

    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Lỗi tải lên:", error);
            reject(error.message);
          } else {
            resolve(result.secure_url);
          }
        }
      );

      stream.end(fileObject.data);
    });

    const secureUrl = await uploadPromise;
    resultsArr.push({ path: secureUrl, error: null });
  } catch (error) {
    console.error("Lỗi khi tải lên Cloudinary:", error);
    resultsArr.push({ path: null, error: error.message });
  }

  return resultsArr;
};

const uploadMultipleFile = async (fileArray) => {
  let resultsArr = [];

  try {
    // Kiểm tra nếu fileArray không phải là mảng
    if (!Array.isArray(fileArray)) {
      throw new Error("fileArray phải là một mảng.");
    }

    // Tạo mảng các Promise cho từng tệp
    const uploadPromises = fileArray.map((file) => {
      return new Promise(async (resolve, reject) => {
        if (!file || !file.data) {
          console.error(
            "Dữ liệu tệp không tồn tại:",
            file ? file.name : "Không rõ tên tệp"
          );
          reject({ path: null, error: "Dữ liệu tệp không tồn tại" });
          return;
        }

        try {
          // Tải lên tệp từ buffer
          const secureUrl = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { resource_type: "image" },
              (error, result) => {
                if (error) {
                  reject(error.message); // Reject nếu có lỗi
                } else {
                  resolve(result.secure_url); // Resolve với URL an toàn
                }
              }
            );
            stream.end(file.data); // Kết thúc luồng với dữ liệu tệp
          });

          resolve({ path: secureUrl, error: null });
        } catch (error) {
          console.error("Lỗi trong quá trình tải lên:", error);
          reject({ path: null, error: error.message || "Lỗi không xác định" });
        }
      });
    });

    // Chờ tất cả các Promise hoàn thành
    resultsArr = await Promise.allSettled(uploadPromises);

    // Lọc kết quả đã hoàn thành (fulfilled)
    resultsArr = resultsArr
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
  } catch (error) {
    console.error("Lỗi tải lên nhiều tệp:", error);
    resultsArr.push({
      path: null,
      error: error.message || "Lỗi không xác định",
    });
  }

  return resultsArr;
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFile,
};
