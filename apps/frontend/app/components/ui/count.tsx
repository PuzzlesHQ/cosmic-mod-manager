import { FormatCount } from "@app/utils/number";
import { useTranslation } from "~/locales/provider";

interface FormattedCountProps {
    count: number;
    options?: Intl.NumberFormatOptions;
}

export function FormattedCount({ count, options }: FormattedCountProps) {
    const { formattedLocaleName } = useTranslation();

    return FormatCount(count, formattedLocaleName, options);
}
