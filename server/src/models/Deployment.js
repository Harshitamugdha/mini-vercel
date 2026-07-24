import mongoose from "mongoose";

const stageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      enum: ["github", "actions", "s3", "cloudfront"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "running", "success", "failed", "skipped"],
      default: "pending",
    },

    startedAt: Date,
    endedAt: Date,

    logs: {
      type: String,
      default: "",
    },

    url: String,
  },
  {
    _id: false,
  }
);

const deploymentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    commitSha: {
      type: String,
      default: "",
    },

    commitMessage: {
      type: String,
      default: "",
    },

    branch: String,

    triggeredBy: {
      type: String,
      enum: ["push", "manual", "retry"],
      default: "manual",
    },

    stages: {
      type: [stageSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Deployment", deploymentSchema);