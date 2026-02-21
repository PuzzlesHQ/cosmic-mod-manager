# Get a user

GET [`/api/user/{ID|username}`](/api/user/Shfloop)

```json
{
    "id": "ah2LyusAsuzzobzcRe",
    "name": "Shfloop",
    "userName": "Shfloop",
    "role": "user",
    "avatar": "https://cdn.crmm.tech/cdn/data/user/ah2LyusAsuzzobzcRe/repqJiI8XfwnHGnMSa_128.jpeg",
    "bio": null,
    "dateJoined": "2024-09-20T21:01:23.000Z",
    "profilePageBg": null
}
```

[Type reference](/packages/utils/src/types/api/user.ts#L3)

---

## Get multiple users

GET [`/api/users?ids=ID1,ID2`](/api/users?ids=ah2LyusAsuzzobzcRe)

_`ids` is a comma-separated list, not JSON encoded._

Returns an array of user profile objects (same shape as above).

```json
[
    {
        "id": "ah2LyusAsuzzobzcRe",
        "name": "Shfloop",
        "userName": "Shfloop",
        "role": "user",
        "avatar": "https://cdn.crmm.tech/cdn/data/user/ah2LyusAsuzzobzcRe/repqJiI8XfwnHGnMSa_128.jpeg",
        "bio": null,
        "dateJoined": "2024-09-20T21:01:23.000Z",
        "profilePageBg": null
    },
    ...
]
```

### Query parameters

- **IDs** \
    key: `ids` \
    type: `string[]` \
    max: `100`

---

## Get a user's projects

GET [`/api/user/{ID|username}/projects`](/api/user/Shfloop/projects)

Returns a list of projects belonging to the given user.

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
        "gameVersions": ["0.3.16"],
        "loaders": [],
        "featured_gallery": null,
        "color": "#8a696f",
        "author": "Shfloop",
        "isOrgOwned": false
    },
    ...
]
```

[Type reference](/packages/utils/src/types/api/index.ts#L142)

:::info
Unauthenticated requests and requests from other users will only return publicly visible (listed/unlisted/archived) projects.
:::
