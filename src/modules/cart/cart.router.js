import { Router } from "express";
import { isAuthenticated } from "./../../middleware/authentication.middleware.js";
import { cartSchema, removeProductFromCartSchema } from "./cart.validation.js";
import { isValid } from "./../../middleware/validation.middleware.js";
import {
  addToCart,
  userCart,
  updateCart,
  removeProductFromCart,
  clearCart,
} from "./cart.controller.js";
const router = Router();

// CRUD
// add product cart
router.post("/", isAuthenticated, isValid(cartSchema), addToCart);

// user cart
router.get("/", isAuthenticated, userCart);

// update cart
router.patch("/", isAuthenticated, isValid(cartSchema), updateCart);

// clear cart
router.put("/clear", isAuthenticated, clearCart);
// localhost:3000/cart/clear

// remove product from cart
router.patch(
  "/:productId", // localhost:3000/cart/aya
  isAuthenticated,
  isValid(removeProductFromCartSchema),
  removeProductFromCart
);

export default router;
