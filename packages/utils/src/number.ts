export function isNumber(num: number | string) {
    if (typeof num === "number") {
        return num - num === 0;
    }
    return Number.isFinite(+num);
}

export const KiB = 1024;
export const MiB = 1024 * KiB;
export const GiB = 1024 * MiB;

const fileSizeSuffixes = {
    bytes: "Bytes",
    kib: "KiB",
    mib: "MiB",
    gib: "GiB",
};

export function parseFileSize(size: number): string {
    if (!size || size < 0) {
        return `0 ${fileSizeSuffixes.bytes}`;
    }
    if (size >= 0 && size < 1024) {
        return `${size} ${fileSizeSuffixes.bytes}`;
    }
    if (size >= 1024 && size < 1024_000) {
        return `${(size / KiB).toFixed(1)} ${fileSizeSuffixes.kib}`;
    }
    if (size >= 1024_000 && size < 1048576000) {
        return `${(size / MiB).toFixed(2)} ${fileSizeSuffixes.mib}`;
    }
    return `${(size / GiB).toFixed(2)} ${fileSizeSuffixes.gib}`;
}

export function FormatCount(count = 0, locale = "en-US", options?: Intl.NumberFormatOptions) {
    let maxDigitsAfterDecimal = 0;

    if (count > 999_999) {
        maxDigitsAfterDecimal = 2;
    } else if (count > 999) {
        maxDigitsAfterDecimal = 1;
    }

    const formatter = new Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: maxDigitsAfterDecimal,
        ...options,
    });

    return formatter.format(count);
}
