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
          resource_type: "image", // Chỉ định loại tài nguyên là hình ảnh
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

    // Chờ kết quả từ Cloudinary
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
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      if (!file.data) {
        console.error("Dữ liệu tệp không tồn tại:", file.name);
        resultsArr.push({ path: null, error: "Dữ liệu tệp không tồn tại" });
        continue;
      }

      // Tải lên tệp trực tiếp từ buffer
      try {
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

          stream.end(file.data);
        });

        const secureUrl = await uploadPromise;
        resultsArr.push({ path: secureUrl, error: null });
      } catch (error) {
        console.error("Lỗi trong quá trình tải lên:", error);
        resultsArr.push({ path: null, error: error.message });
      }
    }
  } catch (error) {
    console.error("Error uploading multiple files:", error);
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
