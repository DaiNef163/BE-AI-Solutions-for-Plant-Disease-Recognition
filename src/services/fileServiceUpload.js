const path = require("path");
const cloudinary = require("./cloudinary");

const uploadSingleFile = async (fileObject) => {
  // let uploadPath = path.resolve(__dirname, '../public/images/' + fileObject.name);
  let uploadPath = path.resolve(__dirname, "../public/images/");

  //get image extension
  let extName = path.extname(fileObject.name);
  //get image's name
  let basename = path.basename(fileObject.name, extName);

  //create final name

  let finalName = `${basename}-${Date.now()}${extName}`;
  let finalPath = `${uploadPath}/${finalName}`;
  try {
    await fileObject.mv(finalPath);
    return {
      status: "access",
      path: finalName,
      error: null,
    };
  } catch (error) {
    return {
      status: "faild",
      path: null,
      error: null,
    };
  }
};

// const uploadMultipleFile = async (fileArray) => {
//   let resultsArr = [];
//   try {
//     let uploadPath = path.resolve(__dirname, "../public/images/");

//     for (let i = 0; i < fileArray.length; i++) {
//       let extName = path.extname(fileArray[i].name);
//       let basename = path.basename(fileArray[i].name, extName);
//       let finalName = `${basename}-${Date.now()}${extName}`;
//       let finalPath = `${uploadPath}/${finalName}`;

//       try {
//         await fileArray[i].mv(finalPath);
//         resultsArr.push({ path: finalName, error: null });
//       } catch (error) {
//         resultsArr.push({ path: null, error: error.message });
//       }
//     }
//   } catch (error) {
//     console.error("Error uploading multiple files:", error);
//   }

//   return resultsArr;
// };

const uploadMultipleFile = async (fileArray) => {
  let resultsArr = [];

  try {
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      if (!file.data) {
        console.error('Dữ liệu tệp không tồn tại:', file.name);
        resultsArr.push({ path: null, error: 'Dữ liệu tệp không tồn tại' });
        continue; // Bỏ qua tệp này
      }

      // Tải lên tệp trực tiếp từ buffer
      try {
        const uploadPromise = new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({
            resource_type: 'image',
          }, (error, result) => {
            if (error) {
              console.error('Lỗi tải lên:', error);
              reject(error.message);
            } else {
              resolve(result.secure_url);
            }
          });

          stream.end(file.data); // Kết thúc stream với dữ liệu tệp
        });

        const secureUrl = await uploadPromise;
        resultsArr.push({ path: secureUrl, error: null });

      } catch (error) {
        console.error('Lỗi trong quá trình tải lên:', error);
        resultsArr.push({ path: null, error: error.message });
      }
    }
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    resultsArr.push({ path: null, error: error.message || 'Lỗi không xác định' });
  }

  return resultsArr;
};


module.exports = {
  uploadSingleFile,
  uploadMultipleFile,
};
