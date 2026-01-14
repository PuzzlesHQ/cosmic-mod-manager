import { gameVersionsList } from "~/constants/game-versions";

/**
 * Accepted formats:
 * 1. `(SUFFIX?)VERSION`:
 *    - no suffix: include VERSION
 *    - `!`, `!=`: exclude VERSION
 *    - `>`, `>=`, `<`, `<=`: include versions in the specified range
 *
 * 1. `START-END`:
 *    - include versions in the specified range
 *
 * 1. `!START-END` or `!=START-END`:
 *    - exclude versions in the specified range
 *
 * Example: `>=0.1.0, <0.2.0, !=0.1.5`
 */
export function parseVersionExpression(expr: string): ExprAction[] {
    const exprUnits = expr.split(",").map((unit) => unit.trim());

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

    for (const expr of exprs) {
        // exclude
        if ((expr.startsWith("!=") || expr.startsWith("!")) && !expr.includes("-")) {
            const version = expr.replace("!=", "").replace("!", "").trim();
            absoluteActions.push({ action: "exclude", version: version });
        }

        // resolve hyphen range
        else if (expr.includes("-")) {
            const exclusive = expr.startsWith("!") || expr.startsWith("!=");
            const hyphenRangeExpr = exclusive ? expr.replace("!=", "").replace("!", "").trim() : expr;
            if (hyphenRangeExpr.split("-").length !== 2) continue;

            let [start, end] = hyphenRangeExpr.split("-").map((v) => v.trim());
            if (!end || end.toLowerCase() === "latest") end = gameVersionsList[0];

            const startIndex = gameVersionsList.indexOf(start);
            const endIndex = gameVersionsList.indexOf(end);
            if (startIndex === -1 || endIndex === -1 || startIndex < endIndex) continue;

            for (let i = endIndex; i <= startIndex; i++) {
                absoluteActions.push({
                    action: exclusive ? "exclude" : "include",
                    version: gameVersionsList[i],
                });
            }
        }

        // resolve range
        else if (expr.startsWith(">") || expr.startsWith("<")) {
            rangeActions.push(...resolveRangeExpression(expr));
        }

        // include, overrides exclusions
        else if (expr.trim()) {
            const version = expr.trim();
            absoluteActions.push({ action: "include", version: version });
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

interface ExprAction {
    action: "include" | "exclude";
    version: string;
}
