"use strict";
// This middleware issues allows entering by refreshToken and sends new access token to the client
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
exports.authenticateWithRefresh = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const disableTokens_1 = require("./disableTokens");
const generateTokens_1 = require("./generateTokens");
const authenticateWithRefresh = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Attempt to authenticate using passport
    passport_1.default.authenticate("jwt", { session: false }, (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(err);
        console.log(user);
        console.log(info);
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!refreshTokenSecret) {
            return res.status(500).json({ message: "Server configuration error" });
        }
        if (info && info.name === "tokenExpiredError")
            return next();
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
        if ((0, disableTokens_1.isTokenBlacklisted)(refreshToken)) {
            return res.status(401).send("token is blacklisted");
        }
        try {
            // Verify refresh token
            const decoded = yield new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
                    if (err)
                        return reject(err);
                    resolve(decoded);
                });
            });
            console.log(decoded);
            const payload = {
                id: decoded.payload.id,
                password: decoded.payload.password,
            };
            const newAccessToken = (0, generateTokens_1.generateSigninToken)(payload);
            console.log(payload);
            res.setHeader("authorization", newAccessToken);
            req.user = {
                id: decoded.payload.id,
                password: decoded.payload.password,
            };
            req.newAccessToken = newAccessToken;
            next();
        }
        catch (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    }))(req, res, next);
});
exports.authenticateWithRefresh = authenticateWithRefresh;
