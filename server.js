const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const HttpError = require("./helper/HttpError");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const cartAddRoutes = require("./routes/cartJobRoutes");

dotenv.config();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE"
  );

  next();
});

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.once("error", (err) => console.log(err));
db.on("open", () => {
  console.log("database connected");
});

app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/cart/job", cartAddRoutes);

app.use((req, res, next) => {
  const errors = new HttpError("no routes found for this path  ", 404);
  return next(errors);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "unknown error occured" });
});

app.listen(process.env.PORT);
