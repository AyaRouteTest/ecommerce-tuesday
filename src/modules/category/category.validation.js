import joi from "joi";

import { validateObjectId } from "../../middleware/validation.middleware.js";

// create category
export const createCategorySchema = joi
  .object({
    name: joi.string().min(5).max(20).required(),
  })
  .required();

// update category
export const updateCategorySchema = joi
  .object({
    name: joi.string().min(5).max(20),
    categoryId: joi.string().custom(validateObjectId).required(), // id
  })
  .required();

// delete category
export const deleteCategorySchema = joi
  .object({
    categoryId: joi.string().custom(validateObjectId).required(),
  })
  .required();
