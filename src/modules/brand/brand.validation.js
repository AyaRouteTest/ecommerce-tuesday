import { validateObjectId } from "../../middleware/validation.middleware.js";
import joi from "joi";

export const createbrandSchema = joi
  .object({
    name: joi.string().required(),
    categoryId: joi.string().custom(validateObjectId).required(),
  })
  .required();

export const updatebrandSchema = joi
  .object({
    name: joi.string(),
    brandId: joi.string().custom(validateObjectId).required(),
  })
  .required();

export const deletebrandSchema = joi
  .object({
    brandId: joi.string().custom(validateObjectId).required(),
  })
  .required();
