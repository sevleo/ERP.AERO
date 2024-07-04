import jwt from "jsonwebtoken";

export const generateSigninToken = (payload: object) => {
  return jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "30s",
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign({ payload }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "30m",
  });
};
