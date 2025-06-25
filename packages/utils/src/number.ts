export function isNumber(num: number | string) {
    if (typeof num === "number") {
        return num - num === 0;
    }
    return Number.isFinite(+num);
}

const fileSizeSuffixes = {
    bytes: "Bytes",
    kib: "KiB",
    mib: "MiB",
    gib: "GiB",
};

export function parseFileSize(size: number): string {
    if (!size) {
        return `0 ${fileSizeSuffixes.bytes}`;
    }
    if (size >= 0 && size < 1024) {
        return `${size} ${fileSizeSuffixes.bytes}`;
    }
    if (size >= 1024 && size < 1024_000) {
        return `${(size / 1024).toFixed(1)} ${fileSizeSuffixes.kib}`;
    }
    if (size >= 1024_000 && size < 1048576000) {
        return `${(size / (1024 * 1024)).toFixed(2)} ${fileSizeSuffixes.mib}`;
    }
    return `${(size / (1024 * 1024 * 1024)).toFixed(3)} ${fileSizeSuffixes.gib}`;
}

export function FormatCount(count = 0, locale = "en-US", options?: Intl.NumberFormatOptions) {
    let minimumFractionDigits: number | undefined;
    if (count > 1_000_000) {
        minimumFractionDigits = 2;
    } else if (count > 1_000) {
        minimumFractionDigits = 1;
    }

    const formatter = new Intl.NumberFormat(locale, {
        notation: "compact",
        minimumFractionDigits: minimumFractionDigits,
        ...options,
    });

    return formatter.format(count);
}
