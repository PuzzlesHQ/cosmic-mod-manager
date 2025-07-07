import MarkdownIt from "markdown-it";
import type {
    escapeAttrValue as _escapeAttrValue,
    FilterXSS as _FilterXSS,
    safeAttrValue as _safeAttrValue,
    whiteList as _whiteList,
} from "xss";
import xss from "xss";

interface Xss {
    FilterXSS: typeof _FilterXSS;
    escapeAttrValue: typeof _escapeAttrValue;
    safeAttrValue: typeof _safeAttrValue;
    whiteList: typeof _whiteList;
}

const { FilterXSS, escapeAttrValue, safeAttrValue, whiteList } = xss as unknown as Xss;

export function configureXss(urlModifier?: (url: string) => string) {
    return new FilterXSS({
        whiteList: {
            ...whiteList,
            summary: [],
            h1: ["id"],
            h2: ["id"],
            h3: ["id"],
            h4: ["id"],
            h5: ["id"],
            h6: ["id"],
            kbd: ["id"],
            input: ["checked", "disabled", "type"],
            iframe: ["width", "height", "allowfullscreen", "frameborder", "start", "end"],
            img: [...(whiteList.img || []), "usemap", "style", "loading"],
            map: ["name"],
            area: [...(whiteList.a || []), "coords"],
            a: [...(whiteList.a || []), "rel"],
            td: [...(whiteList.td || []), "style"],
            th: [...(whiteList.th || []), "style"],
            picture: [],
            source: ["media", "sizes", "src", "srcset", "type"],
        },
        css: {
            whiteList: {
                "image-rendering": /^pixelated$/,
                "text-align": /^center|left|right$/,
                float: /^left|right$/,
            },
        },
        onTag: (tag, html, { isClosing }) => {
            // Lazy load images in markdown
            if (tag === "img" && !isClosing) {
                return `<${tag} loading="lazy" ${html.slice(5)}`;
            }

            // Add data-discover to internal links so that react-router can fetch the manifest for those routes
            if (tag === "a" && !isClosing) {
                const startIndex = html.indexOf("href=");
                if (startIndex === -1) return html;

                const strSlice = html.slice(startIndex + 6);
                const endIndex = strSlice.indexOf('"') || strSlice.indexOf('\\"');
                const href = strSlice.slice(0, endIndex);

                if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
                    if (html.includes("title=")) return html;
                    return `<${tag} title="${href}" ${html.slice(3)}`;
                }

                const sameSiteHref = urlModifier ? urlModifier(href) : href;
                return `<${tag} data-discover="true" title="${sameSiteHref}" ${html.slice(3).replace(href, sameSiteHref)}`;
            }
        },
        onIgnoreTagAttr: (tag, name, value) => {
            // Allow iframes from acceptable sources
            if (tag === "iframe" && name === "src") {
                const allowedSources = [
                    {
                        regex: /^https?:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\/[a-zA-Z0-9_-]{11}(\?&autoplay=[0-1]{1})?$/,
                        remove: ["&autoplay=1"], // Prevents autoplay
                    },
                    {
                        regex: /^https?:\/\/(www\.)?discord\.com\/widget\?id=\d{18,19}(&theme=\w+)?$/,
                        remove: [/&theme=\w+/],
                    },
                ];

                for (const source of allowedSources) {
                    if (source.regex.test(value)) {
                        let val = value;
                        for (const remove of source.remove) {
                            val = val.replace(remove, "");
                        }
                        return `${name}="${escapeAttrValue(val)}"`;
                    }
                }
            }

            // For Highlight.JS
            if (name === "class" && ["pre", "code", "span"].includes(tag)) {
                const allowedClasses = [];
                for (const className of value.split(/\s/g)) {
                    if (className.startsWith("hljs-") || className.startsWith("language-")) {
                        allowedClasses.push(className);
                    }
                }
                return `${name}="${escapeAttrValue(allowedClasses.join(" "))}"`;
            }
        },
        safeAttrValue(tag, name, value, cssFilter) {
            if (tag === "img" && name === "src" && !value.startsWith("data:")) {
                try {
                    const url = new URL(value);

                    if (url.hostname.includes("wsrv.nl")) {
                        url.searchParams.delete("errorredirect");
                    }

                    const allowedHostnames = [
                        "github.com",
                        "raw.githubusercontent.com",
                        "img.shields.io",
                        "imgur.com",
                        "i.imgur.com",
                        "i.postimg.cc",
                        "i.ibb.co",
                        "cf.way2muchnoise.eu",
                        "bstats.org",
                        "crmm.tech",
                        "cdn.crmm.tech",
                        "crmm-cdn.global.ssl.fastly.net",
                        "wsrv.nl",
                        "localhost",
                    ];

                    if (!allowedHostnames.includes(url.hostname)) {
                        return safeAttrValue(
                            tag,
                            name,
                            `https://wsrv.nl/?url=${encodeURIComponent(url.toString().replaceAll("&amp;", "&"))}&n=-1`,
                            cssFilter,
                        );
                    }
                    return safeAttrValue(tag, name, url.toString(), cssFilter);
                } catch {
                    /* empty */
                }
            }

            return safeAttrValue(tag, name, value, cssFilter);
        },
    });
}

export function md(options = {}) {
    const md = new MarkdownIt("default", {
        html: true,
        linkify: true,
        breaks: false,
        typographer: true,
        ...options,
    });

    const defaultLinkOpenRenderer =
        md.renderer.rules.link_open || ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const index = token.attrIndex("href");

        if (index !== -1) {
            const href = token.attrs?.[index][1];

            try {
                const url = new URL(href || "");
                const allowedHostnames: string[] = [];

                if (allowedHostnames.includes(url.hostname)) {
                    return defaultLinkOpenRenderer(tokens, idx, options, env, self);
                }
            } catch {
                /* empty */
            }
        }

        tokens[idx].attrSet("rel", "noopener nofollow ugc");

        return defaultLinkOpenRenderer(tokens, idx, options, env, self);
    };

    return md;
}

export function renderString(string: string, xssProcessor = configureXss()) {
    return xssProcessor.process(md().render(string));
}
