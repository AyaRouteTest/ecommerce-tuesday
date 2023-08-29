import slugify from "slugify";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "./../../utils/cloud.js";
import { Subcategory } from "./../../../DB/models/subcategory.model.js";

// create
export const createSubcategory = asyncHandler(async (req, res, next) => {
  // data
  const { name } = req.body;

  // file
  if (!req.file)
    return next(new Error("subcategory image is required!", { cause: 400 }));

  // upload photo
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOLDER}/subcategory` }
  );

  const slug = slugify(name);

  // create subcategory
  const subcategory = await Subcategory.create({
    name,
    slug,
    image: { id: public_id, url: secure_url },
    createdBy: req.user._id,
    category: req.params.categoryId,
  });

  return res.json({ success: true, results: subcategory });
});

// update
export const updateSubcategory = asyncHandler(async (req, res, next) => {
  // check subcategory
  const subcategory = await Subcategory.findById(req.params.subcategoryId);
  if (!subcategory) return next(new Error("Subcategory not found!"));

  // check owner
  if (subcategory.createdBy.toString() !== req.user._id.toString())
    // objectId
    return next(new Error("Not authorized!", { cause: 401 }));

  if (req.file) {
    // replace image in cloudinary
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: subcategory.image.id,
    });
    // update image in database
    subcategory.image.url = secure_url;
  }

  // if name >>> name + slug
  subcategory.name = req.body.name ? req.body.name : subcategory.name;
  subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;

  await subcategory.save();
  return res.json({
    success: true,
    message: "Subcategory updated successfully!",
  });
});

// delete
export const deleteSubcategory = asyncHandler(async (req, res, next) => {
  // check subcategory
  const subcategory = await Subcategory.findById(req.params.subcategoryId);
  if (!subcategory) return next(new Error("Subcategory not found!"));

  // check owner
  if (subcategory.createdBy.toString() !== req.user._id.toString())
    // objectId
    return next(new Error("Not authorized!", { cause: 401 }));

  // delete image from cloudinary
  const results = await cloudinary.uploader.destroy(subcategory.image.id);

  if (results.result == "ok") {
    await Subcategory.findByIdAndDelete(req.params.subcategoryId);
  }

  return res.json({
    success: true,
    message: "subcategory deleted successfully!",
  });
});

// read all subcategories
export const allSubcategories = asyncHandler(async (req, res, next) => {
  const subcategories = await Subcategory.find();

  return res.json({ success: true, results: subcategories });
});
