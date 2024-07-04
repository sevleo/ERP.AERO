"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateSigninToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateSigninToken = (payload) => {
    return jsonwebtoken_1.default.sign({ payload }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3s",
    });
};
exports.generateSigninToken = generateSigninToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign({ payload }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30m",
    });
};
exports.generateRefreshToken = generateRefreshToken;
