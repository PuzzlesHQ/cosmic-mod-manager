import type { Context, Next } from "hono";
import { getUserIpAddress } from "~/routes/auth/helpers";

enum LogPrefix {
    Outgoing = "-->",
    Incoming = "<--",
    Error = "xxx",
}

function humanize(times: string[]) {
    const [delimiter, separator] = [",", "."];
    const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${delimiter}`));
    return orderTimes.join(separator);
}

function time(start: number) {
    const delta = Date.now() - start;
    return humanize([delta < 1000 ? `${delta}ms` : `${Math.round(delta / 1000)}s`]);
}

function colorStatus(status: number, str: string) {
    const out: { [key: string]: string } = {
        7: `\x1b[35m${str}\x1b[0m`,
        5: `\x1b[31m${str}\x1b[0m`,
        4: `\x1b[33m${str}\x1b[0m`,
        3: `\x1b[36m${str}\x1b[0m`,
        2: `\x1b[32m${str}\x1b[0m`,
        1: `\x1b[32m${str}\x1b[0m`,
        0: `\x1b[33m${str}\x1b[0m`,
    };

    const calculateStatus = (status / 100) | 0;

    return out[calculateStatus];
}

type PrintFunc = (str: string, ...rest: string[]) => void;

const Grey = "\x1b[90m";
const DimWhite = "\x1b[37m";
const BrightBlue = "\x1b[34m";
const Reset = "\x1b[0m";

function log(
    fn: PrintFunc,
    prefix: string,
    method: string,
    path: string,
    status?: number,
    ipAddress = "",
    elapsed?: string,
) {
    const statusFormatted = !status ? " " : colorStatus(status, `${status}`);
    const prefixColored = `${DimWhite}${prefix}${Reset}`;
    const elapsedColored = elapsed ? `${BrightBlue}${elapsed}${Reset}` : "";

    const Bar = `${Grey}|${Reset}`;

    const out =
        prefix === LogPrefix.Incoming
            ? `${prefixColored} ${method} ${Bar} ${path} ${Bar} ${statusFormatted} ${Bar} ${ipAddress}`
            : `${prefixColored} ${method} ${Bar} ${path} ${Bar} ${statusFormatted} ${Bar} ${elapsedColored}`;
    fn(out);
}

export function logger(fn: PrintFunc = console.log) {
    return async function logger(ctx: Context, next: Next) {
        // @ts-expect-error
        const method = HTTP_VERB[ctx.req?.method] || ctx.req?.method;
        const path = getPath(ctx.req.raw);
        const ipAddress = getUserIpAddress(ctx, false) || "";

        log(fn, LogPrefix.Incoming, method, path, undefined, ipAddress);

        const start = Date.now();
        await next();

        log(fn, LogPrefix.Outgoing, method, path, ctx.res.status, ipAddress, time(start));
    };
}

// Utils
function tryDecodeURI(str: string): string {
    try {
        return decodeURI(str);
    } catch {
        return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
            try {
                return decodeURI(match);
            } catch {
                return match;
            }
        });
    }
}

export function getPath(request: Request): string {
    const url = request.url;
    const start = url.indexOf("/", 8);
    let i = start;
    for (; i < url.length; i++) {
        const charCode = url.charCodeAt(i);
        if (charCode === 37) {
            const queryIndex = url.indexOf("?", i);
            const path = url.slice(start, queryIndex === -1 ? undefined : queryIndex);
            return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
        }

        if (charCode === 63) {
            break;
        }
    }
    return url.slice(start, i);
}

const HTTP_VERB = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PAT",
    DELETE: "DEL",
    HEAD: "HEAD",
    OPTIONS: "OPT",
};
