const mongoose = require("mongoose");

const createUser = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

createUser.set("toJSON", { getters: true });

module.exports = mongoose.model("users", createUser);
