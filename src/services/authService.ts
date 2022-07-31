// services/auth.service.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import createError from "http-errors";

import jwt from "../utils/jwt";

const prisma = new PrismaClient();

interface dataProps {
  email: string;
  password: string;
  accessToken: string;
}

const register = async (data: dataProps) => {
  data.password = bcrypt.hashSync(data.password, 8);
  const user = prisma.user.create({
    data,
  });
  data.accessToken = await jwt.signAccessToken(user);

  return data;
};

const login = async (data: dataProps) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  console.log(user);
  if (!user) {
    throw new createError.NotFound("User not registered");
  }

  const checkPassword = bcrypt.compareSync(password, `${user.password}`);
  if (!checkPassword)
    throw new createError.Unauthorized("Email address or password not valid");

  //delete user.password;

  const accessToken = await jwt.signAccessToken(user);

  return { ...user, accessToken };
};

const all = async () => {
  const allUsers = await prisma.user.findMany();

  return allUsers;
};

export default { register, login, all };
