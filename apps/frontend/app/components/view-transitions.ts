export function viewTransitionStyleObj(vtId: string | undefined) {
    return vtId ? { viewTransitionName: removeNumbers(vtId) } : {};
}

function removeNumbers(str: string) {
    return str.replace(/\d+/g, "");
}
