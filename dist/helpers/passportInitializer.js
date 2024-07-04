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
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const db_1 = __importDefault(require("../db"));
const opts = {
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromHeader("authorization"),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};
passport_1.default.use(new passport_jwt_1.Strategy(opts, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(jwt_payload);
    try {
        const userId = jwt_payload.payload.id;
        // Query user from the database
        const [rows] = yield db_1.default
            .promise()
            .query("SELECT * FROM users WHERE id = ?", [userId]);
        if (rows.length > 0) {
            console.log(rows[0]);
            return done(null, rows[0]);
        }
        else {
            return done(null, false);
        }
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return done(error, false);
    }
})));
