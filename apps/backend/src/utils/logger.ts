import { GetTimestamp } from "@app/utils/date";

export enum LogType {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
}

const LogDebugMessages = false;

export function Log(msg: string, level = LogType.ERROR, subType?: string) {
    if (level === LogType.DEBUG && !LogDebugMessages) return;

    const logParts: string[] = [];
    logParts.push(`[${GetTimestamp()}]`);

    if (subType) logParts.push(`[${level} / ${subType}]`);
    else logParts.push(`[${level}]`);

    logParts.push(msg);

    let logFn = console.log;
    if (level === LogType.ERROR) logFn = console.error;

    logFn(logParts.join(" "));
}

export enum Log_SubType {
    AUTH = "Auth",
    OAUTH = "OAuth",
    PROJECT = "Project",
    MODERATION = "Moderation",
    USER = "User",
    VERSION = "Version",
    FS = "FS",
    IMAGE_PROCESSING = "ImageProcessing",
}
