import express from "express";
import navigation from "../controllers/navigation";
import auth from "../controllers/auth";
import passport from "passport";
import displayData from "../controllers/displayData";
import multer from "multer";
import {
  uploadFile,
  listFiles,
  deleteFile,
  getFile,
} from "../controllers/file";

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
  passport.authenticate("jwt", { session: false }),
  auth.verifyToken
);

// Services
router.get(
  "/info",
  passport.authenticate("jwt", { session: false }),
  displayData.info
);

router.get(
  "/latency",
  passport.authenticate("jwt", { session: false }),
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

// upload.single("file");

// Files
router.post(
  "/file/upload",
  // passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  uploadFile
);
router.get(
  "/file/list",
  passport.authenticate("jwt", { session: false }),
  listFiles
);
router.delete(
  "/file/delete/:id",
  passport.authenticate("jwt", { session: false }),
  deleteFile
);
router.get(
  "/file/:id",
  passport.authenticate("jwt", { session: false }),
  getFile
);
router.get("/file/download/:id");
router.put("/file/update/:id");

export default router;
