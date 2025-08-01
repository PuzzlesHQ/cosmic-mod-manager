import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const properties = ["p", "px", "py", "pt", "pb", "ps", "pe"];

export function cn(...inputs: ClassValue[]) {
    const reversedInputs = clsx(inputs).split(" ").reverse();
    const modifiedInputs: string[] = [];
    const seenProperties: string[] = [];

    outer: for (const classVal of reversedInputs) {
        for (const prop of properties) {
            if (classVal.trim().startsWith(`${prop}-`) || classVal.trim().startsWith(`!${prop}-`)) {
                if (seenProperties.includes(prop)) continue outer;
                else seenProperties.push(prop);
            }
        }

        modifiedInputs.push(classVal);
    }
    modifiedInputs.reverse();

    return twMerge(modifiedInputs);
}
