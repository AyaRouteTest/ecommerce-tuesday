import multer, { diskStorage } from "multer";

export const filterObj = {
  image: ["image/png", "image/jpg"],
  video: ["video/mp4"],
  pdf: ["application/pdf"],
};

export const fileUpload = (types) => {
  const storage = diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (!types.includes(file.mimetype))
      return cb(new Error("invalid file type!"), false);
    return cb(null, true);
  };
  return multer({ storage, fileFilter });
};
