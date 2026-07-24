import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import githubRoutes from "./routes/github.routes.js";
import "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import projectRoutes from "./routes/project.routes.js";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mini-vercel-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/github", githubRoutes);
app.use("/auth", authRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/projects", projectRoutes);
app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Mini Vercel API running 🚀",
  });
});

export default app;