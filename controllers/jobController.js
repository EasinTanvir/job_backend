const HttpError = require("../helper/HttpError");
const jobSchema = require("../models/jobSchema");
const cartJobSchema = require("../models/cartJob");

const createJobs = async (req, res, next) => {
  let newJobs;

  try {
    newJobs = await jobSchema.create({ ...req.body, creator: req.userData.id });
  } catch (err) {
    const errors = new HttpError("create job failed", 500);
    return next(errors);
  }
  res.status(200).json(newJobs);
};

const getJobs = async (req, res, next) => {
  let findJobs;

  const search = req.query.search
    ? {
        title: { $regex: req.query.search, $options: "i" },
      }
    : {};

  const location = req.query.location
    ? {
        location: { $regex: req.query.location, $options: "i" },
      }
    : {};

  const category = req.query.category
    ? {
        title: { $regex: req.query.category, $options: "i" },
      }
    : {};

  const type = req.query.type
    ? {
        jobType: { $regex: req.query.type, $options: "i" },
      }
    : {};

  try {
    findJobs = await jobSchema.find({
      ...search,
      ...location,
      ...category,
      ...type,
    });
  } catch (err) {
    const errors = new HttpError("create job failed", 500);
    return next(errors);
  }
  res.status(200).json(findJobs);
};

const findJobsById = async (req, res, next) => {
  let findJobs;
  try {
    findJobs = await jobSchema.findById(req.params.id);
  } catch (err) {
    const errors = new HttpError("create job failed", 500);
    return next(errors);
  }
  res.status(200).json(findJobs);
};

const findJobsByLocation = async (req, res, next) => {
  let locationJobs;
  try {
    locationJobs = await jobSchema.find({ location: req.params.location });
  } catch (err) {
    const errors = new HttpError("create job failed", 500);
    return next(errors);
  }
  res.status(200).json(locationJobs);
};

const getPostJobs = async (req, res, next) => {
  let postJobs;
  try {
    postJobs = await jobSchema.find({ creator: req.userData.id });
  } catch (err) {
    const errors = new HttpError("get post job failed", 500);
    return next(errors);
  }
  res.status(200).json(postJobs);
};

const getApplyUserDetails = async (req, res, next) => {
  let postJobs;
  try {
    postJobs = await jobSchema.findById(req.params.id);

    const allUsers = await Promise.all(
      postJobs.totalApply.map((item) =>
        cartJobSchema.find({
          $and: [{ user: item, jobId: req.params.id }],
        })
      )
    );
    if (allUsers.length === 0) {
      const errors = new HttpError("No one Apply for that position yet", 500);
      return next(errors);
    }
    res.status(200).json(allUsers.flat());
  } catch (err) {
    const errors = new HttpError("get apply user details failed", 500);
    return next(errors);
  }
};

module.exports = {
  createJobs,
  getJobs,
  findJobsById,
  findJobsByLocation,
  getPostJobs,
  getApplyUserDetails,
};
