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
    failureRedirect: `${process.env.FRONTEND_URL}/`,
    session: true,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
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
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid");

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
});
export default router;