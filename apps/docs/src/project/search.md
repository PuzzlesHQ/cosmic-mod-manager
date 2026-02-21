# Search projects

GET [`/api/search?q=shader`](/api/search?q=shader)

```json
"hits": [
    {
        "id": "4xvLkWrQx2lt6Vyx6Z",
        "slug": "testshaders",
        "name": "TestShaders",
        "summary": "Test shaderpack for SimplyShaders mod",
        "type": ["shader"],
        "icon": "https://cdn.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/ls2JTf78WZg8XCv8qx_128.webp",
        "downloads": 44,
        "followers": 0,
        "dateUpdated": "2025-01-11T20:08:26.562Z",
        "datePublished": "2024-09-20T21:05:04.240Z",
        "categories": ["shadows", "vanilla-like"],
        "featuredCategories": ["shadows", "vanilla-like"],
        "gameVersions": ["0.3.16", "0.3.15", "0.3.14", "0.3.11", "0.3.1"],
        "loaders": [],
        "author": "Shfloop",
        "featured_gallery": "https://cdn.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/gallery/dJH8_ag7j_waPvPfYu_420.webp",
        "color": "#8a696f",
        "isOrgOwned": false,
        "visibility": "listed"
    },
    ...
],
"query": "shader",
"processingTimeMs": 3,
"limit": 20,
"offset": 0,
"estimatedTotalHits": 3
```
[Type reference](/packages/utils/src/types/api/index.ts#L142)

### Query Parameters

- **Query** \
    key: `q` \
    type: `string` \
    Example: `q=zoom`

- **Sortby** \
    key: `sortby` \
    type: [`ENUM`](/packages/utils/src/types/index.ts#L173) `{ relevance | downloads | follow_count | recently_updated | recently_published }` \
    default: `relevance` \
    Example: `sortby=downloads`

- **Limit** \
    key: `limit` \
    type: `number` \
    default: `20` \
    max: `100` \
    Example: `limit=50`

- **Offset** \
    key: `offset` \
    type: `number` \
    Example: `offset=20`

- **Page** \
    key: `page` \
    type: `number` \
    Example: `page=3`

    *Please note that the `page` value will be ignored if you provide an `offset` also.*

#### Filters

- **Type** \
    key: `type` \
    type: [`ENUM`](/packages/utils/src/types/index.ts#L44) `{ mod | modpack | shader | resource-pack | datamod | plugin }` \
    Example: `type=mod`

- **Loader** \
    key: `l` \
    type: [`ENUM`](/api/tags/loaders) \
    Example: `l=quilt`

- **Game version** \
    key: `v` \
    type: [`ENUM`](/api/tags/game-versions) \
    Example: `v=0.3.1`

- **Category** \
    key: `c` \
    type: [`ENUM`](/api/tags/categories) \
    Example: `c=realistic&c=64x`

:::info
*You can use the endpoint `/tags/categories` to get categories based on project types also.
For example, [`/tags/categories?type=mod`](/api/tags/categories?type=mod) returns all the categories applicable to mods.*
:::