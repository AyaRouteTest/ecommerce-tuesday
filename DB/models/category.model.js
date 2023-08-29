import mongoose, { Schema, Types, model } from "mongoose";

// schema
const categorySchema = new Schema(
  {
    name: { type: String, required: true, min: 5, max: 20, unique: true }, // Mobile Phone
    slug: { type: String }, // Mobile-Phone
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // json
    toObject: { virtuals: true }, // object
  }
);

categorySchema.virtual("subcategory", {
  ref: "Subcategory",
  localField: "_id",
  foreignField: "category",
});

// model
export const Category =
  mongoose.models.Category || model("Category", categorySchema);
