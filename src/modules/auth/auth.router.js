import { Router } from "express";
import { isValid } from "./../../middleware/validation.middleware.js";
import {
  activateSchema,
  forgetCodeSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import {
  register,
  activateAccount,
  login,
  sendForgetCode,
  resetPassword,
} from "./auth.controller.js";
const router = Router();

///// Register
router.post("/register", isValid(registerSchema), register);

///// Activate Account
router.get(
  "/confirmEmail/:activationCode",
  isValid(activateSchema),
  activateAccount
);

///// Login
router.post("/login", isValid(loginSchema), login);

// send forget code
router.patch("/forgetCode", isValid(forgetCodeSchema), sendForgetCode);

// reset password
router.patch("/resetPassword", isValid(resetPasswordSchema), resetPassword);

export default router;
