const mongoose = require("mongoose");

const createJob = new mongoose.Schema(
  {
    creator: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    vacancy: { type: Number, default: 0 },
    salary: { type: Number, default: 5000 },
    jobType: { type: String, required: true },
    shift: { type: String, default: "8 hours" },
    education: { type: String, required: true },
    exp: { type: String, required: true },
    desc: { type: String, required: true },
    totalApply: { type: Array, default: [] },
    expire: {
      type: Date,
      default: new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * 30
      ).toLocaleDateString(),
    },
  },
  { timestamps: true }
);

createJob.set("toJSON", { getters: true });

module.exports = mongoose.model("jobs", createJob);
