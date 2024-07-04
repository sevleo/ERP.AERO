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

const corsOptions = {
  origin: "*", // Allow any origin
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(cors(corsOptions));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("app listening on port 3001!"));

// app.listen(PORT as any, "0.0.0.0", () => {
//   console.log(`Server is running on http://0.0.0.0:${PORT}`);
// });
