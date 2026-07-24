// ─── Pipeline Webhook Routes (Phase 3 Protocol) ──────────────────────────────
// POST /webhooks/pipeline-stage
// Accepts GitHub Actions / deployment agent stage progress events.
// Validates deploy token, updates matching PipelineStage subdocument,
// and derives new overallStatus automatically.

import express from "express";
import Deployment from "../models/Deployment.js";
import Project from "../models/Project.js";

const router = express.Router();

router.post("/pipeline-stage", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing deploy token" });
    }

    const token = authHeader.split(" ")[1];
    const { deploymentId, stage, status, timestamp, logs, url } = req.body;

    if (!deploymentId || !stage || !status) {
      return res.status(400).json({ success: false, message: "Missing required fields: deploymentId, stage, status" });
    }

    const deployment = await Deployment.findById(deploymentId);
    if (!deployment) {
      return res.status(404).json({ success: false, message: "Deployment not found" });
    }

    const project = await Project.findById(deployment.projectId);
    if (!project || project.deployToken !== token) {
      return res.status(403).json({ success: false, message: "Forbidden: Invalid deploy token" });
    }

    // Update corresponding stage
    const targetStage = deployment.stages.find((s) => s.id === stage);
    if (targetStage) {
      targetStage.status = status;
      if (status === "running" && !targetStage.startedAt) {
        targetStage.startedAt = timestamp ? new Date(timestamp) : new Date();
      }
      if (status === "success" || status === "failed" || status === "skipped") {
        targetStage.endedAt = timestamp ? new Date(timestamp) : new Date();
      }
      if (logs) targetStage.logs = logs;
      if (url) targetStage.url = url;
    }

    await deployment.save();

    res.json({
      success: true,
      deployment: {
        id: deployment._id,
        projectId: deployment.projectId,
        overallStatus: deployment.overallStatus, // Derived getter
        stages: deployment.stages,
      },
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
