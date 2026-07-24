import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  createProject,
  getProjects,
  deleteProject,
  redeployProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, createProject);

router.get("/", isAuthenticated, getProjects);

router.delete("/:id", isAuthenticated, deleteProject);

router.post(
  "/:id/redeploy",
  isAuthenticated,
  redeployProject
);
export default router;