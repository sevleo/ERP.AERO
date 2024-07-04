// This middleware issues allows entering by refreshToken and sends new access token to the client

const jwt = require("jsonwebtoken");
const passport = require("passport");
const { isTokenBlacklisted } = require("./disableTokens");
const { generateSigninToken } = require("./generateTokens");

const authenticateWithRefresh = async (req, res, next) => {
  // Attempt to authenticate using passport
  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
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

    console.log(isTokenBlacklisted(refreshToken));

    try {
      // Verify refresh token
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        });
      });

      console.log(decoded);

      const payload = {
        id: decoded.payload.id,
        password: decoded.payload.password,
      };

      console.log(payload);

      const newAccessToken = generateSigninToken(payload);

      console.log(payload);

      res.setHeader("authorization", newAccessToken);

      req.user = {
        id: decoded.payload.id,
        password: decoded.payload.password,
      };

      req.newAccessToken = newAccessToken;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  })(req, res, next);
};

module.exports = authenticateWithRefresh;
