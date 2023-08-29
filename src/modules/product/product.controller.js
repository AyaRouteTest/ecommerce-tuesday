import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "./../../utils/cloud.js";
import { nanoid } from "nanoid";
import { Product } from "./../../../DB/models/product.model.js";
import slugify from "slugify";
import { Category } from "./../../../DB/models/category.model.js";
import { Subcategory } from "./../../../DB/models/subcategory.model.js";
import { Brand } from "./../../../DB/models/brand.model.js";

// create product
export const addProduct = asyncHandler(async (req, res, next) => {
  // data
  //   const {
  //     name,
  //     description,
  //     price,
  //     discount,
  //     availableItems,
  //     category,
  //     subcategory,
  //     brand,
  //   } = req.body;

  // check category
  const category = await Category.findById(req.body.category);
  if (!category) return next(new Error("Category not found!", { cause: 404 }));

  // check subcategory
  const subcategory = await Subcategory.findById(req.body.subcategory);
  if (!subcategory)
    return next(new Error("subcategory not found!", { cause: 404 }));

  // check brand
  const brand = await Brand.findById(req.body.brand);
  if (!brand) return next(new Error("brand not found!", { cause: 404 }));

  // check files
  if (!req.files)
    return next(new Error("product images are required!", { cause: 400 }));

  const cloudFolder = nanoid();
  const images = []; // [{id,url},{id,url},{}]

  // upload subimages
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.CLOUD_FOLDER}/products/${cloudFolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }

  // upload default image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.CLOUD_FOLDER}/products/${cloudFolder}` }
  );

  // create product
  const product = await Product.create({
    ...req.body,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    cloudFolder,
    images,
    defaultImage: { url: secure_url, id: public_id },
  });

  //   console.log("Product without discount:", product.finalPrice);

  // send responde
  return res.status(201).json({ success: true, results: product });
});

// delete product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  // check product
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new Error("Product not found!", { cause: 404 }));

  // check owner
  if (req.user._id.toString() != product.createdBy.toString())
    return next(new Error("not authorized!"));

  // images , defaultImage
  const ids = product.images.map((image) => image.id);
  ids.push(product.defaultImage.id);
  console.log(ids);

  // delete ids
  await cloudinary.api.delete_resources(ids);

  // delete folder
  await cloudinary.api.delete_folder(
    `${process.env.CLOUD_FOLDER}/products/${product.cloudFolder}`
  );

  // delete prodcut from DB
  await Product.findByIdAndDelete(req.params.productId);

  // res
  return res.json({ success: true, message: "product deleted successfully!" });
});

// all products
export const allProducts = asyncHandler(async (req, res, next) => {
  if (req.params.categoryId) {
    const category = await Category.findById(req.params.categoryId);
    if (!category)
      return next(new Error("Category not found!", { cause: 404 }));

    const products = await Product.find({ category: req.params.categoryId });
    return res.json({ success: true, results: products });
  }

  //**************** Search **************//
  // const { keyword } = req.query;
  // const products = await Product.find({
  //   $or: [
  //     { name: { $regex: keyword, $options: "i" } },
  //     { description: { $regex: keyword, $options: "i" } },
  //   ],
  // });

  const products = await Product.find({ ...req.query })
    .paginate(req.query.page)
    .customSelect(req.query.fields)
    .sort(req.query.sort);

  return res.json({ success: true, results: products });
});

// single product
export const singleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new Error("Product not found!"));
  return res.json({ success: true, results: product });
});
