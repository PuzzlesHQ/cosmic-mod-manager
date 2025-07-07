// Microdata
export enum MicrodataItemType {
    Thing = "Thing",
    CreativeWork = "CreativeWork",
    Person = "Person",
    Organization = "Organization",
    ImageObject = "ImageObject",
    ImageGallery = "ImageGallery",
    WebPage = "WebPage",
    WebSite = "WebSite",
    BreadCrumbList = "BreadcrumbList",
    ListItem = "ListItem",
}

export enum MicrodataItemProps {
    about = "about",
    name = "name",
    member = "member",
    description = "description",
    image = "image",
    url = "url",
    author = "author",
    publisher = "publisher",
    datePublished = "datePublished",
    dateModified = "dateModified",
    headline = "headline",
    mainEntityOfPage = "mainEntityOfPage",
    thumbnailUrl = "thumbnailUrl",
    contentUrl = "contentUrl",
    width = "width",
    height = "height",
    itemListElement = "itemListElement",
    position = "position",
    item = "item",
    itemListOrder = "itemListOrder",
    itemList = "itemList",
    itemProp = "itemProp",
    itemtype = "itemtype",
    itemprop = "itemprop",
    itemscope = "itemscope",
    itemid = "itemid",
    works = "works",
}

export function itemType(type: MicrodataItemType) {
    return `https://schema.org/${type}`;
}
