require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const uploadImageToCloudinary = async (file) => {
  console.log("Uploading file:", file);

  if (!file || !file.data) {
    throw new Error("File không hợp lệ hoặc không có dữ liệu");
  }

  try {
    const bufferStream = streamifier.createReadStream(file.data);

    const result = await new Promise((resolve, reject) => {
      bufferStream.pipe(
        cloudinary.uploader.upload_stream(
          { folder: "cloudinary" },
          (error, result) => {
            if (error) {
              return reject(
                new Error("Upload to Cloudinary failed: " + error.message)
              );
            }
            resolve(result);
          }
        )
      );
    });

    console.log("Uploaded to Cloudinary:", result);
    return result;
  } catch (error) {
    console.error("Upload to Cloudinary failed:", error);
    throw error;
  }
};

module.exports = uploadImageToCloudinary;
