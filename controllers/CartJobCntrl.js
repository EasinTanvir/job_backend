const HttpError = require("../helper/HttpError");
const cartJobSchema = require("../models/cartJob");
const jobSchema = require("../models/jobSchema");
const addToCartJob = async (req, res, next) => {
  const { jobItems, jobId, name, email, phone, country, desc } = req.body;

  const newToCart = new cartJobSchema({
    user: req.userData.id,
    jobItems,
    jobId,
    name,
    email,
    phone,
    country,
    desc,
  });

  let newCartItems;

  try {
    newCartItems = await newToCart.save();
  } catch (err) {
    const errors = new HttpError("create job add to cart failed", 500);
    return next(errors);
  }

  try {
    const jobApp = await jobSchema.findById(req.params.id);

    if (!jobApp.totalApply.includes(req.userData.id)) {
      try {
        await jobApp.updateOne({ $push: { totalApply: req.userData.id } });
      } catch (err) {
        const errors = new HttpError("push failed", 500);
        return next(errors);
      }
    } else {
      const errors = new HttpError("you already applied for that job", 500);
      return next(errors);
    }
  } catch (err) {
    const errors = new HttpError("find job failed", 500);
    return next(errors);
  }

  res.status(200).json(newCartItems);
};

const getCartJob = async (req, res, next) => {
  let getCartItems;

  try {
    getCartItems = await cartJobSchema.find({ user: req.userData.id });
  } catch (err) {
    const errors = new HttpError("create job add to cart failed", 500);
    return next(errors);
  }
  res.status(200).json(getCartItems);
};

const update_CartJob = async (req, res, next) => {
  let findOwner;
  try {
    findOwner = await jobSchema.findById(req.params.id);
  } catch (err) {
    const errors = new HttpError("find owner failed", 500);
    return next(errors);
  }
  if (findOwner.creator === req.userData.id) {
    let getCartItem;

    try {
      getCartItem = await cartJobSchema.findById(req.body.id);
    } catch (err) {
      const errors = new HttpError("create job add to cart failed", 500);
      return next(errors);
    }
    getCartItem.isPending = req.body.isPending;

    let updateCart;
    try {
      updateCart = await getCartItem.save();
    } catch (err) {
      const errors = new HttpError("Update cart items failed", 500);
      return next(errors);
    }
    res.status(200).json(updateCart);
  } else {
    const errors = new HttpError("Sorry you are not owner of that post", 500);
    return next(errors);
  }
};

const update_CartJobReject = async (req, res, next) => {
  let findOwners;
  try {
    findOwners = await jobSchema.findById(req.params.id);
  } catch (err) {
    const errors = new HttpError("find owner failed", 500);
    return next(errors);
  }

  if (findOwners.creator === req.userData.id) {
    let getCartItem;

    try {
      getCartItem = await cartJobSchema.findById(req.body.id);
    } catch (err) {
      const errors = new HttpError("create job add to cart failed", 500);
      return next(errors);
    }
    getCartItem.isRejected = req.body.isRejected;

    let updateCart;
    try {
      updateCart = await getCartItem.save();
    } catch (err) {
      const errors = new HttpError("Update cart items failed", 500);
      return next(errors);
    }
    res.status(200).json(updateCart);
  } else {
    const errors = new HttpError("Sorry you are not owner of that post", 500);
    return next(errors);
  }
};

module.exports = {
  addToCartJob,
  getCartJob,
  update_CartJob,
  update_CartJobReject,
};
