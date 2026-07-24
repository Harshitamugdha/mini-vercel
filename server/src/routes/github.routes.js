import express from "express";
import { getRepositories } from "../controllers/github.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/repos", isAuthenticated, getRepositories);

export default router;