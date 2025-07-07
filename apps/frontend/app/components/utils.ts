import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const properties = ["p", "px", "py", "pt", "pb", "ps", "pe"];

export function cn(...inputs: ClassValue[]) {
    const reversedInputs = inputs
        .filter((i) => typeof i === "string")
        .flatMap((str) => str.split(" "))
        .reverse();
    const modifiedInputs: ClassValue[] = [];
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

    return twMerge(clsx(modifiedInputs));
}
