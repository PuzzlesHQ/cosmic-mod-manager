import { gameVersionsList } from "~/constants/game-versions";

/**
 * Accepted formats:
 * 1. `(SUFFIX?)VERSION`:
 *    - no suffix : include VERSION
 *    - `!` : exclude VERSION
 *    - `>`, `>=`, `<`, `<=` : include versions in the specified range
 *
 * 1. `START-END`:
 *    - include versions in the specified range
 *
 * 1. `!START-END`:
 *    - exclude versions in the specified range
 *
 * Example: `>=0.1.0, <0.2.0, !0.1.5`
 */
export function parseVersionExpression(expr: string): ExprAction[] {
    const exprUnits = expr
        .replaceAll("latest", gameVersionsList[0])
        .split(",")
        .map((unit) => unit.trim());

    const includedVersions = new Set<string>();
    const excludedVersions = new Set<string>();

    const { rangeActions, absoluteActions } = resolveExpressions(exprUnits);

    // range actions are overriddable by absolute actions
    // that's why these are applied first
    for (const action of rangeActions) {
        // the result is intersection of all range actions
        // so no need to delete from the included/excluded sets here
        if (action.action === "include") {
            includedVersions.add(action.version);
        } else {
            excludedVersions.add(action.version);
        }
    }

    for (const action of absoluteActions) {
        if (action.action === "include") {
            includedVersions.add(action.version);
            excludedVersions.delete(action.version);
        } else {
            excludedVersions.add(action.version);
            includedVersions.delete(action.version);
        }
    }

    const result: ExprAction[] = [];

    for (const v of gameVersionsList) {
        if (excludedVersions.has(v)) {
            result.push({ action: "exclude", version: v });
        } else if (includedVersions.has(v)) {
            result.push({ action: "include", version: v });
        }
    }

    return result;
}

function resolveExpressions(exprs: string[]) {
    const rangeActions: ExprAction[] = [];
    const absoluteActions: ExprAction[] = [];

    for (const _expr of exprs) {
        let expr = _expr.trim();
        const isExclusiveExpr = expr.startsWith("!");
        if (isExclusiveExpr) expr = expr.slice(1).trim();

        const hyphenRangeStart = getHyphenRangeStart(expr);
        if (hyphenRangeStart) {
            const start = hyphenRangeStart;
            let end = expr.slice(hyphenRangeStart.length).trim().slice(1).trim();
            if (!end || end.toLowerCase() === "latest") end = gameVersionsList[0];

            const startIndex = gameVersionsList.indexOf(start);
            const endIndex = gameVersionsList.indexOf(end);
            if (startIndex === -1 || endIndex === -1 || startIndex < endIndex) continue;

            for (let i = endIndex; i <= startIndex; i++) {
                absoluteActions.push({
                    action: isExclusiveExpr ? "exclude" : "include",
                    version: gameVersionsList[i],
                });
            }
        }

        // normal exclusive expression
        else if (isExclusiveExpr) {
            absoluteActions.push({ action: "exclude", version: expr });
        }

        // resolve range
        else if (expr.startsWith(">") || expr.startsWith("<")) {
            rangeActions.push(...resolveRangeExpression(expr));
        }

        //
        else if (expr) {
            absoluteActions.push({ action: "include", version: expr });
        }
    }

    return {
        rangeActions,
        absoluteActions,
    };
}

function resolveRangeExpression(unit: string): ExprAction[] {
    const actions: ExprAction[] = [];

    if (unit.startsWith(">")) {
        const version = unit.replace(">=", "").replace(">", "").trim();
        const isInclusive = unit.startsWith(">=");

        // gameVersionsList is sorted in descending order
        const targetIndex = gameVersionsList.indexOf(version);
        if (targetIndex !== -1) {
            const rangeEndIndex = isInclusive ? targetIndex : targetIndex - 1;

            for (let i = 0; i < gameVersionsList.length; i++) {
                actions.push({ action: i <= rangeEndIndex ? "include" : "exclude", version: gameVersionsList[i] });
            }
        }
    } else if (unit.startsWith("<")) {
        const version = unit.replace("<=", "").replace("<", "").trim();
        const isInclusive = unit.startsWith("<=");

        // gameVersionsList is sorted in descending order
        const targetIndex = gameVersionsList.indexOf(version);
        if (targetIndex !== -1) {
            const rangeStartIndex = isInclusive ? targetIndex : targetIndex + 1;

            for (let i = 0; i < gameVersionsList.length; i++) {
                actions.push({ action: i >= rangeStartIndex ? "include" : "exclude", version: gameVersionsList[i] });
            }
        }
    }

    return actions;
}

function getHyphenRangeStart(unit: string) {
    const startMatches: string[] = [];

    // if the expression matches a full version, it's not a hyphen range
    // even if it contains hyphens and probably startsWith a valid version followed by hyphen
    // eg: 1.19.2-rc1 is not a hyphen range
    // but it will match `1.19.2` as a starting version
    if (gameVersionsList.indexOf(unit) !== -1) return null;

    for (const v of gameVersionsList) {
        if (unit.startsWith(`${v}-`)) {
            startMatches.push(v);
        }
    }

    let matchingStart: string | null = null;
    for (const item of startMatches) {
        if (!matchingStart || matchingStart.length < item.length) {
            matchingStart = item;
        }
    }

    return matchingStart;
}

interface ExprAction {
    action: "include" | "exclude";
    version: string;
}

export function getDiff(currentList: string[], actions: ExprAction[]) {
    const includedSet = new Set<string>();
    const excludedSet = new Set<string>();

    for (const action of actions) {
        if (action.action === "include") {
            includedSet.add(action.version);
            excludedSet.delete(action.version);
        } else {
            excludedSet.add(action.version);
            includedSet.delete(action.version);
        }
    }

    const toAdd: string[] = [];
    const toRemove: string[] = [];

    for (const v of includedSet) {
        if (!currentList.includes(v)) {
            toAdd.push(v);
        }
    }

    for (const v of currentList) {
        if (excludedSet.has(v)) {
            toRemove.push(v);
        }
    }

    return {
        toAdd,
        toRemove,
    };
}
