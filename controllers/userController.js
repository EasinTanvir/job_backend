const HttpError = require("../helper/HttpError");
const userSchema = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SignUp = async (req, res, next) => {
  const { password } = req.body;

  if (!password || password.trim().length < 6) {
    const errors = new HttpError("Password must be 6 character", 500);
    return next(errors);
  }
  let existingUser;

  try {
    existingUser = await userSchema.findOne({ email: req.body.email });
  } catch (err) {
    const errors = new HttpError("fetch user failed", 500);
    return next(errors);
  }
  if (existingUser) {
    const errors = new HttpError("Sorry email already taken", 500);
    return next(errors);
  }

  let hashPass;
  try {
    hashPass = await bcrypt.hash(password, 12);
  } catch (err) {
    const errors = new HttpError("Password must be 6 character", 500);
    return next(errors);
  }
  let createUser;
  try {
    createUser = await userSchema.create({
      ...req.body,
      password: hashPass,
    });
  } catch (err) {
    const errors = new HttpError("Create user failed", 500);
    return next(errors);
  }

  let token;
  try {
    token = jwt.sign(
      {
        id: createUser._id,
        email: createUser.email,
        name: createUser.name,
        isAdmin: createUser.isAdmin,
        token: token,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "24h" }
    );
  } catch (err) {
    const errors = new HttpError("create token failed", 500);
    return next(errors);
  }

  res.status(200).json({
    id: createUser._id,
    email: createUser.email,
    name: createUser.name,
    isAdmin: createUser.isAdmin,
    token: token,
  });
};

const SignIn = async (req, res, next) => {
  let existingUser;

  try {
    existingUser = await userSchema.findOne({ email: req.body.email });
  } catch (err) {
    const errors = new HttpError("fetch user failed", 500);
    return next(errors);
  }
  if (!existingUser) {
    const errors = new HttpError("sorry no user found!!", 500);
    return next(errors);
  }

  let hashPass;
  try {
    hashPass = await bcrypt.compare(req.body.password, existingUser.password);
  } catch (err) {
    const errors = new HttpError("password hashed failed", 500);
    return next(errors);
  }
  if (!hashPass) {
    const errors = new HttpError("Invalid password", 500);
    return next(errors);
  }

  let token;
  try {
    token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        isAdmin: existingUser.isAdmin,
        token: token,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "24h" }
    );
  } catch (err) {
    const errors = new HttpError("create token failed", 500);
    return next(errors);
  }

  res.status(200).json({
    id: existingUser._id,
    email: existingUser.email,
    name: existingUser.name,
    isAdmin: existingUser.isAdmin,
    token: token,
  });
};

const getuser = async (req, res, next) => {
  let users;

  try {
    users = await userSchema.findById(req.userData.id);
  } catch (err) {
    const errors = new HttpError("fetch usr failed", 500);
    return next(errors);
  }
  res.status(200).json(users);
};

const updateUser = async (req, res, next) => {
  const { name, oldPassword, newPassword } = req.body;

  let users;

  try {
    users = await userSchema.findById(req.userData.id);
  } catch (err) {
    const errors = new HttpError("fetch usr failed", 500);
    return next(errors);
  }

  if (oldPassword) {
    let hashPass;
    try {
      hashPass = await bcrypt.compare(oldPassword, users.password);
    } catch (err) {
      const errors = new HttpError("Password hashed failed", 500);
      return next(errors);
    }

    if (!hashPass) {
      const errors = new HttpError("Sorry your old password is incorrect", 500);
      return next(errors);
    }

    if (newPassword.trim().length < 7) {
      const errors = new HttpError("Password must be 6 character", 500);
      return next(errors);
    }

    let updateHashPass;
    try {
      updateHashPass = await bcrypt.hash(newPassword, 12);
    } catch (err) {
      const errors = new HttpError("newPassword hashed failed", 500);
      return next(errors);
    }
    users.password = updateHashPass;
  }

  if (name) {
    users.name = name;
  }

  try {
    await users.save();
  } catch (err) {
    const errors = new HttpError("User update failed", 500);
    return next(errors);
  }

  res.status(200).json({ message: "User Credentials Update successfully" });
};

module.exports = {
  SignUp,
  SignIn,
  getuser,
  updateUser,
};
