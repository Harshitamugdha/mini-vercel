import express from "express";
import passport from "passport";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/failed",
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/dashboard");
  }
);
router.get("/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Authentication Failed",
  });
});

router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      authenticated: false,
    });
  }

  res.json({
    authenticated: true,
    user: req.user,
  });
});


router.get(
  "/me",
  isAuthenticated,
  (req, res) => {
    res.json(req.user);
  }
);
export default router;