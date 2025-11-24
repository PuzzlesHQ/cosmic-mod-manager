import type { Location, MetaDescriptor } from "react-router";
import { formatLocaleCode } from "~/locales";
import SupportedLocales, { DefaultLocale, GetLocaleMetadata } from "~/locales/meta";
import Config from "~/utils/config";
import { changeHintLocale } from "~/utils/urls";
import { getHintLocale, omitOrigin } from "./urls";

type BaseMetaProps = {
    url: string | undefined; // when no url is provided, uses the curr page's url
    siteMetaDescription?: string;
    parentMetaTags?: MetaDescriptor[];
    authorProfile?: string;
    location: Location<unknown>;
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

    const urlObj = new URL(props.url ? props.url : `${Config.FRONTEND_URL}${omitOrigin(props.location)}`);
    const url = urlObj.href;

    const currHintLocale = GetLocaleMetadata(getHintLocale(urlObj.searchParams)) || DefaultLocale;
    const alternateLocaleLinks = SupportedLocales.map((locale) => {
        return {
            tagName: "link",
            rel: "alternate",
            hrefLang: formatLocaleCode(locale),
            href: changeHintLocale(locale, url, false),
        };
    });

    const links = mergeMetaTagsList(props.parentMetaTags, [
        {
            tagName: "link",
            rel: "canonical",
            href: changeHintLocale(currHintLocale, url, true),
        },
        {
            tagName: "link",
            rel: "alternate",
            hrefLang: "x-default",
            href: changeHintLocale(DefaultLocale, url, true),
        },
        ...alternateLocaleLinks,
        { property: "og:url", content: changeHintLocale(currHintLocale, url, undefined) },
        { name: "twitter:url", content: changeHintLocale(currHintLocale, url, undefined) },
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
                // @ts-expect-error
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

// export async function getLocaleObject(_search: string) {
//     const searchParams = new URLSearchParams(_search);
//     const locale = getHintLocale(searchParams);

//     return await getLocale(locale);
// }
