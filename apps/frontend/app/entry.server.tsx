import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { getLocale } from "~/locales";
import { getMetadataFromLocaleCode } from "~/locales/meta";
import { LocaleProvider } from "~/locales/provider";
import { getHintLocale } from "~/locales/utils";

const STREAM_TIMEOUT = 5000;

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
) {
    if (request.method.toUpperCase() === "HEAD") {
        return new Response(null, {
            status: responseStatusCode,
            headers: responseHeaders,
        });
    }

    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");

    const hintLocale = getHintLocale(new URL(request.url).searchParams);
    const initLocaleModule = await getLocale(hintLocale);
    const initLocaleMetadata = getMetadataFromLocaleCode(hintLocale);

    const body = await renderToReadableStream(
        <LocaleProvider initLocale={initLocaleModule} initMetadata={initLocaleMetadata}>
            <ServerRouter context={routerContext} url={request.url} />
        </LocaleProvider>,
        {
            signal: AbortSignal.timeout(STREAM_TIMEOUT + 1000),
            onError(error: unknown) {
                responseStatusCode = 500;
                if (shellRendered) {
                    console.error(error);
                }
            },
        },
    );
    shellRendered = true;

    if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
        await body.allReady;
    }

    responseHeaders.set("Content-Type", "text/html");
    return new Response(body, {
        headers: responseHeaders,
        status: responseStatusCode,
    });
}
