import express from "express";

import {
  login,
  logout,
  register,
  protectRoute,
  refreshToken,
} from "../controllers/auth.controller.js";
import { getAllUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh-token", refreshToken);

router.post("/logout", logout);

router.get("/", protectRoute, getAllUsers);

export default router;
