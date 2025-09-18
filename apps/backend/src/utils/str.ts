import { STRING_ID_LENGTH } from "@app/utils/constants";
import { nanoid } from "nanoid";

export function generateRandomId(len = STRING_ID_LENGTH) {
    return nanoid(len);
}

export function generateDbId() {
    return nanoid(STRING_ID_LENGTH);
}

export function parseJson<T extends object | null>(str: string | null): Promise<T | null> {
    return new Promise((resolve) => {
        try {
            if (str === null || str === null) resolve(null);
            else resolve(JSON.parse(str));
        } catch {
            resolve(null);
        }
    });
}
