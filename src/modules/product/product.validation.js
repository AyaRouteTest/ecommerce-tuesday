import joi from "joi";
import { validateObjectId } from "../../middleware/validation.middleware.js";

// create product
export const createProductSchema = joi
  .object({
    name: joi.string().min(2).max(20).required(),
    description: joi.string(),
    availableItems: joi.number().min(1).required(),
    price: joi.number().min(1).required(),
    discount: joi.number().min(1).max(100),
    category: joi.string().custom(validateObjectId),
    subcategory: joi.string().custom(validateObjectId),
    brand: joi.string().custom(validateObjectId),
  })
  .required();

// delete product + read single product
export const productIdSchema = joi
  .object({
    productId: joi.string().custom(validateObjectId).required(),
  })
  .required();
