"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
require("./db");
require("./models/user");
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const mainRouter_1 = __importDefault(require("./routes/mainRouter"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// app.use((req: any, res: any, next) => {
//   res.locals.currentUser = req.user;
//   console.log(res.locals);
//   next();
// });
app.use(passport_1.default.initialize());
require("./helpers/passportInitializer");
// Body parser middleware - we need it to see body from the requests
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Enable public folder
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, cors_1.default)());
// View engine setup
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
// Middleware for token verification
// Declare routes
app.use("/", mainRouter_1.default);
const PORT = process.env.PORT;
console.log(PORT);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
