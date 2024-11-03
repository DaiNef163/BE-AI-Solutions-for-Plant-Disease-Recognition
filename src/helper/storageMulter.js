const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/uploads/'); // Đường dẫn đến thư mục lưu trữ file
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname); // Thêm phần mở rộng file
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

module.exports = multer({ storage: storage });
