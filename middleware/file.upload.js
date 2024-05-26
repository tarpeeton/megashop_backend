const multer = require("multer");
const path = require("path");
const md5 = require("md5");

const folderName = "./public/product";

const uploadMultiple = () => {
  const uploading = multer({
    storage: multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, folderName);
      },
      filename: function (req, file, callback) {
        callback(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 mb limit
    },
    fileFilter: function (req, file, callback) {
      const allowedFileTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
        "application/exec",
        "audio/mpeg",
      ];
      if (allowedFileTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error("Fayl turi noto`g`ri"));
      }
    },
  });

  return uploading.array("uploading-multiple", 8); // 12 taga rasm yuklash uchun
};

module.exports = {
  uploadMultiple,
};
