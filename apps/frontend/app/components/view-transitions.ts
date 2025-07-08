import type { CSSProperties } from "react";

export function viewTransitionStyleObj(vtId: string | undefined) {
    return vtId ? ({ "--vt-id": removeNumbers(vtId) } as CSSProperties) : {};
}

function removeNumbers(str: string) {
    return str.replace(/\d+/g, "");
}
