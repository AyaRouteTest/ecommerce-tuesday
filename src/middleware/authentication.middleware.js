import { asyncHandler } from "./../utils/asyncHandler.js";
import { Token } from "./../../DB/models/token.model.js";
import { User } from "./../../DB/models/user.model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  // check token existence + Bearer key
  let token = req.headers["token"];
  if (!token || !token.startsWith(process.env.BEARER_KEY))
    return next(new Error("Valid token is required!"));
  // verify token
  token = token.split(process.env.BEARER_KEY)[1];
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  if (!decoded) return next(new Error("Token is invalid!", { cause: 401 }));
  // check token in DB
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) return next(new Error("Expired token!", { cause: 401 }));
  // check user existence
  const user = await User.findOne({ email: decoded.email });
  if (!user) return next(new Error("User not found!"));
  // pass user
  req.user = user;

  return next();
});
