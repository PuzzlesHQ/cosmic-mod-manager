import { Capitalize } from "@app/utils/string";

export function formatList(types: string[], locale: string) {
    return Capitalize(
        new Intl.ListFormat(locale, { style: "short", type: "conjunction" }).format(types),
        false,
        locale,
    );
}
