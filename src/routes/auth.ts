import express from "express";
import { ErrorRequestHandler, Request, Response } from "express";
import createError from "http-errors";
import logger from "../adapters/logger";

import auth from "../services/authService";
import authMiddleware from "../middlewares/authMiddleware";
import app from "@src/app";

const router = express.Router();

// register
router.post("/register", async (req, res, next) => {
  logger.info(req.body);
  try {
    const user = await auth.register(req.body);
    res.status(200).json({
      status: true,
      message: "User created successfully",
      data: user,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    next(createError(e.statusCode, e.message));
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const data = await auth.login(req.body);
    res.status(200).json({
      status: true,
      message: "Account login successful",
      data,
    });
  } catch (e) {
    //next(createError(e.statusCode, e.message));
    res.status(401).json({
      status: true,
      message: "Fail Login",
    });
  }
});

// all users
router.get("/users", async (req, res, next) => {
  app.use(authMiddleware.authGuard);
  try {
    const users = await auth.all();
    res.status(200).json({
      status: true,
      message: "All users",
      data: users,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    next(createError(e.statusCode, e.message));
  }
});

router.use(async (req: Request, res: Response, next) => {
  next(new createError.NotFound("Route not Found"));
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.use(((err: any, req: Request, res: Response) => {
  res.status(err.status || 500).json({
    status: false,
    message: err.message,
  });
}) as ErrorRequestHandler);

export default router;
