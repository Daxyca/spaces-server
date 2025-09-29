import path from "path";
import multer from "multer";

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/pictures");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const maxFileSize = 1 * 1000 * 1000; // 1 MB
const noFilter = true;

export const uploadToFileSystem = multer({
  storage: diskStorage,
  limits: { fileSize: maxFileSize }, // 1 MB Limit
  fileFilter: function (req, file, cb) {
    if (noFilter) {
      return cb(null, true);
    }
    // Set filetypes
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      "Error: File upload only supports the following filetypes - " + filetypes
    );
  },
}).single("picture");
