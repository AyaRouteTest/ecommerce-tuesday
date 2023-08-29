// schema
import mongoose, { Schema, Types, model } from "mongoose";
const productSchema = new Schema(
  {
    name: { type: String, require: true, min: 2, max: 20 },
    slug: { type: String, required: true },
    description: { type: String }, // default
    images: [
      {
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    defaultImage: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    availableItems: { type: Number, required: true, min: 1 },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, required: true, min: 1 }, // original price
    discount: { type: Number, min: 1, max: 100 }, // %
    createdBy: { type: Types.ObjectId, required: true, ref: "User" },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Types.ObjectId, ref: "Subcategory", required: true },
    brand: { type: Types.ObjectId, ref: "Brand", required: true },
    cloudFolder: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
  }
);

// virtuals
productSchema.virtual("finalPrice").get(function () {
  // this >>> document >>> product document
  // price discount%
  // if (this.discount > 0) return this.price - (this.price * this.discount) / 100;
  // return this.price;
  if (this.price) {
    return Number.parseFloat(
      this.price - (this.price * this.discount || 0) / 100
    ).toFixed(2);
  }
});

// Query Helper
productSchema.query.paginate = function (page) {
  //**************** pagination **************//
  page = !page || page < 1 || isNaN(page) ? 1 : page;
  const limit = 2;
  const skip = (page - 1) * limit;

  return this.skip(skip).limit(limit);
  // this >>> query
  // retrun query
};

productSchema.query.customSelect = function (fields) {
  // this >>> query
  // retrun query
  if (!fields) return this;

  // model keys
  const modelKeys = Object.keys(Product.schema.paths);
  // queryKeys
  const queryKeys = fields.split(" ");
  // matchedKeys
  const matchedKeys = queryKeys.filter((key) => modelKeys.includes(key));

  return this.select(matchedKeys);
};

// stock function
productSchema.methods.inStock = function (requiredQuantity) {
  // this >>> doc >>> product document
  return this.availableItems >= requiredQuantity ? true : false;
};

// model
export const Product =
  mongoose.models.Product || model("Product", productSchema);
