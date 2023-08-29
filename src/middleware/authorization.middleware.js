import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthorized = (role) => {
  return (req, res, next) => {
    // check role
    if (req.user.role != role)
      return next(new Error("Not authorized!", { cause: 403 }));

    return next();
  };
};
