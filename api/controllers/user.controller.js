import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

const salt = process.env.SALT_ROUNDS;

export const test = (req, res) => {
  res.json({ message: "API is working" });
};

export const updateUser = async (req, res, next) => {
  // console.log(req.user);
  /* 
      { id: '66a3c52ea14be7766fda67ff', iat: 1722008899, exp: 1722613699 }

      In a terminal, the above id is comming form the cookie. That means the id which we req as put in postman for update, the user is valid.

      In route, the user id is comming = req.params 
      In verifyToken/cookie, the user id is comming = req.user 

      -----------------------------------------------------------
      - In 'jwt.sign', we stored id as 'id' not '_id'.
          [ const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET); ]
           
      - '_id' denotes the id of 'mongodb' in our case.
      -----------------------------------------------------------
  */

  // handling error for id
  if (req.user.id !== req.params.userId) {
    // here, we are passing parameter/params using 'id' naming as 'userId' in the router (name can be different).
    // and comparing with the 'id' stored in cookie.
    return next(errorHandler(403, "You are not allowed to update this user."));
  }

  // handling error for username
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }

  // handling error for password
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    // if password requirement is match then converting into hash form
    req.body.password = bcryptjs.hashSync(req.body.password, salt);
  }

  // updating user if all above requirement is match
  try {
    const updateUser = await User.findByIdAndUpdate(
      // here id is from route as parameter
      req.params.userId,
      {
        // here '$set' helps to update whatever user is req to update.
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
