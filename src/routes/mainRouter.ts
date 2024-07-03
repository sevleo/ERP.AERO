import express from "express";
import navigation from "../controllers/navigation";
import auth from "../controllers/auth";
import passport from "passport";
import displayData from "../controllers/displayData";
import { calculateLatency } from "../helpers/calculateLatency";

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

// Files

export default router;
