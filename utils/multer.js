import { extname as getExtname } from "path";
import multer from "multer";

const memoryStorage = multer.memoryStorage();
const maxFileSize = 1 * 1000 * 1000; // 1 MB
// const noFilter = true;

export const uploadToFileSystem = multer({
  storage: memoryStorage,
  limits: { fileSize: maxFileSize }, // 1 MB Limit
  fileFilter: function (req, file, cb) {
    // if (noFilter) {
    //   return cb(null, true);
    // }
    // Set filetypes
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(getExtname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      "Error: File upload only supports the following filetypes - " + filetypes
    );
  },
}).single("picture");
