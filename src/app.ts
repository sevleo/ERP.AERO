import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "./db";
import "./models/user";
import bodyParser from "body-parser";
import path from "path";
import mainRouter from "./routes/mainRouter";

import passport from "passport";
import cors from "cors";

const app = express();

app.use((req: any, res: any, next) => {
  res.locals.currentUser = req.user;
  console.log(res.locals);
  next();
});

app.use(passport.initialize());

import "./helpers/passportInitializer";

// Body parser middleware - we need it to see body from the requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Enable public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware for token verification

// Declare routes
app.use("/", mainRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
