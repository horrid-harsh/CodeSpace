import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from 'path';

const WORKING_DIR = "/workspace";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from sandbox agent!",
    status: "success",
  });
});

/**
 * @route GET /list-files
 * @description Lists all files in the working directory and its subdirectories. Returns a JSON object with the file paths relative to the working directory. exclude directories like node_modules, .git,dist, etc.
 * - eg. {
 *     "files": [
 *         "file1.txt",
 *         "src/file2.txt",
 *         "src/subdir/file3.txt"
 *     ]
 * }
 */
app.get("/list-files", async (req, res) => {
  const listFiles = async (dir, baseDir) => {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);

      // Exclude certain directories
      if (
        entry.isDirectory() &&
        ["node_modules", ".git", "dist"].includes(entry.name)
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        files.push(...(await listFiles(fullPath, baseDir)));
      } else {
        files.push(relativePath);
      }
    }
    return files;
  };

  try {
    const files = await listFiles(WORKING_DIR, WORKING_DIR);
    res.status(200).json({
      message: "Files listed successfully",
      files,
    });
  } catch (err) {
    res.status(500).json({
      message: `Error listing files: ${err.message}`,
      status: "error",
    });
  }
});

/**
 * @route GET /read-files
 * @description Reads the content of all files requested in the query parameter 'files' and returns their content as a JSON object.
 * - eg. /read-files?files=file1.txt,/src/file2.txt
 */
app.get("/read-files", async (req, res) => {

  const files = req.query.files;

  if(!files) {
    return res.status(400).json({
      message: "No files specified in query parameter",
      status: "error",
    });
  }

  const fileList = files.split(',');

  const results = await Promise.all(fileList.map(async (file) => {
    const filePath = path.join(WORKING_DIR, file);

    try {
      const content = await fs.promises.readFile(filePath, "utf-8");
      return { [ filePath.replace(WORKING_DIR, '') ]: content };
    } catch (err) {
      return { [ filePath.replace(WORKING_DIR, '') ]: `Error reading file: ${err.message}` };
    }
  }));

  return res.status(200).json({
    message: "Files contents",
    files: results,
  });
});

/**
 * @route PATCH /update-files
 * @description Updates the content of files specified in the request body. The request body should container a property 'updates' with a JSON Array of object, each object should have a 'file' property specifying the file path (relative to the working directory) and a 'content' property specifying the new content for the file.
 */
app.patch("/update-files", async (req, res) => {
  const updates = req.body.updates;

  if (!updates || !Array.isArray(updates)) {
    return res.status(400).json({
        message: 'Invalid request body. Expected a JSON object with an "updates" property containing an array of file updates.',
        status: 'error',
    });
  }

  const results = await Promise.all(updates.map(async (update) => {
    const { file, content } = update;
    const filePath = path.join(WORKING_DIR, file);

    try {
      console.log(path.dirname(filePath), filePath);

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, content, "utf-8");
      return { [ filePath ]: "File updated successfully" };
    } catch (err) {
      return { [ filePath ]: `Error updating file: ${err.message}` };
    }
  }));

  return res.status(200).json({
    message: "Files update results",
    results,
  });
});

/**
 * @route POST /create-files
 * @description Creates new files with the content specified in the request body. The request body should contain a property 'files' with a JSON Array of objects, each object should have a 'file' property specifying the file path (relative to the working directory) and a 'content' property specifying the content for the new file.
 */
app.post("/create-files", async (req, res) => {
  const files = req.body.files;

  if (!files || !Array.isArray(files)) {
    return res.status(400).json({
      message: 'Invalid request body. Expected a JSON object with a "files" property containing an array of file objects.',
      status: 'error',
    });
  }

  const results = await Promise.all(files.map(async (fileObj) => {
    const { file, content } = fileObj;
    const filePath = path.join(WORKING_DIR, file);

    try {
      console.log(path.dirname(filePath), filePath);

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, content, "utf-8");
      return { [ filePath ]: "File created successfully" };
    } catch (err) {
      return { [ filePath ]: `Error creating file: ${err.message}` };
    }
  }));

  return res.status(200).json({
    message: "Files creation results",
    results,
  });
});

/**
 * @route DELETE /delete-files
 * @description Deletes files or folders specified in the request body. The request body should contain a property 'files' with a JSON Array of paths (relative to the working directory) to be deleted recursively.
 */
app.delete("/delete-files", async (req, res) => {
  const files = req.body.files;

  if (!files || !Array.isArray(files)) {
    return res.status(400).json({
      message: 'Invalid request body. Expected a JSON object with a "files" property containing an array of paths.',
      status: 'error',
    });
  }

  const PROTECTED_PATHS = [
    "package.json",
    "package-lock.json",
    "vite.config.js",
    "node_modules",
    ".gitignore"
  ];

  const results = await Promise.all(files.map(async (file) => {
    const filePath = path.join(WORKING_DIR, file);

    // Prevent directory traversal attacks (e.g., ../../../etc/passwd)
    const relative = path.relative(WORKING_DIR, filePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      return { [ file ]: "Error: Access denied (path traversal prevented)" };
    }

    // Normalize slashes for matching
    const normalizedRelative = relative.replace(/\\/g, '/');

    // Block deleting the workspace root itself
    if (normalizedRelative === "" || normalizedRelative === ".") {
      return { [ file ]: "Error: Cannot delete the workspace root directory." };
    }

    // Check if the path matches or is nested inside any protected paths
    const isProtected = PROTECTED_PATHS.some(protectedPath => {
      return normalizedRelative === protectedPath || normalizedRelative.startsWith(protectedPath + '/');
    });

    if (isProtected) {
      return { [ file ]: "Error: Path is protected and cannot be deleted." };
    }


    try {
      await fs.promises.access(filePath);
    } catch {
      return { [ file ]: "Error: File or directory does not exist." };
    }

    try {
      await fs.promises.rm(filePath, { recursive: true, force: true });
      return { [ file ]: "Deleted successfully" };
    } catch (err) {
      return { [ file ]: `Error deleting: ${err.message}` };
    }
  }));

  return res.status(200).json({
    message: "Files deletion results",
    results,
  });
});

export default app;
