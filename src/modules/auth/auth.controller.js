import { asyncHandler } from "./../../utils/asyncHandler.js";
import { User } from "./../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "./../../utils/sendEmails.js";
import { signUpTemp, resetPassTemp } from "./../../utils/generateHTML.js";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/token.model.js";
import randomstring from "randomstring";
import { Cart } from "./../../../DB/models/cart.model.js";

// Register
export const register = asyncHandler(async (req, res, next) => {
  // data from request
  const { userName, email, password } = req.body;
  // check user existence
  const isUser = await User.findOne({ email });
  if (isUser) return next(new Error("Email already existed!", { cause: 409 }));
  // hash password
  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );
  // generate activationCode
  const activationCode = crypto.randomBytes(64).toString("hex");

  // create user
  const user = await User.create({
    email,
    userName,
    password: hashPassword,
    activationCode,
  });
  // create confirmationLink
  const link = `http://localhost:3000/auth/confirmEmail/${activationCode}`;
  // send email
  const isSent = await sendEmail({
    to: email,
    subject: "Activate your account",
    html: signUpTemp(link),
  });
  // send response
  return isSent
    ? res.json({ success: true, message: "Please review your email!" })
    : next(new Error("Something went wrong!"));
});

// Activate Account
export const activateAccount = asyncHandler(async (req, res, next) => {
  // find user , delete the activationCode , update isConfirmed
  const user = await User.findOneAndUpdate(
    {
      activationCode: req.params.activationCode,
    },
    { isConfirmed: true, $unset: { activationCode: 1 } }
  );

  // check if the user doesn't exist
  if (!user) return next(new Error("User not found!", { cause: 400 }));

  // create a cart >>>>> TODO
  await Cart.create({ user: user._id });

  // send response
  return res.send(
    "Congratulations, you account is now activated! Try to login ..."
  );
});

// login
export const login = asyncHandler(async (req, res, next) => {
  // data from request
  const { email, password } = req.body;
  // check user existence
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found!", { cause: 404 }));
  // check isConfirmed
  if (!user.isConfirmed)
    return next(new Error("Please activate your account!", { cause: 400 }));
  // check password
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) return next(new Error("Invalid password!"));
  // generate token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.TOKEN_KEY,
    { expiresIn: "2d" }
  );
  // save token in token model
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
    expiredAt: jwt.verify(token, process.env.TOKEN_KEY).exp,
  });
  // change user status to online and save user
  user.status = "online";
  await user.save();
  // send response
  return res.json({ success: true, results: token });
});

// send forget code
export const sendForgetCode = asyncHandler(async (req, res, next) => {
  // data from request
  const { email } = req.body;
  // check user existence
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found!", { cause: 404 }));
  // generate forgetCode
  const forgetCode = randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  // save forgetCode to user
  user.forgetCode = forgetCode;
  await user.save();
  // send email
  const isSent = await sendEmail({
    to: email,
    subject: "Reset Password",
    html: resetPassTemp(forgetCode),
  });
  // send response
  return isSent
    ? res.json({ success: true, message: "Code sent to you email!" })
    : next(new Error("Something went wrong!"));
});

// reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  // data from request
  const { forgetCode, password } = req.body;
  // check user existence
  const user = await User.findOne({ forgetCode });
  if (!user) return next(new Error("User not found!", { cause: 404 }));
  // check the forgetCode
  if (user.forgetCode !== forgetCode)
    return next(new Error("Invalid Code!", { cause: 400 }));
  // delete forgetCode
  await User.findOneAndUpdate({ forgetCode }, { $unset: { forgetCode: 1 } });
  // hash password and save user
  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );
  user.password = hashPassword;
  user.status = "offline";
  await user.save();
  // find all token of the user
  const tokens = await Token.find({ user: user._id });
  // invalidate all tokens
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  // send response
  return res.json({ success: true, message: "Try to login again!" });
});
