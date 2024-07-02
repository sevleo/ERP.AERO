import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "./db";
import authRoutes from "./routes/auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import bodyParser from "body-parser";
import path from "path";
import indexRouter from "./routes/index";

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/api", authRoutes);

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
