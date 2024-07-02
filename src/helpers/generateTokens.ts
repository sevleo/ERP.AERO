import jwt from "jsonwebtoken";

export const generateSigninToken = (username: string) => {
  return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1m",
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!);
};
