import { Router } from "express";
import { isAuthenticated } from "./../../middleware/authentication.middleware.js";
import { isAuthorized } from "./../../middleware/authorization.middleware.js";
import { fileUpload, filterObj } from "./../../utils/multer.js";
import {
  createSubcategorySchema,
  updateSubcategorySchema,
} from "./subcategory.validation.js";
import {
  allSubcategories,
  createSubcategory,
  deleteSubcategory,
  updateSubcategory,
} from "./subcategory.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
const router = Router({ mergeParams: true }); // read param from parent

// merge params

// CRUD
// create
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObj.image).single("subcategory"),
  isValid(createSubcategorySchema),
  createSubcategory
);

// update
router.patch(
  "/:subcategoryId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObj.image).single("subcategory"),
  isValid(updateSubcategorySchema),
  updateSubcategory
);

// delete
router.delete(
  "/:subcategoryId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(updateSubcategorySchema),
  deleteSubcategory
);

// get
router.get("/", allSubcategories);

export default router;
