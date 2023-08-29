// schema
import mongoose, { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, min: 5, max: 20 },
    slug: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    category: { type: Types.ObjectId, required: true, ref: "Category" },
  },
  {
    timestamps: true,
  }
);
// model
export const Subcategory =
  mongoose.models.Subcategory || model("Subcategory", subCategorySchema);
