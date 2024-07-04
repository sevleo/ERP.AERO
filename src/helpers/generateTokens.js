const jwt = require("jsonwebtoken");

const generateSigninToken = (payload) => {
  console.log("generating signin");
  return jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2s",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign({ payload }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30m",
  });
};

module.exports = {
  generateSigninToken,
  generateRefreshToken,
};
