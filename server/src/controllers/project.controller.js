import Project from "../models/Project.js";
import Deployment from "../models/Deployment.js";
import createDefaultStages from "../utils/createDefaultStages.js";

export const createProject = async (req, res) => {
  try {
    const {
      githubRepoId,
      repoOwner,
      repoName,
      branch,
      framework,
      buildCommand,
      outputDirectory,
    } = req.body;

    const existing = await Project.findOne({
      user: req.user._id,
      githubRepoId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Repository already imported",
      });
    }

    // Create project
    const project = await Project.create({
      user: req.user._id,
      githubRepoId,
      repoOwner,
      repoName,
      branch,
      framework,
      buildCommand,
      outputDirectory,
    });

    // Create first deployment
    const deployment = await Deployment.create({
      project: project._id,
      branch,
      triggeredBy: "manual",
      stages: createDefaultStages(),
    });

    // Link deployment
    project.latestDeployment = deployment._id;

    await project.save();

    res.status(201).json({
      success: true,
      project,
      deployment,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const dbProjects = await Project.find({
      user: req.user._id,
    })
      .populate("latestDeployment")
      .sort({
        createdAt: -1,
      });

    const projects = dbProjects.map((project) => ({
      id: project._id.toString(),

      name: project.repoName,
      repoOwner: project.repoOwner,
      repoName: project.repoName,
      branch: project.branch,
      framework: project.framework,

      subdomain: `${project.repoName.toLowerCase()}.mini-vercel.dev`,

      latestDeploymentId:
        project.latestDeployment?._id?.toString() ?? null,

      latestDeployment: project.latestDeployment
        ? {
            id: project.latestDeployment._id.toString(),

            branch: project.latestDeployment.branch,

            createdAt: project.latestDeployment.createdAt,

            overallStatus: "queued", // We'll compute this later

            stages: project.latestDeployment.stages,

            commitSha: project.latestDeployment.commitSha || "",

            commitMessage:
              project.latestDeployment.commitMessage || "",
          }
        : null,

      deployments: [],

      updatedAt: project.updatedAt,
    }));

    res.json({
      success: true,
      projects,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Delete all deployments
    await Deployment.deleteMany({
      project: project._id,
    });

    // Delete project
    await project.deleteOne();

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};
export const redeployProject = async (req, res) => {
    const project = await Project.findOne({
    _id: req.params.id,
    user: req.user._id,
});

if (!project) {
    return res.status(404).json({
        success: false,
        message: "Project not found",
    });
}
const deployment = await Deployment.create({
    project: project._id,

    branch: project.branch,

    triggeredBy: "retry",

    stages: createDefaultStages(),
});
project.latestDeployment = deployment._id;
console.log({
  githubRepoId: project.githubRepoId,
  repoName: project.repoName,
  latestDeployment: project.latestDeployment,
});

await project.save();
res.json({
    success: true,
    deployment,
});
};