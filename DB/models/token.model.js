// schema
import mongoose, { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    expiredAt: { type: String }, //exp
    agent: {
      type: String,
    },
  },
  { timestamps: true }
);

// model
export const Token = mongoose.models.Token || model("Token", tokenSchema);
