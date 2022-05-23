import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };
    const secret_key = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "30s",
    };

    Jwt.sign(payload, secret_key, options, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
};

const signRefreshToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };
    const secret_key = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
    };

    Jwt.sign(payload, secret_key, options, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
};

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) {
        return reject(err);
      }
      resolve(payload);
    });
  });
};

export { signAccessToken, signRefreshToken, verifyRefreshToken };
