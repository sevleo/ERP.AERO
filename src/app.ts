import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "./db";
import bodyParser from "body-parser";
import path from "path";
import mainRouter from "./routes/mainRouter";

const app = express();

// Body parser middleware - we need it to see body from the requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Enable public folder
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Declare routes
app.use("/", mainRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
