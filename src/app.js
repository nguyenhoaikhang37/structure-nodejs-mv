import express from "express";
import createError from "http-errors";
import mainRouter from "./routes/index.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router
app.use(mainRouter);

// Handle errors
app.use((req, res, next) => {
  next(createError.NotFound("This route does not exist."));
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    msg: err.message,
  });
});

export default app;
