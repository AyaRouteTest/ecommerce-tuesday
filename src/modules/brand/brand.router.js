import { Router } from "express";
import { isAuthenticated } from "./../../middleware/authentication.middleware.js";
import { isAuthorized } from "./../../middleware/authorization.middleware.js";
import { fileUpload, filterObj } from "./../../utils/multer.js";
import {
  createbrandSchema,
  updatebrandSchema,
  deletebrandSchema,
} from "./brand.validation.js";
import {
  allBrands,
  createbrand,
  deletebrand,
  updatebrand,
} from "./brand.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
const router = Router(); // read param from parent

// merge params

// CRUD
// create
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObj.image).single("brand"),
  isValid(createbrandSchema),
  createbrand
);

// update
router.patch(
  "/:brandId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObj.image).single("brand"),
  isValid(updatebrandSchema),
  updatebrand
);

// // delete
router.delete(
  "/:brandId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deletebrandSchema),
  deletebrand
);

// // get
router.get("/", allBrands);

export default router;
