# Get a list of random projects

GET [`/api/projects/random`](/api/projects/random)
```json
[
    {
        "icon": "https://cdn.crmm.tech/cdn/data/project/S0UHapuf5ghzmf96t2/DwtitsgLuf7yhVm91x_128.webp",
        "id": "S0UHapuf5ghzmf96t2",
        "slug": "midtone-grit",
        "name": "Pinkletwink's Mid-tone Grit",
        "summary": "A dark and gritty medieval inspired pack.",
        "type": ["resource-pack"],
        "downloads": 29,
        "followers": 0,
        "dateUpdated": "2024-12-02T19:01:16.621Z",
        "datePublished": "2024-11-29T01:55:21.902Z",
        "status": "approved",
        "visibility": "listed",
        "clientSide": "required",
        "serverSide": "unknown",
        "featuredCategories": [],
        "categories": ["16x", "blocks", "core-shaders", "realistic", "themed"],
        "gameVersions": ["0.3.7", "0.3.9"],
        "loaders": [],
        "featured_gallery": null,
        "color": "#525148"
    },
    {
        "icon": "https://cdn.crmm.tech/cdn/data/project/37zveFqapEG4kEWxBH/zRIE21kYQmhD7pEC81_128.webp",
        "id": "37zveFqapEG4kEWxBH",
        "slug": "jedos-simple-texture-pack",
        "name": "Jedo's Simple Texture Pack",
        "summary": "A texture pack that aims to be simple yet visually pleasant.",
        "type": ["resource-pack"],
        "downloads": 43,
        "followers": 0,
        "dateUpdated": "2024-12-26T04:22:26.006Z",
        "datePublished": "2024-09-21T17:50:56.298Z",
        "status": "approved",
        "visibility": "listed",
        "clientSide": "unknown",
        "serverSide": "unknown",
        "featuredCategories": [],
        "categories": ["16x", "blocks", "gui", "simplistic"],
        "gameVersions": ["0.3.1", "0.3.12"],
        "loaders": [],
        "featured_gallery": null,
        "color": "#534cdb"
    },
    ...
]
```
[Type reference](/packages/utils/src/types/api/index.ts#L142)

### Query parameters
- **Count** \
    key: `count` \
    type: `number` \
    default: `20` \
    max: `100`
