import slugify from "slugify";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Category } from "./../../../DB/models/category.model.js";

// create category
export const createCategory = asyncHandler(async (req, res, next) => {
  // data > file
  if (!req.file)
    return next(new Error("Category image is required!", { cause: 400 }));

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOLDER}/category` }
  );

  const category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
  });

  return res.status(201).json({ success: true, results: category });
});

// update category
export const updateCategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found!"));

  // check owner
  if (category.createdBy.toString() !== req.user._id.toString())
    // objectId
    return next(new Error("Not authorized!", { cause: 401 }));

  if (req.file) {
    // replace image in cloudinary
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: category.image.id,
    });
    // update image in database
    category.image.url = secure_url;
  }

  // if name >>> name + slug
  category.name = req.body.name ? req.body.name : category.name;
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;

  await category.save();
  return res.json({ success: true, message: "Category updated successfully!" });
});

// delete category
export const deleteCategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found!"));

  // check owner
  if (category.createdBy.toString() !== req.user._id.toString())
    // objectId
    return next(new Error("Not authorized!", { cause: 401 }));

  // delete image from cloudinary
  const results = await cloudinary.uploader.destroy(category.image.id);

  if (results.result == "ok") {
    await Category.findByIdAndDelete(req.params.categoryId);
  }

  return res.json({ success: true });
});

// all categories
export const allCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().populate([
    {
      path: "subcategory",
      select: "createdBy image.url",
      populate: [{ path: "createdBy", select: "userName -_id" }],
    },
    { path: "createdBy" },
  ]);

  return res.json({ success: true, results: categories });
});
