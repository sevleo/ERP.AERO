"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenBlacklisted = exports.addToBlacklist = void 0;
let tokenBlacklist = [];
const addToBlacklist = (token) => {
    tokenBlacklist.push(token);
};
exports.addToBlacklist = addToBlacklist;
const isTokenBlacklisted = (token) => {
    return tokenBlacklist.includes(token);
};
exports.isTokenBlacklisted = isTokenBlacklisted;
