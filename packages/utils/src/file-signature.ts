import type { BunFile } from "bun";
import { FileType } from "~/types";
import { trimWhitespaces } from "./string";

const strCharsPerByte = 2;
const magicNumberLen = 32;

interface Signature {
    offset: number;
    signature: string;
}

interface FileSignatureListItem {
    signature: Signature[];
    types: FileType[];
}

const fileTypeSignaturesList: FileSignatureListItem[] = [
    // .jar, .zip (octet-stream)
    {
        signature: [{ offset: 0, signature: "50 4B 03 04" }],
        types: [FileType.JAR, FileType.ZIP],
    },
    {
        signature: [{ offset: 0, signature: "50 4B 05 06" }],
        types: [FileType.JAR, FileType.ZIP],
    },
    {
        signature: [{ offset: 0, signature: "50 4B 07 08" }],
        types: [FileType.JAR, FileType.ZIP],
    },
    {
        signature: [{ offset: 0, signature: "50 4B 53 70" }],
        types: [FileType.JAR, FileType.ZIP],
    },

    // .7z
    {
        signature: [{ offset: 0, signature: "37 7A BC AF 27 1C" }],
        types: [FileType.SEVEN_Z],
    },

    // .gz
    {
        signature: [{ offset: 0, signature: "1F 8B" }],
        types: [FileType.GZ],
    },

    // .tar
    {
        signature: [{ offset: 0, signature: "75 73 74 61 72 00 30 30" }],
        types: [FileType.TAR],
    },
    {
        signature: [{ offset: 0, signature: "75 73 74 61 72 20 20 00" }],
        types: [FileType.TAR],
    },

    // .png
    {
        signature: [{ offset: 0, signature: "89 50 4E 47 0D 0A 1A 0A" }],
        types: [FileType.PNG],
    },

    // .webp
    {
        signature: [
            { offset: 0, signature: "52 49 46 46" },
            { offset: 8, signature: "57 45 42 50" },
        ],
        types: [FileType.WEBP],
    },

    // .jpeg
    {
        signature: [{ offset: 0, signature: "FF D8 FF" }],
        types: [FileType.JPEG],
    },

    // .gif
    {
        signature: [{ offset: 0, signature: "47 49 46 38 37 61" }],
        types: [FileType.GIF],
    },
    {
        signature: [{ offset: 0, signature: "47 49 46 38 39 61" }],
        types: [FileType.GIF],
    },

    // .mp4
    {
        signature: [{ offset: 4, signature: "66 74 79 70 69" }],
        types: [FileType.MP4],
    },
    {
        signature: [{ offset: 4, signature: "66 74 79 70 6D" }],
        types: [FileType.MP4],
    },

    // .webm, .mkv
    {
        signature: [{ offset: 0, signature: "1A 45 DF A3" }],
        types: [FileType.WEBM, FileType.MKV],
    },
];

function getFilesTypeFromSignature(fileSignature: string) {
    for (const fileTypeSignatureItem of fileTypeSignaturesList) {
        let matches = true;

        for (const sign of fileTypeSignatureItem.signature) {
            const formattedSignature = trimWhitespaces(sign.signature);
            const formattedFileSignature = trimWhitespaces(fileSignature)
                .toUpperCase()
                .slice(sign.offset * strCharsPerByte);

            if (!formattedFileSignature.startsWith(formattedSignature)) {
                matches = false;
                break;
            }
        }

        if (matches) {
            return fileTypeSignatureItem.types;
        }
    }

    return null;
}

function intToHex(int: number) {
    return int.toString(16).padStart(2, "0");
}

function intArrayToHexArray(array: Uint8Array) {
    const hexArray: string[] = new Array(array.length);
    for (let i = 0; i < array.length; i++) {
        hexArray[i] = intToHex(array[i]);
    }

    return hexArray;
}

export async function getFileSignatures(file: File | BunFile) {
    const fileBuffer = await file.arrayBuffer();
    const array = new Uint8Array(fileBuffer.slice(0, magicNumberLen));

    const signature = intArrayToHexArray(array).join(" ");

    return getFilesTypeFromSignature(signature);
}

export function getMimeFromType(fileType: string) {
    switch (fileType.toLowerCase()) {
        // ? Archive Files
        case FileType.JAR:
            return "application/java-archive";
        case FileType.ZIP:
            return "application/zip";
        case FileType.SEVEN_Z:
            return "application/x-7z-compressed";
        case FileType.GZ:
            return "application/gzip";
        case FileType.TAR:
            return "application/x-tar";

        // ? Image Files
        case FileType.PNG:
            return "image/png";
        case FileType.JPEG:
            return "image/jpeg";
        case FileType.WEBP:
            return "image/webp";
        case FileType.GIF:
            return "image/gif";

        // ? Video Files
        case FileType.MP4:
            return "video/mp4";
        case FileType.WEBM:
            return "video/webm";
        case FileType.MKV:
            return "video/x-matroska";

        default:
            return "application/octet-stream";
    }
}
