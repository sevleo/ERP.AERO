require("dotenv").config();
const express = require("express");
require("./db");
require("./models/user");
const bodyParser = require("body-parser");
const path = require("path");
const mainRouter = require("./routes/mainRouter");

const passport = require("passport");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: [
    "https://erp-aero.netlify.app/",
    "https://erp-aero2.adaptable.app/",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(passport.initialize());

require("./helpers/passportInitializer");

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("app listening on port 3000!"));
