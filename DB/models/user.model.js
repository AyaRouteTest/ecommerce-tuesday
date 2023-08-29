import mongoose, { Schema, model } from "mongoose";
// schema
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    status: {
      type: String,
      enum: ["offline", "online"],
      default: "offline",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    forgetCode: String,
    activationCode: String,
    profilePic: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/doogob7zl/image/upload/v1690825514/ecommerceDefaults/user/profilePic_omg5ry.jpg",
      },
      id: { type: String, default: "ecommerceDefaults/user/profilePic_omg5ry" },
    },
    coverPics: [{ url: { type: String }, id: { type: String } }],
    address: String,
  },
  { timestamps: true }
);

// model
export const User = mongoose.models.User || model("User", userSchema);
