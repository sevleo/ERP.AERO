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
  origin: ["https://erp-aero.netlify.app/", "https://erp-aero2.adaptable.app/"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(passport.initialize());

import "./helpers/passportInitializer";

// Body parser middleware - we need it to see body from the requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Enable public folder
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware for token verification

// Declare routes
app.use("/", mainRouter);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("app listening on port 3000!"));
