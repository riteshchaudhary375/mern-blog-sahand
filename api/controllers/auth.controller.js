import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

const salt = process.env.SALT_ROUNDS;

export const signup = async (req, res, next) => {
  //   res.json({ message: "Auth route" });
  //   console.log(req.body);

  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    /* return res
      .status(400)
      .json({ status: false, message: "All fields are required" }); */

    next(errorHandler(400, "All filds are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json({
      success: true,
      message: "Signup successful",
    });
  } catch (error) {
    /* res.status(500).json({
      success: false,
      message: error.message,
    }); */

    next(error);
  }
};
