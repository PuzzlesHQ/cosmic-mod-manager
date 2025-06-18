import { TimelineOptions } from "./types";

export function timeSince(pastTime: Date, locale = "en-US"): string {
    try {
        const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
        const now = new Date();
        const diff = now.getTime() - pastTime.getTime();

        const seconds = Math.round(diff / 1000);
        if (seconds < 60) return formatter.format(-seconds, "second");

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return formatter.format(-minutes, "minute");

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return formatter.format(-hours, "hour");

        const days = Math.round(hours / 24);
        if (days < 7) return formatter.format(-days, "day");

        const weeks = Math.round(days / 7);
        if (weeks < 4) return formatter.format(-weeks, "week");

        const months = Math.round(days / 30.4375);
        if (months < 12) return formatter.format(-months, "month");

        const years = Math.round(days / 365.25);
        return formatter.format(-years, "year");
    } catch (error) {
        console.error(error);
        return "";
    }
}

export function DateFromStr(date: string | Date | undefined) {
    if (!date) return null;

    try {
        const coerced_date = new Date(date);
        if (Number.isNaN(coerced_date.valueOf())) return null;

        return coerced_date;
    } catch {
        return null;
    }
}

export function date(date: string | Date) {
    if (date instanceof Date) return date;
    return new Date(date);
}

export function ISO_DateStr(date?: string | Date, utc = false): string {
    try {
        const _date = date ? new Date(date) : new Date();
        if (utc === false) {
            return `${_date.getFullYear()}-${(_date.getMonth() + 1).toString().padStart(2, "0")}-${_date.getDate().toString().padStart(2, "0")}`;
        }

        return `${_date.getUTCFullYear()}-${(_date.getUTCMonth() + 1).toString().padStart(2, "0")}-${_date.getUTCDate().toString().padStart(2, "0")}`;
    } catch {
        return null;
    }
}

interface FormatDateOptions {
    locale?: string;
    shortMonthNames?: boolean;
    utc?: boolean;

    includeTime?: boolean;
    includeYear?: boolean;
    includeMonth?: boolean;
    includeDay?: boolean;
}

export function FormatDate_ToLocaleString(_date: string | Date, _options: FormatDateOptions = {}) {
    const date = DateFromStr(_date);
    if (!date) return "";

    const options: Intl.DateTimeFormatOptions = {};

    if (_options.includeTime !== false) {
        options.hourCycle = "h24";
        options.hour = "numeric";
        options.minute = "numeric";
    }

    if (_options.includeDay !== false) options.day = "numeric";

    if (_options.includeMonth !== false) {
        if (_options.shortMonthNames === true) {
            options.month = "short";
        } else options.month = "long";
    }
    if (_options.includeYear !== false) options.year = "numeric";

    if (_options.utc === true) options.timeZone = "UTC";

    return date.toLocaleString(_options.locale, options);
}

export function GetTimestamp() {
    const now = new Date();
    const month = `${now.getUTCMonth() + 1}`.padStart(2, "0");
    return `${now.getUTCFullYear()}-${month}-${now.getUTCDate()} ${now.getUTCHours()}:${now.getUTCMinutes()}`;
}

// Date operations functions

export function SubtractDays(date: Date, days: number): Date {
    if (!days) return date;

    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

export function AddDays(date: Date, days: number): Date {
    return SubtractDays(date, -days);
}

export function SubtractMonths(date: Date, months: number, resetDate = false): Date {
    if (!months) return date;

    const result = new Date(date);
    // Set the date to the first of the month if resetDate is true
    if (resetDate) result.setDate(1);

    result.setMonth(result.getMonth() - months);
    return result;
}

export function AddMonths(date: Date, months: number, resetDate?: boolean): Date {
    return SubtractMonths(date, -months, resetDate);
}

export function SubtractYears(date: Date, years: number): Date {
    if (!years) return date;

    const result = new Date(date);
    result.setFullYear(result.getFullYear() - years);
    return result;
}

export function AddYears(date: Date, years: number): Date {
    return SubtractYears(date, -years);
}

export function getTimeRange(timeline: TimelineOptions): [Date, Date] {
    const now = new Date();

    switch (timeline) {
        case TimelineOptions.YESTERDAY:
            return [SubtractDays(now, 1), SubtractDays(now, 1)];

        case TimelineOptions.THIS_WEEK:
            return [SubtractDays(now, now.getDay()), SubtractDays(now, 1)];

        case TimelineOptions.LAST_WEEK:
            return [SubtractDays(now, now.getDay() + 7), SubtractDays(now, now.getDay() + 1)];

        case TimelineOptions.PREVIOUS_7_DAYS:
            return [SubtractDays(now, 7), SubtractDays(now, 1)];

        case TimelineOptions.THIS_MONTH:
            return [newDate(now.getFullYear(), now.getMonth(), 1), SubtractDays(now, 1)];

        case TimelineOptions.LAST_MONTH:
            return [newDate(now.getFullYear(), now.getMonth() - 1, 1), newDate(now.getFullYear(), now.getMonth(), 0)];

        case TimelineOptions.PREVIOUS_30_DAYS:
            return [SubtractDays(now, 30), SubtractDays(now, 1)];

        case TimelineOptions.PREVIOUS_90_DAYS:
            return [SubtractDays(now, 90), SubtractDays(now, 1)];

        case TimelineOptions.THIS_YEAR:
            return [newDate(now.getFullYear(), 0, 1), SubtractDays(now, 1)];

        case TimelineOptions.LAST_YEAR:
            return [newDate(now.getFullYear() - 1, 0, 1), newDate(now.getFullYear(), 0, 0)];

        case TimelineOptions.PREVIOUS_365_DAYS:
            return [SubtractDays(now, 365), SubtractDays(now, 1)];

        case TimelineOptions.ALL_TIME:
            return [new Date(0), SubtractDays(now, 1)];

        default:
            return [SubtractDays(now, 30), SubtractDays(now, 1)];
    }
}

export function newDate(year: number, month: number, date = 1, hour = 0, min = 0, sec = 0) {
    try {
        return new Date(year, month, date, hour, min, sec);
    } catch (error) {
        console.error(error);
        return null;
    }
}
