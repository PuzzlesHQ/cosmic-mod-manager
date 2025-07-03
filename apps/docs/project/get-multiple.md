# Get multiple projects
Get multiple projects by their IDs.

GET [`/api/projects?ids=ID1,ID2`](/api/projects?ids=4xvLkWrQx2lt6Vyx6Z) \
_*ids is not json encoded, it's just a comma separated list_
```json
[
    {
        "icon": "https://cdn.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/ls2JTf78WZg8XCv8qx_128.webp",
        "id": "4xvLkWrQx2lt6Vyx6Z",
        "slug": "testshaders",
        "name": "TestShaders",
        "summary": "Test shaderpack for SimplyShaders mod",
        "type": ["shader"],
        "downloads": 44,
        "followers": 0,
        "dateUpdated": "2025-01-11T20:08:26.562Z",
        "datePublished": "2024-09-20T21:05:04.240Z",
        "status": "approved",
        "visibility": "listed",
        "clientSide": "unknown",
        "serverSide": "unknown",
        "featuredCategories": ["shadows", "vanilla-like"],
        "categories": ["shadows", "vanilla-like"],
        "gameVersions": ["0.3.16", "0.3.15", "0.3.14", "0.3.11", "0.3.1"],
        "loaders": [],
        "featured_gallery": null,
        "color": "#8a696f"
    }
]
```
[Type reference](/packages/utils/src/types/api/index.ts#L142)

### Query parameters
- **IDs** \
    key: `ids` \
    type: `string[]` \
    max: `100`
