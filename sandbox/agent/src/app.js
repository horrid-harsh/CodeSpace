import express from "express";
import morgan from "morgan";
import fs from "fs";

const WORKING_DIR = "/workspace";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from sandbox agent!",
    status: "success",
  });
});

app.get("/list-files", async (req, res) => {
  try {
    const elements = await fs.promises.readdir(WORKING_DIR);
    res.status(200).json({
      message: "Elements in working directory",
      elements,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to list files",
      status: "error",
      error: err,
    });
  }
});

export default app;
