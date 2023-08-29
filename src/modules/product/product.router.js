import { Router } from "express";
import { isAuthenticated } from "./../../middleware/authentication.middleware.js";
import { isAuthorized } from "./../../middleware/authorization.middleware.js";
import { isValid } from "./../../middleware/validation.middleware.js";
import { fileUpload, filterObj } from "./../../utils/multer.js";
import { createProductSchema, productIdSchema } from "./product.validation.js";
import {
  addProduct,
  deleteProduct,
  allProducts,
  singleProduct,
} from "./product.controller.js";
const router = Router({ mergeParams: true });

// CRUD
// create product
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObj.image).fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  isValid(createProductSchema),
  addProduct
);

// delete product
router.delete(
  "/:productId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(productIdSchema),
  deleteProduct
);

// all products
router.get("/", allProducts);

// read all products of certain category
// categoryId ????

// single product
router.get("/single/:productId", isValid(productIdSchema), singleProduct);
export default router;
