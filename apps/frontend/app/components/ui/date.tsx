import { FormattedDate as DefaultFormattedDate } from "@app/components/ui/date";
import { FormatDate_ToLocaleString, timeSince } from "@app/utils/date";
import { Capitalize } from "@app/utils/string";
import type React from "react";
import ClientOnly from "~/components/client-only";
import { formatLocaleCode } from "~/locales";
import { useTranslation } from "~/locales/provider";

type FormatDateProps = Omit<React.ComponentProps<typeof DefaultFormattedDate>, "locale">;

export function FormattedDate(props: FormatDateProps) {
    const { locale } = useTranslation();

    return (
        <ClientOnly
            fallback={<DefaultFormattedDate utc={true} locale={formatLocaleCode(locale)} {...props} />}
            Element={() => {
                return FormatDate_ToLocaleString(props.date, {
                    utc: false,
                    locale: formatLocaleCode(locale),
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
    const { locale } = useTranslation();
    const date = new Date(props.date);

    const timeStr = timeSince(date, formatLocaleCode(locale));
    if (props.capitalize) return Capitalize(timeStr);
    return timeStr;
}
