import jwt from "jsonwebtoken";
import { Response } from "express";
import { Env } from "../config/env.config";

/**
 * Reads a cookie value from a raw `Cookie` header (handles `=` inside values and multiple cookies).
 * @param cookieHeader - Full value of the `Cookie` request header.
 * @param name - Cookie name to read.
 * @returns Decoded cookie value, or undefined if absent.
 */
export function getCookieValueFromHeader(
  cookieHeader: string | undefined,
  name: string
): string | undefined {
  if (!cookieHeader) return undefined;
  const prefix = `${name}=`;
  for (const part of cookieHeader.split(";")) {
    const segment = part.trim();
    if (segment.startsWith(prefix)) {
      return segment.slice(prefix.length);
    }
  }
  return undefined;
}

type Time = `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`;
type Cookie = {
  res: Response;
  userId: string;
};

export const setJwtAuthCookie = ({ res, userId }: Cookie) => {
  const payload = { userId };
  const expiresIn = Env.JWT_EXPIRES_IN as Time;
  const token = jwt.sign(payload, Env.JWT_SECRET, {
    audience: ["user"],
    expiresIn: expiresIn || "7d",
  });

  return res.cookie("accessToken", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: Env.NODE_ENV === "production" ? true : false,
    sameSite: Env.NODE_ENV === "production" ? "strict" : "lax",
  });
};

export const clearJwtAuthCookie = (res: Response) =>
  res.clearCookie("accessToken", { path: "/" });
