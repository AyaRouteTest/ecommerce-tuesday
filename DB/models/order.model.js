import mongoose, { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    products: [
      {
        _id: false,
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, min: 1 },
        name: String,
        itemPrice: Number,
        totalPrice: Number,
      },
    ],
    invoice: { id: String, url: String },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    coupon: {
      id: { type: Types.ObjectId, ref: "Coupon" },
      name: String,
      discount: { type: Number, min: 1, max: 100 },
    },

    status: {
      type: String,
      enum: [
        "placed",
<<<<<<< HEAD
=======
        "payed",
        "failed payment",
>>>>>>> 2d5de5870a19f01593442d015d49f73de8a5481c
        "shipped",
        "delivered",
        "canceled",
        "refunded",
<<<<<<< HEAD
        "payed",
        "failed to pay",
=======
>>>>>>> 2d5de5870a19f01593442d015d49f73de8a5481c
      ],
      default: "placed",
    },
    payment: {
      type: String,
      enum: ["visa", "cash"],
      default: "cash",
    },
  },
  { timestamps: true }
);

orderSchema.virtual("finalPrice").get(function () {
  return this.coupon
    ? Number.parseFloat(
        this.price - (this.price * this.coupon.discount) / 100
      ).toFixed(2)
    : this.price;
});

export const Order = mongoose.models.Order || model("Order", orderSchema);
