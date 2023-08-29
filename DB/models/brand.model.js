import mongoose, { Schema, Types, model } from "mongoose";
import slugify from "slugify";

// schema
const brandSchema = new Schema({
  name: { type: String, required: true, min: 5, max: 20, unique: true }, // Mobile Phone
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    url: { type: String, required: true },
    id: { type: String, required: true },
  },
  category: [{ type: Types.ObjectId, ref: "Category" }],
});

// virtual
brandSchema.virtual("slug").get(function () {
  return slugify(this.name);
});

// model
export const Brand = mongoose.models.Brand || model("Brand", brandSchema);
