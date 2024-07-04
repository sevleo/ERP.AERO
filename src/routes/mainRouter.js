const express = require("express");
const navigation = require("../controllers/navigation");
const auth = require("../controllers/auth");
const passport = require("passport");
const displayData = require("../controllers/displayData");
const multer = require("multer");
const {
  uploadFile,
  listFiles,
  deleteFile,
  getFile,
  downloadFile,
  updateFile,
} = require("../controllers/file");
const authenticateWithRefresh = require("../helpers/authenticateWithRefreshToken");

const router = express.Router();

// Page views
router.get("/", navigation.home);
router.get("/signup", navigation.signup);

// Auth API
router.post("/signup", auth.signup);
router.post("/signin", auth.signin);
router.post("/logout", auth.logout);

// Bearer tokens API
router.get(
  "/signin/new_token",
  passport.authenticate("jwt", { session: false }),
  auth.refreshToken
);

// Verify token and get user if token is valid
router.get(
  "/verify-token",
  authenticateWithRefresh,
  // passport.authenticate("jwt", { session: false }),
  auth.verifyToken
);

// Services
router.get(
  "/info",
  // passport.authenticate("jwt", { session: false }),
  authenticateWithRefresh,
  displayData.info
);

router.get(
  "/latency",
  // passport.authenticate("jwt", { session: false }),
  authenticateWithRefresh,
  displayData.latency
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Files
router.post(
  "/file/upload",
  // passport.authenticate("jwt", { session: false }),
  authenticateWithRefresh,
  upload.single("file"),
  uploadFile
);
router.get(
  "/file/list",
  // passport.authenticate("jwt", { session: false }),
  authenticateWithRefresh,
  listFiles
);
router.delete(
  "/file/delete/:id",
  // passport.authenticate("jwt", { session: false }),
  authenticateWithRefresh,
  deleteFile
);
router.get(
  "/file/:id",
  // passport.authenticate("jwt", { session: false }),
  authenticateWithRefresh,
  getFile
);
router.get(
  "/file/download/:id",
  // passport.authenticate("jwt", { session: false }),
  authenticateWithRefresh,
  downloadFile
);
router.put(
  "/file/update/:id",
  // passport.authenticate("jwt", { session: false }),
  authenticateWithRefresh,
  upload.single("file"),
  updateFile
);

module.exports = router;
