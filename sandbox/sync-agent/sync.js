import "dotenv/config";
import chokidar from "chokidar";
import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const projectId = process.env.PROJECT_ID;
const bucketName = "cohort2-codespace-bucket";
const localDirectory = "/workspace";

const ignoreList = [
  /(^|[\/\\])\../, // ignore dotfiles
  /node_modules/,
  /\.git/,
  /\.env/,
  /dist/,
  /build/,
  /coverage/,
  /\.DS_Store/,
];

function shouldIgnore(filePath) {
  return ignoreList.some((regex) => regex.test(filePath));
}

async function checkS3ForFiles() {
  console.log(`Checking S3 for existing files in project: ${projectId}`);
  const listCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: `${projectId}/`,
  });
  const listResponse = await s3Client.send(listCommand);
  return listResponse.Contents || [];
}

async function downloadFilesFromS3(s3Objects) {
  console.log("Found existing files in S3. Syncing to local directory...");
  for (const file of s3Objects) {
    // Skip if it is a directory placeholder
    if (file.Key.endsWith("/")) continue;

    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: file.Key,
    });
    const getResponse = await s3Client.send(getCommand);

    const relativePath = file.Key.replace(`${projectId}/`, "");
    const localFilePath = path.join(localDirectory, relativePath);

    // Ensure the local directory structure exists
    fs.mkdirSync(path.dirname(localFilePath), { recursive: true });

    const writeStream = fs.createWriteStream(localFilePath);
    getResponse.Body.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log(`Downloaded ${file.Key} to ${localFilePath}`);
  }
}

async function syncFileToS3(filePath) {
  try {
    const relativePath = path.relative(localDirectory, filePath);
    const s3Key = `${projectId}/${relativePath}`;

    // If file was deleted locally, delete from S3
    if (!fs.existsSync(filePath)) {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
      });
      await s3Client.send(command);
      console.log(`Deleted s3://${bucketName}/${s3Key} (local file removed)`);
      return;
    }

    // Skip directories
    if (fs.statSync(filePath).isDirectory()) {
      return;
    }

    const fileContent = fs.readFileSync(filePath);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: fileContent,
    });

    await s3Client.send(command);
    console.log(`Successfully synced ${filePath} to s3://${bucketName}/${s3Key}`);
  } catch (err) {
    console.error(`Error syncing ${filePath} to S3:`, err);
  }
}

function startWatcher(hasFiles) {
  console.log("Starting chokidar watch...");
  chokidar
    .watch(localDirectory, {
      ignored: ignoreList,
      persistent: true,
      ignoreInitial: hasFiles, // if S3 is empty (hasFiles is false), upload all existing local files
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
      }
    })
    .on("all", async (event, filePath) => {
      if (shouldIgnore(filePath)) return;

      if (event === "add" || event === "change" || event === "unlink") {
        await syncFileToS3(filePath);
      }
    });
}

async function init() {
  try {
    const s3Objects = await checkS3ForFiles();
    const hasFiles = s3Objects.length > 0;

    if (hasFiles) {
      await downloadFilesFromS3(s3Objects);
    } else {
      console.log(
        "No files found in S3. Local files will be synced to S3 automatically.",
      );
    }

    startWatcher(hasFiles);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

init();
