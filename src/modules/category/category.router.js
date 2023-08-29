import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload, filterObj } from "../../utils/multer.js";
import { isValid } from "./../../middleware/validation.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "./category.validation.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  allCategories,
} from "./category.controller.js";
import subcatgoryRouter from "./../subcategory/subcategory.router.js";
import productRouter from "./../product/product.router.js";
const router = Router();

router.use("/:categoryId/subcategory", subcatgoryRouter);
router.use("/:categoryId/products", productRouter);

/// CRUD >>> Category
// create category
// validation, authentication, authorization, fileUpload, createCategory
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObj.image).single("category"), // parsing formdata
  isValid(createCategorySchema),
  createCategory
);

// update category
router.patch(
  "/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObj.image).single("category"),
  isValid(updateCategorySchema),
  updateCategory
);

// delete category
router.delete(
  "/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deleteCategorySchema),
  deleteCategory
);

// get categories
router.get("/", allCategories);
export default router;
