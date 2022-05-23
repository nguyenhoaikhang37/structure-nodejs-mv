import userRouter from "./user.route.js";
import express from "express";

const router = express.Router();

router.use("/api/user", userRouter);

export default router;
