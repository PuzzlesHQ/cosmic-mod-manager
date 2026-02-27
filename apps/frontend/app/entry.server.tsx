import { PassThrough } from "node:stream";

import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import ReactDomServer, { type RenderToPipeableStreamOptions } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { LocaleProvider } from "~/locales/provider";
import { getHintLocale } from "~/locales/utils";
import { getLocale } from "./locales";
import { getMetadataFromLocaleCode } from "./locales/meta";

const ABORT_DELAY = 5000;

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const userAgent = request.headers.get("user-agent");

        const readyOption: keyof RenderToPipeableStreamOptions =
            (userAgent && isbot(userAgent)) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";

        const hintLocale = getHintLocale(new URL(request.url).searchParams);
        getLocale(hintLocale).then(async (initLocaleModule) => {
            const initLocaleMetadata = getMetadataFromLocaleCode(hintLocale);

            const { pipe, abort } = ReactDomServer.renderToPipeableStream(
                <LocaleProvider initLocale={initLocaleModule} initMetadata={initLocaleMetadata}>
                    <ServerRouter context={routerContext} url={request.url} />
                </LocaleProvider>,
                {
                    [readyOption]() {
                        shellRendered = true;
                        const body = new PassThrough();
                        const stream = createReadableStreamFromReadable(body);

                        responseHeaders.set("Content-Type", "text/html");

                        resolve(
                            new Response(stream, {
                                headers: responseHeaders,
                                status: responseStatusCode,
                            }),
                        );

                        pipe(body);
                    },
                    onShellError(error: unknown) {
                        reject(error);
                    },
                    onError(error: unknown) {
                        responseStatusCode = 500;
                        if (shellRendered) {
                            console.error(error);
                        }
                    },
                },
            );

            setTimeout(abort, ABORT_DELAY);
        });
    });
}
