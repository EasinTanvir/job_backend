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
  const {
    search: searchText,
    location: searchLocation,
    jobType,
    category,
    page,
    minPrice,
    maxPrice,
  } = req.query;

  let findJobs;

  const search = searchText
    ? {
        title: { $regex: searchText, $options: "i" },
      }
    : {};

  const location = searchLocation
    ? {
        location: { $regex: searchLocation, $options: "i" },
      }
    : {};

  const cat = category
    ? {
        title: { $regex: category, $options: "i" },
      }
    : {};

  const type = jobType
    ? {
        jobType: { $regex: jobType, $options: "i" },
      }
    : {};

  const priceCondition = {};
  if (minPrice !== undefined) {
    priceCondition.$gte = minPrice;
  }
  if (maxPrice !== undefined) {
    priceCondition.$lte = maxPrice;
  }

  const priceFilter = Object.keys(priceCondition).length
    ? { salary: priceCondition }
    : {};

  let totalJob = await jobSchema.find({
    ...search,
    ...location,
    ...cat,
    ...type,
    ...priceFilter,
  });

  const currentPage = page ? page : 1;
  const jobPerPage = 4;
  const totalPage = Math.round(totalJob.length / 4);

  const skipJob = currentPage * jobPerPage - jobPerPage;

  try {
    findJobs = await jobSchema
      .find({
        ...search,
        ...location,
        ...cat,
        ...type,
        ...priceFilter,
      })
      .skip(skipJob)
      .limit(jobPerPage);
  } catch (err) {
    const errors = new HttpError("create job failed", 500);
    return next(errors);
  }
  res.status(200).json({ jobs: findJobs, page: totalPage });
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
