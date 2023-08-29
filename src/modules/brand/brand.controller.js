import slugify from "slugify";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "./../../utils/cloud.js";
import { Brand } from "./../../../DB/models/brand.model.js";

// create
export const createbrand = asyncHandler(async (req, res, next) => {
  // data
  const { name } = req.body;

  // file
  if (!req.file)
    return next(new Error("brand image is required!", { cause: 400 }));

  // upload photo
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOLDER}/brand` }
  );

  // create brand
  const brand = await Brand.create({
    name,
    image: { id: public_id, url: secure_url },
    createdBy: req.user._id,
  });

  brand.category.push(req.body.categoryId);
  await brand.save();

  return res.json({ success: true, results: brand });
});

// update
export const updatebrand = asyncHandler(async (req, res, next) => {
  // check brand
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) return next(new Error("brand not found!"));

  // check owner
  if (brand.createdBy.toString() !== req.user._id.toString())
    // objectId
    return next(new Error("Not authorized!", { cause: 401 }));

  if (req.file) {
    // replace image in cloudinary
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: brand.image.id,
    });
    // update image in database
    brand.image.url = secure_url;
  }

  // if name >>> name + slug
  brand.name = req.body.name ? req.body.name : brand.name;

  await brand.save();
  return res.json({
    success: true,
    message: "brand updated successfully!",
  });
});

// delete
export const deletebrand = asyncHandler(async (req, res, next) => {
  // check brand
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) return next(new Error("brand not found!"));

  // check owner
  if (brand.createdBy.toString() !== req.user._id.toString())
    // objectId
    return next(new Error("Not authorized!", { cause: 401 }));

  // delete image from cloudinary
  const results = await cloudinary.uploader.destroy(brand.image.id);

  if (results.result == "ok") {
    await Brand.findByIdAndDelete(req.params.brandId);
  }

  return res.json({
    success: true,
    message: "brand deleted successfully!",
  });
});

// read all brands
export const allBrands = asyncHandler(async (req, res, next) => {
  const brands = await Brand.find();

  return res.json({ success: true, results: brands });
});
