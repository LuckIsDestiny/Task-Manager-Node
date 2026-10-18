import type { LoginSchema, RegisterSchema } from "./auth.validation.js";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { env } from "../../config/env.js";

export const register = async (data: RegisterSchema) => {
  const encryptedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: { name: data.name, email: data.email, password: encryptedPassword },
    omit: { password: true },
  });
};

export const login = async (data: LoginSchema) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const jwtPayload = { id: user.id, role: user.role };
  const jwtToken = jwt.sign(jwtPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token: jwtToken };
};
