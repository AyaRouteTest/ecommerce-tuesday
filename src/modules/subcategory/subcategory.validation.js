import joi from "joi";
import { validateObjectId } from "../../middleware/validation.middleware.js";
// create subcategory
export const createSubcategorySchema = joi
  .object({
    name: joi.string().min(5).max(20).required(),
    categoryId: joi.string().custom(validateObjectId).required(),
  })
  .required();

// update subcategory
export const updateSubcategorySchema = joi
  .object({
    name: joi.string().min(5).max(20),
    categoryId: joi.string().custom(validateObjectId).required(),

    subcategoryId: joi.string().custom(validateObjectId).required(),
  })
  .required();

// delete subcategory
export const deleteSubcategorySchema = joi
  .object({
    categoryId: joi.string().custom(validateObjectId).required(),
    subcategoryId: joi.string().custom(validateObjectId).required(),
  })
  .required();
