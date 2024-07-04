// This middleware issues allows entering by refreshToken and sends new access token to the client

import jwt from "jsonwebtoken";
import passport from "passport";
import { isTokenBlacklisted } from "./disableTokens";
import { generateSigninToken } from "./generateTokens";

export const authenticateWithRefresh = async (
  req: any,
  res: any,
  next: any
) => {
  // Attempt to authenticate using passport
  passport.authenticate(
    "jwt",
    { session: false },
    async (err: any, user: any, info: any) => {
      console.log(err);
      console.log(user);
      console.log(info);
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
      if (!refreshTokenSecret) {
        return res.status(500).json({ message: "Server configuration error" });
      }
      if (info && info.name === "tokenExpiredError") return next();

      // If user is authenticated, proceed
      console.log(req.headers);
      if (user) {
        req.user = user;
        return next();
      }

      // If not authenticated, check for refresh token
      console.log(req.headers);
      const refreshToken = req.headers.refreshtoken;

      console.log(refreshToken);

      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (isTokenBlacklisted(refreshToken)) {
        return res.status(401).send("token is blacklisted");
      }

      try {
        // Verify refresh token
        const decoded = await new Promise((resolve, reject) => {
          jwt.verify(
            refreshToken,
            refreshTokenSecret,
            (err: any, decoded: any) => {
              if (err) return reject(err);
              resolve(decoded);
            }
          );
        });

        console.log(decoded);

        const payload = {
          id: (decoded as any).payload.id,
          password: (decoded as any).payload.password,
        };

        const newAccessToken = generateSigninToken(payload);

        console.log(payload);

        res.setHeader("authorization", newAccessToken);

        req.user = {
          id: (decoded as any).payload.id,
          password: (decoded as any).payload.password,
        };

        req.newAccessToken = newAccessToken;
        next();
      } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
  )(req, res, next);
};
