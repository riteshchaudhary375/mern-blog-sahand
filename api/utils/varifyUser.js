import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  // to access token stored in cookie, we need to install 'cookie-parser'
  // npm i cookie-parser

  // and, we need to initialize in base api file i.e., 'index.js'
  // using this we can extract cookie from the browser.

  const token = req.cookies.access_token;

  // now we need to verify the token because we don't know whose token will be.

  // if token is unknown
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  // if token is known, we first verify that extracted token from browser by comparing with our jwt secret key with the combination of the particular user-id.
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }

    // otherwise we send user data along with req for further actions of user
    // making authorized to the user for further actions...
    req.user = user;
    // if user verified, 'user' will add 'req'
    // and then it will pass through 'next' to up-comming method...
    next();
    // e.g. we use 'verifyToken' in 'user-route' and 'next' is for 'updateUser' method.
  });
};
