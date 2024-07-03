import jwt from "jsonwebtoken";

export const generateSigninToken = (payload: object) => {
  return jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "10m",
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign({ payload }, process.env.REFRESH_TOKEN_SECRET!);
};
