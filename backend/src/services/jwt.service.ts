import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Types } from "mongoose";

export interface JwtPayload {
  id: string;
  role: string;
}

export const generateToken = (userId: Types.ObjectId, role: string): string => {
  return jwt.sign({ id: userId.toString(), role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
