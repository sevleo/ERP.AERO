const asyncHandler = require("express-async-handler");
const calculateLatency = require("../helpers/calculateLatency");
const { isTokenBlacklisted } = require("../helpers/disableTokens");
const passport = require("passport");

const info = asyncHandler(async (req, res) => {
  console.log("display data info");
  console.log(req);

  console.log(isTokenBlacklisted(req.headers.authorization));
  if (isTokenBlacklisted(req.headers.authorization)) {
    res.status(401).send("token is blacklisted");
  }

  if (req.user) {
    try {
      res.status(200).send({
        success: true,
        message: "Loaded Info Page",
        userId: req.user.id,
        newAccessToken: req.newAccessToken,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error.");
    }
  } else {
    console.log("not logged in");
    res.status(500).send("Internal server error");
  }
});

const latency = asyncHandler(async (req, res) => {
  console.log("display latency info");
  console.log(req.headers.authorization);
  console.log(isTokenBlacklisted(req.headers.authorization));

  if (isTokenBlacklisted(req.headers.authorization)) {
    res.status(401).send("token is blacklisted");
  }

  const latency = calculateLatency();
  if (req.user) {
    console.log(req.user);
    try {
      res.status(200).send({
        success: true,
        message: "Loaded Latency Page",
        userId: req.user.id,
        latency: latency,
        newAccessToken: req.newAccessToken,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    }
  } else {
    console.log("not logged in");
  }
});

const displayData = {
  info,
  latency,
};
module.exports = displayData;
