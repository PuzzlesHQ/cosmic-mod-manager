import type { MetaDescriptor } from "react-router";
import { formatLocaleCode } from "~/locales";
import SupportedLocales, { DefaultLocale, GetLocaleMetadata } from "~/locales/meta";
import { alterUrlHintLocale } from "~/locales/provider";
import Config from "~/utils/config";
import { getCurrLocation, getHintLocale } from "./urls";

type BaseMetaProps = {
    url: string | undefined; // when no url is provided, uses the curr page's url
    siteMetaDescription?: string;
    parentMetaTags?: MetaDescriptor[];
    authorProfile?: string;
};

type UnionMetaProps =
    | {
          title: string;
          description: string;
          image: string;
          linksOnly?: false;
      }
    | {
          linksOnly: true;
      };

type MetaTagsProps = BaseMetaProps & UnionMetaProps;

/**
 * Generate meta tags like, title, description and their open graph equivalents
 * @param { MetaTags } props
 */
export function MetaTags(props: MetaTagsProps): MetaDescriptor[] {
    if (!props.parentMetaTags) props.parentMetaTags = [];

    const url = props.url ? new URL(props.url) : getCurrLocation();
    const currHintLocale_meta = GetLocaleMetadata(getHintLocale(url.searchParams)) || DefaultLocale;

    const alternateLocaleLinks = SupportedLocales.map((locale) => {
        return {
            tagName: "link",
            rel: "alternate",
            hrefLang: formatLocaleCode(locale),
            href: alterUrlHintLocale(locale, false, url).href,
        };
    });

    const links = mergeMetaTagsList(props.parentMetaTags, [
        {
            tagName: "link",
            rel: "canonical",
            href: alterUrlHintLocale(currHintLocale_meta, true, url).href,
        },
        {
            tagName: "link",
            rel: "alternate",
            hrefLang: "x-default",
            href: alterUrlHintLocale(DefaultLocale, true, url).href,
        },
        ...alternateLocaleLinks,
        { property: "og:url", content: alterUrlHintLocale(currHintLocale_meta, undefined, url).href },
        { name: "twitter:url", content: alterUrlHintLocale(currHintLocale_meta, undefined, url).href },
        ...(props.authorProfile ? [AuthorLink(props.authorProfile)] : []),
    ]);

    if (props.linksOnly) {
        return links;
    }

    const mergedMeta = mergeMetaTagsList(links, [
        { title: props.title, "data-tag-name": "title" },
        { name: "description", content: props.siteMetaDescription || props.description },

        { property: "og:site_name", content: Config.SITE_NAME_SHORT },
        { property: "og:type", content: "website" },
        { property: "og:title", content: props.title },
        { property: "og:description", content: props.description },
        { property: "og:image", content: props.image },

        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: props.title },
        { name: "twitter:description", content: props.description },
        { name: "twitter:image", content: props.image },
    ]);

    return mergedMeta;
}

/**
 * Merges the new meta tags into the original one while making sure there are no duplicates being added \
 * Omits the original meta tag item if the new list also contains an item with same key but different value
 */
function mergeMetaTagsList(originalList: MetaDescriptor[], newItems: MetaDescriptor[]) {
    const combinedList = newItems.slice();

    const matchKeys = ["name", "property", "rel", "hrefLang", "tagName", "data-tag-name"];

    outerLoop: for (const originalItem of originalList) {
        for (const existingItem of combinedList) {
            let isItemDuplicate = true;
            for (const key of matchKeys) {
                // @ts-ignore
                if (originalItem[key] !== existingItem[key]) {
                    isItemDuplicate = false;
                }
            }

            if (isItemDuplicate) {
                continue outerLoop;
            }
        }

        combinedList.push(originalItem);
    }

    return combinedList;
}

function AuthorLink(url: string) {
    return {
        tagName: "link",
        rel: "author",
        href: url,
    };
}
