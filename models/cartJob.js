const mongoose = require("mongoose");

const cartJobItems = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    jobId: { type: String, required: true },
    jobItems: {
      title: { type: String, required: true },
      image: { type: String, required: true },
      job: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "jobs",
      },
    },

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    desc: { type: String, required: true },
    isRejected: { type: Boolean, default: false },
    isPending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

cartJobItems.set("toJSON", { getters: true });

module.exports = mongoose.model("cartjobs", cartJobItems);
