import { FormatDate_ToLocaleString, timeSince } from "@app/utils/date";

interface FormatDateProps {
    date: Date | string;
    shortMonthNames?: boolean;
    utc?: boolean;
    locale?: string;

    showTime?: boolean;
    includeYear?: boolean;
    includeMonth?: boolean;
    includeDay?: boolean;
}

export function FormattedDate(props: FormatDateProps) {
    return FormatDate_ToLocaleString(props.date, {
        shortMonthNames: props.shortMonthNames,
        utc: props.utc,
        locale: props.locale,
        includeTime: props.showTime,
        includeYear: props.includeYear,
        includeMonth: props.includeMonth,
        includeDay: props.includeDay,
    });
}

export function TimePassedSince({ date }: { date: Date | string }) {
    const _date = new Date(date);

    return timeSince(_date);
}
