import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose
  .connect(process.env.MONGO_LOCAL_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log(error.message);
  });

const app = express();

app.use(express.json());

// cookie parser
app.use(cookieParser());
// using this we can extract cookie from the browser.

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});

// API Test
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

// MIDDLEWARE FOR ERROR
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
