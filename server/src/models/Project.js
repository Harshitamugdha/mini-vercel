import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    repoOwner: {
      type: String,
      required: true,
    },

    repoName: {
      type: String,
      required: true,
    },

    githubRepoId: {
      type: Number,
      required: true,
    },

    branch: {
      type: String,
      default: "main",
    },

    framework: {
      type: String,
      default: "",
    },

    buildCommand: String,

    outputDirectory: String,

    latestDeployment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deployment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);