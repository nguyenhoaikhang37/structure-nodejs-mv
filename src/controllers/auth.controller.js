import createError from "http-errors";
import Jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { userValidate } from "../helpers/validations.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../helpers/jwt-service.js";

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { error } = userValidate({ username, password });
    if (error) {
      throw createError(error.details[0].message);
    }

    // Check xem username đã tồn tại trong DB chưa
    const isExist = await User.findOne({ username });
    if (isExist) {
      throw createError.Conflict(
        `${username} is registered username. Please choose another username!`
      );
    }

    // Tạo user vào DB
    const isCreate = await User.create({
      username,
      password,
    });

    isCreate.password = undefined;

    res.json({
      success: true,
      data: isCreate,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { error } = userValidate(req.body);
    if (error) {
      throw createError(error.details[0].message);
    }

    // Check xem username có trong DB không
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      throw createError.NotFound("Username or password is incorrect. Please try again!");
    }

    // Check password có trùng khớp không
    const isValidPassword = await user.isCheckPassword(password);
    if (!isValidPassword) {
      throw createError.NotFound("Username or password is incorrect. Please try again!");
    }

    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);

    res.json({
      success: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();

    // Check xem token đúng hay không
    const { userId } = await verifyRefreshToken(refreshToken);
    const newAccessToken = await signAccessToken(userId);
    const newRefreshToken = await signRefreshToken(userId);

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  res.json("Function logout");
};

const protectRoute = async (req, res, next) => {
  try {
    // Lấy token từ req.headers.authorization
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      next(createError.Unauthorized("Please log in to get token!"));
    }

    // Check xem token đúng hay không
    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return next(createError.Unauthorized(err.message));
        }
        return next(createError.Unauthorized(err.message));
      }

      const freshUser = await User.findOne({ _id: payload.userId });
      req.user = freshUser;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export { login, register, refreshToken, logout, protectRoute };
