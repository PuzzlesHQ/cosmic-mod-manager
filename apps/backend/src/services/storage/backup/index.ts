import path from "node:path/posix";
import { $ } from "bun";
import { LOCAL_BASE_STORAGE_PATH, LogWithTimestamp } from "../utils";
import { BackupToBackblaze } from "./backblaze";

const FILES_BACKUP_NAME = "files_backup.zip";
const DB_BACKUP_NAME = "db_backup.sql";

const filesDir = path.resolve(LOCAL_BASE_STORAGE_PATH);
const zipPath = path.resolve(LOCAL_BASE_STORAGE_PATH, FILES_BACKUP_NAME);
const dbBackupPath = path.resolve(LOCAL_BASE_STORAGE_PATH, DB_BACKUP_NAME);

export async function BackupLocalData() {
    await RemoveOldBackupFiles();

    LogWithTimestamp("Starting project files backup...");
    const projectFilesBackupZip = await CreateProjectFilesBackupZip();
    await BackupToBackblaze(projectFilesBackupZip, FILES_BACKUP_NAME);
    LogWithTimestamp("Project files backup completed successfully!");

    LogWithTimestamp("Starting db backup...");
    const dbBackup = await CreateDbBackupZip();
    await BackupToBackblaze(dbBackup, DB_BACKUP_NAME);
    LogWithTimestamp("DB backup completed successfully!");
}
await BackupLocalData();

async function CreateDbBackupZip() {
    await $`pg_dump -U postgres -p 5432 crmm_prod > ${dbBackupPath}`;
    return Bun.file(dbBackupPath);
}

async function CreateProjectFilesBackupZip() {
    await $`zip -r ${zipPath} ${filesDir}`;
    return Bun.file(zipPath);
}

async function RemoveOldBackupFiles() {
    // Delete the previous backup files to prevent it from being included in the new backup
    await $`rm -f ${zipPath} && rm -f ${dbBackupPath}`;
}
