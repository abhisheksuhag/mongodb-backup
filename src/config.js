import { config as loadEnv } from 'dotenv';
import path from 'node:path';

loadEnv();

const requiredVars = [
    'MONGO_URI',
    'NEXTCLOUD_URL',
    'NEXTCLOUD_USERNAME',
    'NEXTCLOUD_PASSWORD',
    'NEXTCLOUD_BACKUP_PATH',
    'TEMP_DIR',
    'LOG_DIR',
];

for(const key of requiredVars){
    if(!process.env[key]){
        throw new Error(`Missing required env variable: ${key}`);
    }
}


export const CONFIG = {
    mongoUri: process.env.MONGO_URI,
    nextcloud: {
        url: process.env.NEXTCLOUD_URL,
        username: process.env.NEXTCLOUD_USERNAME,
        password: process.env.NEXTCLOUD_PASSWORD,
        backupPath: process.env.NEXTCLOUD_BACKUP_PATH,
    },
    tempDir: path.resolve(process.env.TEMP_DIR),
    logDir: path.resolve(process.env.LOG_DIR),
    retentionDays: Number(process.env.BACKUP_RETENTION_DAYS) || 1825,
}