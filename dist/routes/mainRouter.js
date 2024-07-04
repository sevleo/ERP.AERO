"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const navigation_1 = __importDefault(require("../controllers/navigation"));
const auth_1 = __importDefault(require("../controllers/auth"));
const passport_1 = __importDefault(require("passport"));
const displayData_1 = __importDefault(require("../controllers/displayData"));
const multer_1 = __importDefault(require("multer"));
const file_1 = require("../controllers/file");
const authenticateWithRefreshToken_1 = require("../helpers/authenticateWithRefreshToken");
const router = express_1.default.Router();
// Page views
router.get("/", navigation_1.default.home);
router.get("/signup", navigation_1.default.signup);
// Auth API
router.post("/signup", auth_1.default.signup);
router.post("/signin", auth_1.default.signin);
router.post("/logout", auth_1.default.logout);
// Bearer tokens API
router.get("/signin/new_token", passport_1.default.authenticate("jwt", { session: false }), auth_1.default.refreshToken);
// Verify token and get user if token is valid
router.get("/verify-token", authenticateWithRefreshToken_1.authenticateWithRefresh, 
// passport.authenticate("jwt", { session: false }),
auth_1.default.verifyToken);
// Services
router.get("/info", 
// passport.authenticate("jwt", { session: false }),
authenticateWithRefreshToken_1.authenticateWithRefresh, displayData_1.default.info);
router.get("/latency", 
// passport.authenticate("jwt", { session: false }),
authenticateWithRefreshToken_1.authenticateWithRefresh, displayData_1.default.latency);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
// Files
router.post("/file/upload", 
// passport.authenticate("jwt", { session: false }),
authenticateWithRefreshToken_1.authenticateWithRefresh, upload.single("file"), file_1.uploadFile);
router.get("/file/list", 
// passport.authenticate("jwt", { session: false }),
authenticateWithRefreshToken_1.authenticateWithRefresh, file_1.listFiles);
router.delete("/file/delete/:id", 
// passport.authenticate("jwt", { session: false }),
authenticateWithRefreshToken_1.authenticateWithRefresh, file_1.deleteFile);
router.get("/file/:id", 
// passport.authenticate("jwt", { session: false }),
authenticateWithRefreshToken_1.authenticateWithRefresh, file_1.getFile);
router.get("/file/download/:id", 
// passport.authenticate("jwt", { session: false }),
authenticateWithRefreshToken_1.authenticateWithRefresh, file_1.downloadFile);
router.put("/file/update/:id", 
// passport.authenticate("jwt", { session: false }),
authenticateWithRefreshToken_1.authenticateWithRefresh, upload.single("file"), file_1.updateFile);
exports.default = router;
