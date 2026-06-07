import { FormatDate_ToLocaleString, timeSince } from "@app/utils/date";
import { Capitalize } from "@app/utils/string";
import ClientOnly from "~/components/client-only";
import { useTranslation } from "~/locales/provider";

interface FormatDateProps {
    date: Date | string;
    shortMonthNames?: boolean;
    utc?: boolean;

    includeTime?: boolean;
    includeYear?: boolean;
    includeMonth?: boolean;
    includeDay?: boolean;
}

export function FormattedDate(props: FormatDateProps) {
    const { formattedLocaleName } = useTranslation();

    return (
        <ClientOnly
            fallback={FormatDate_ToLocaleString(props.date, {
                locale: formattedLocaleName,
                ...props,
            })}
            Element={() => {
                return FormatDate_ToLocaleString(props.date, {
                    utc: false,
                    locale: formattedLocaleName,
                    ...props,
                });
            }}
        />
    );
}

interface TimePassedSinceProps {
    date: Date | string;
    capitalize?: boolean;
}

export function TimePassedSince(props: TimePassedSinceProps) {
    const { formattedLocaleName } = useTranslation();
    const date = new Date(props.date);

    const timeStr = timeSince(date, formattedLocaleName);
    if (props.capitalize) return Capitalize(timeStr);
    return timeStr;
}
