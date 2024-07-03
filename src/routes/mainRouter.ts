import express from "express";
import navigation from "../controllers/navigation";
import auth from "../controllers/auth";
import passport from "passport";

const router = express.Router();

// Pages
router.get("/", navigation.home);
router.get("/signup", navigation.signup);

// SignUp
router.post("/signup", auth.signup);

// SignIn
router.post("/signin", auth.signin);

// Refresh Token API
router.post("/signin/new_token", auth.refreshToken);

// Protected routes
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    if (req.user) {
      return res.status(200).send({
        success: true,
        user: {
          id: req.user.id,
          username: req.user.username,
        },
      });
    }
  }
);
router.get("/info", navigation.info);

export default router;
