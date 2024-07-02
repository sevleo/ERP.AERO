import express from "express";
import dotenv from "dotenv";
import "./db";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
