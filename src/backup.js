import { CONFIG } from "./config.js";
import fs from "fs";
import path from "path";
import { spawn } from "bun";
import { createClient } from "webdav";

const MONGODUMP_PATH = "C:\\Users\\LenovoYoga\\mongoUtils\\mongodump.exe";
 
function getBackupFileName() {
  const now = new Date();
  const week = getWeekNumber(now);
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  return `${week}-${month}-${year}-mongo-backup.tar.gz`;
}

function getWeekNumber(date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
}

async function runCommand(cmd, args, options = {}) {
    const process = spawn({
        cmd: [cmd, ...args],
        stdout: "pipe",
        stderr: "pipe",
        ...options,
    });

    (async () => {
    for await (const chunk of process.stdout) {
      console.write(chunk); 
    }
    })();

    (async () => {
    for await (const chunk of process.stderr) {
      console.error(new TextDecoder().decode(chunk));
    }
    })();

    const exitCode = await process.exited;

    if (exitCode !== 0) {
        throw new Error(
        `${cmd} exited with code ${exitCode}.`
        );
    }
}

async function mongodumpBackup() {
  console.log("Starting mongodump...");

  if (fs.existsSync(CONFIG.tempDir)) {
    fs.rmSync(CONFIG.tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(CONFIG.tempDir, { recursive: true });

  const args = [`--uri=${CONFIG.mongoUri}`, `--out=${path.join(CONFIG.tempDir, "dump")}`];

  await runCommand(MONGODUMP_PATH, args);

  console.log("Mongodump completed.");
}

async function compressBackup(backupFileName) {
  console.log("Compressing Backup...");

  const tarFilePath = path.join(CONFIG.tempDir, backupFileName);

  await runCommand("tar", ["-czf", tarFilePath, "-C", CONFIG.tempDir, "dump"]);

  console.log("Compression completed.");

  return tarFilePath;
}

async function uploadToNextcloud(tarFilePath, backupFileName) {
  console.log("Uploading backup to Nextcloud...");
  console.log(CONFIG.nextcloud.username,  "    ", CONFIG.nextcloud.password)
  const client = createClient(CONFIG.nextcloud.url, {
    username: CONFIG.nextcloud.username,
    password: CONFIG.nextcloud.password,
  });

  const remotePath = path.posix.join(CONFIG.nextcloud.backupPath, backupFileName);
  const fileBuffer = fs.readFileSync(tarFilePath);

  await client.putFileContents(remotePath, fileBuffer, { overwrite: true });

  console.log("Upload completed.");
}

async function cleanup() {
  console.log("Cleaning up temporary files...");
  if (fs.existsSync(CONFIG.tempDir)) {
    fs.rmSync(CONFIG.tempDir, { recursive: true, force: true });
  }
  console.log("Cleaning done.");
}

async function main() {
  try {
    const backupFileName = getBackupFileName();
    await mongodumpBackup();
    const tarFilePath = await compressBackup(backupFileName);
    await uploadToNextcloud(tarFilePath, backupFileName);
    await cleanup();
    console.log("Backup process completed successfully.");
  } catch (err) {
    console.error("Backup process failed:", err);
    process.exit(1);
  }
}

main();
