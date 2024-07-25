import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All filds are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid credentials"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    const { password: pass, ...rest } = validUser._doc;

    //  NOTE: if we dont use 'expires' then the session will expired when the browser is closed.
    // We use token to every logged in user, give them authorization and help them to log out with help of that token.

    res
      .status(200)
      .cookie("access_token", token, {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      })
      // .json({ token, rest });
      // .json(rest);
      // .json({ success: true, message: "Sign in successful", rest });
      .json(rest);
  } catch (error) {
    next(error);
  }
};
