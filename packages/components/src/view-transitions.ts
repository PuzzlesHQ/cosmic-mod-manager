export function viewTransitionStyleObj(vtId: string | undefined, viewTransitions: boolean | undefined) {
    return vtId && viewTransitions === true ? { viewTransitionName: removeNumbers(vtId) } : {};
}

function removeNumbers(str: string) {
    return str.replace(/\d+/g, "");
}
