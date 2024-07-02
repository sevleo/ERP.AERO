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
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || password) {
        return res.status(400).send("Username and password are required.");
    }
    try {
        // Check if user already exists
        const [rows] = yield db_1.default
            .promise()
            .query("SELECT * FROM users WHERE username = ?", [username]);
        if (rows.length > 0) {
            return res.status(409).send("Username already exists.");
        }
        // Hash the password with bcrypt, 10 salt
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Insert new user into the database
        yield db_1.default
            .promise()
            .query("INSERT INTO users (username, password) VALUES (?, ?)", [
            username,
            hashedPassword,
        ]);
        res.status(201).send("User created successfully.");
    }
    catch (err) {
        console.error("Error signing up user:", err);
        res.status(500).send("Internal server error.");
    }
}));
exports.default = router;
