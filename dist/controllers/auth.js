"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../db"));
const generateTokens_1 = require("../helpers/generateTokens");
const disableTokens_1 = require("../helpers/disableTokens");
const validator_1 = __importDefault(require("validator"));
const signup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required" });
    }
    if (!validator_1.default.isEmail(username) &&
        !validator_1.default.isMobilePhone(username, "any")) {
        return res.status(400).json({
            message: "Username must be either a valid email address or phone number.",
        });
    }
    try {
        // Check if user already exists
        const [rows] = yield db_1.default
            .promise()
            .query("SELECT * FROM users WHERE id = ?", [username]);
        if (rows.length > 0) {
            return res.status(409).json({ message: "Username already exists." });
        }
        // Hash the password with bcrypt, using 10 rounds of salt
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Generate user id
        // Insert new user into the database
        const insertQuery = "INSERT INTO users (id, password) VALUES (?, ?)";
        yield db_1.default.promise().query(insertQuery, [username, hashedPassword]);
        // For requesting bearer token by id & password
        const payload = {
            id: username,
            password: password,
        };
        // Generate tokens
        const accessToken = (0, generateTokens_1.generateSigninToken)(payload);
        const refreshToken = (0, generateTokens_1.generateRefreshToken)(payload);
        res.status(200).send({
            success: true,
            message: "User created successfully.",
            accessToken: accessToken,
            refreshToken: refreshToken,
            username: username,
        });
    }
    catch (err) {
        console.error("Error signing up:", err);
        res.status(500).send("Internal server error.");
    }
}));
const signin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required." });
    }
    try {
        // Check if user exists
        const [rows] = yield db_1.default
            .promise()
            .query("SELECT * FROM users WHERE id = ?", [username]);
        const user = rows[0];
        if (!user || !user.id) {
            return res.status(404).json({ message: "User not found." });
        }
        // Validate password
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password." });
        }
        const payload = {
            id: user.id,
            password: password,
        };
        // Generate tokens
        const accessToken = (0, generateTokens_1.generateSigninToken)(payload);
        const refreshToken = (0, generateTokens_1.generateRefreshToken)(payload);
        console.log(payload);
        res.status(200).send({
            success: true,
            message: "Logged in successfully",
            accessToken: accessToken,
            refreshToken: refreshToken,
            username: user.id,
        });
    }
    catch (err) {
        console.error("Error signing in:", err);
        res.status(500).send("Internal server error.");
    }
}));
const logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.body.accessToken;
        const refreshToken = req.body.refreshToken;
        if (!accessToken || !refreshToken) {
            return res.sendStatus(401);
        }
        (0, disableTokens_1.addToBlacklist)(accessToken);
        (0, disableTokens_1.addToBlacklist)(refreshToken);
        res.status(200).json({ message: "Logged out successfully." });
    }
    catch (err) {
        console.error("Error loggig out: ", err);
        res.status(500).send("Internal server error");
    }
}));
const refreshToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    if ((0, disableTokens_1.isTokenBlacklisted)(req.headers.authorization)) {
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
        const accessToken = (0, generateTokens_1.generateSigninToken)(payload);
        return res.status(200).send({
            success: true,
            user: {
                id: req.user.id,
            },
            accessToken: accessToken,
        });
    }
    else {
        console.log("token is expired");
        return res.status(401).send({
            success: false,
            message: "Unauthorized",
        });
    }
}));
// Return user if token is verified
const verifyToken = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    if ((0, disableTokens_1.isTokenBlacklisted)(req.headers.authorization)) {
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
    }
    else {
        console.log("token is expired");
        return res.status(401).send({
            success: false,
            message: "Unauthorized",
        });
    }
}));
const auth = {
    signup,
    signin,
    logout,
    refreshToken,
    verifyToken,
};
exports.default = auth;
