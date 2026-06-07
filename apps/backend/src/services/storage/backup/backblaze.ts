import { type BunFile, S3Client, type S3File } from "bun";
import env from "~/utils/env";
import { LogWithTimestamp } from "../utils";

const b2_client = new S3Client({
    bucket: "crmm-project-files",
    endpoint: "https://s3.eu-central-003.backblazeb2.com",
    region: "eu-central-003",
    accessKeyId: env.BACKBLAZE_BACKUP_API_KEY_ID,
    secretAccessKey: env.BACKBLAZE_BACKUP_API_KEY,
});

export async function BackupToBackblaze(backupFile: BunFile, fileName: string) {
    // Using two references of the backup file so that the older one can be deleted
    // only after the newer backup is successfully uploaded
    const backup_ref = b2_client.file(fileName);
    const alt_backup_ref = b2_client.file(AltFileName(fileName));

    if (await backup_ref.exists()) {
        await UploadBackupFile(backupFile, alt_backup_ref);
        await backup_ref.delete();
        return;
    }

    await UploadBackupFile(backupFile, backup_ref);
    await alt_backup_ref.delete();
    return;
}

async function UploadBackupFile(file: BunFile, s3_ref: S3File) {
    const chunkSize = 10 * 1024 * 1024; // 10MB

    const writer = s3_ref.writer({
        retry: 3,
        queueSize: 10,
        partSize: chunkSize,
    });

    const stream = file.stream();
    const reader = stream.getReader();

    LogWithTimestamp(`Uploading backup file to backblaze. Ref: ${s3_ref.name}`);
    while (true) {
        const _res = await reader.read();
        if (_res.done) break;

        writer.write(_res.value);
    }

    await reader.cancel();
    await writer.end();
    LogWithTimestamp(`Backup file uploaded to backblaze. ${s3_ref.name} ${file.size} bytes`);
}

function AltFileName(fileName: string) {
    const parts = fileName.split(".");
    return `${parts[0]}_alt.${parts[1]}`;
}
