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
const calculateLatency_1 = require("../helpers/calculateLatency");
const disableTokens_1 = require("../helpers/disableTokens");
const info = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("display data info");
    console.log(req);
    console.log((0, disableTokens_1.isTokenBlacklisted)(req.headers.authorization));
    if ((0, disableTokens_1.isTokenBlacklisted)(req.headers.authorization)) {
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
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Internal server error.");
        }
    }
    else {
        console.log("not logged in");
        res.status(500).send("Internal server error");
    }
}));
const latency = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("display latency info");
    console.log(req.headers.authorization);
    console.log((0, disableTokens_1.isTokenBlacklisted)(req.headers.authorization));
    if ((0, disableTokens_1.isTokenBlacklisted)(req.headers.authorization)) {
        res.status(401).send("token is blacklisted");
    }
    const latency = (0, calculateLatency_1.calculateLatency)();
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
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Internal server error");
        }
    }
    else {
        console.log("not logged in");
    }
}));
const displayData = {
    info,
    latency,
};
exports.default = displayData;
