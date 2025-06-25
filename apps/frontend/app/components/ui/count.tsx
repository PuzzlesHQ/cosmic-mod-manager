import { FormatCount } from "@app/utils/number";
import { useTranslation } from "~/locales/provider";

interface FormattedCountProps {
    count: number;
    notation?: Intl.NumberFormatOptions["notation"];
}

export function FormattedCount({ count, notation = "compact" }: FormattedCountProps) {
    const { formattedLocaleName } = useTranslation();

    return FormatCount(count, formattedLocaleName, { notation: notation });
}
