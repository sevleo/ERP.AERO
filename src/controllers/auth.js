const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const connection = require("../db");
const {
  generateRefreshToken,
  generateSigninToken,
} = require("../helpers/generateTokens");
const {
  addToBlacklist,
  isTokenBlacklisted,
} = require("../helpers/disableTokens");
const validator = require("validator");

const signup = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (
    !validator.isEmail(username) &&
    !validator.isMobilePhone(username, "any")
  ) {
    return res.status(400).json({
      message: "Username must be either a valid email address or phone number.",
    });
  }

  try {
    // Check if user already exists
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [username]);

    if (rows.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    }

    // Hash the password with bcrypt, using 10 rounds of salt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user id
    // Insert new user into the database
    const insertQuery = "INSERT INTO users (id, password) VALUES (?, ?)";
    await connection.promise().query(insertQuery, [username, hashedPassword]);

    // For requesting bearer token by id & password
    const payload = {
      id: username,
      password: password,
    };

    // Generate tokens
    const accessToken = generateSigninToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(200).send({
      success: true,
      message: "User created successfully.",
      accessToken: accessToken,
      refreshToken: refreshToken,
      username: username,
    });
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).send("Internal server error.");
  }
});

const signin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    // Check if user exists
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [username]);

    const user = rows[0];

    if (!user || !user.id) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const payload = {
      id: user.id,
      password: password,
    };

    // Generate tokens
    const accessToken = generateSigninToken(payload);
    const refreshToken = generateRefreshToken(payload);

    console.log(payload);

    res.status(200).send({
      success: true,
      message: "Logged in successfully",
      accessToken: accessToken,
      refreshToken: refreshToken,
      username: user.id,
    });
  } catch (err) {
    console.error("Error signing in:", err);
    res.status(500).send("Internal server error.");
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    const accessToken = req.body.accessToken;
    const refreshToken = req.body.refreshToken;

    if (!accessToken || !refreshToken) {
      return res.sendStatus(401);
    }

    addToBlacklist(accessToken);
    addToBlacklist(refreshToken);

    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("Error loggig out: ", err);
    res.status(500).send("Internal server error");
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  console.log(req);

  if (isTokenBlacklisted(req.headers.authorization)) {
    console.log("token is blacklisted");
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
  if (req.user) {
    console.log(req.user);
    const payload = {
      id: req.user.id,
      password: req.user.password,
    };
    const accessToken = generateSigninToken(payload);
    return res.status(200).send({
      success: true,
      user: {
        id: req.user.id,
      },
      accessToken: accessToken,
    });
  } else {
    console.log("token is expired");
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
});

// Return user if token is verified
const verifyToken = asyncHandler(async (req, res, next) => {
  console.log(req);

  if (isTokenBlacklisted(req.headers.authorization)) {
    console.log("token is blacklisted");
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
  if (req.user) {
    // next()
    return res.status(200).send({
      success: true,
      user: {
        id: req.user.id,
      },
      newAccessToken: req.newAccessToken,
    });
  } else {
    console.log("token is expired");
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
});

const auth = {
  signup,
  signin,
  logout,
  refreshToken,
  verifyToken,
};

module.exports = auth;
