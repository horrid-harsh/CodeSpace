import { Router } from "express";
import { createPod } from "../kubernetes/pod.js";
import { createService } from "../kubernetes/service.js";
import { createSandboxKey } from "../config/redis.js";
import { v7 as uuid } from "uuid";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import Project from "../models/project.model.js";

const router = Router();

router.post("/project", authenticateUser, async (req, res) => {
  const { title } = req.body;

  const project = new Project({
    user: req.user.id,
    title,
  });

  await project.save();

  if (!project) {
    return res.status(400).json({
      message: "Failed to create project",
      status: "error",
    });
  }

  return res.status(201).json({
    message: "Project created successfully",
    project,
  });
});

router.get("/projects", authenticateUser, async (req, res) => {
  const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });

  return res.status(200).json({
    message: "Projects fetched successfully",
    projects,
  });
});

router.post("/start", authenticateUser, async (req, res) => {
  const projectId = req.body.projectId;

  const project = await Project.findOne({
    user: req.user.id,
    _id: projectId,
  });

  if (!project) {
    return res.status(404).json({
      message: "Project not found or access denied",
      status: "error",
    });
  }

  const sandboxId = uuid();

  await Promise.all([
    createPod(sandboxId, projectId),
    createService(sandboxId),
    createSandboxKey(sandboxId),
  ]);

  return res.status(201).json({
    message: "Sandbox created successfully",
    sandboxId,
    previewUrl: `http://${sandboxId}.preview.localhost`,
  });
});

export default router;
