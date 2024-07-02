import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "./db";
import authRoutes from "./routes/auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
