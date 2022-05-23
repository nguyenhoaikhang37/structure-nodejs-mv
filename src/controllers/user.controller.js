import User from "../models/user.model.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("+password");

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export { getAllUsers };
