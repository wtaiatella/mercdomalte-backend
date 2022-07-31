import jwt from "../utils/jwt";
import createError from "http-errors";
import { NextFunction, Request, RequestHandler, Response } from "express";

const authGuard: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return next(new createError.Unauthorized("Access token is required"));
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(new createError.Unauthorized());
  }
  await jwt
    .verifyAccessToken(token)
    .then((user) => {
      //req.user = user;
      console.log(user);
      next();
    })
    .catch((e) => {
      next(new createError.Unauthorized(e.message));
    });
};

export default { authGuard };
