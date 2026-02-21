# Get a project by ID or slug

GET [`/api/project/{ID|slug}`](/api/project/4xvLkWrQx2lt6Vyx6Z)

```json
"success": true,
"project": {
    "id": "4xvLkWrQx2lt6Vyx6Z",
    "teamId": "v3QTbnu6UcfGUrYADq",
    "orgId": null,
    "name": "TestShaders",
    "icon": "https://cdn.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/ls2JTf78WZg8XCv8qx_128.webp",
    "status": "approved",
    "requestedStatus": null,
    "summary": "Test shaderpack for SimplyShaders mod",
    "description": "Work in Progress shaderpack\n- not a whole lot going on \n- test shaders for Simply Shaders \n### Shaderpack format will likely change as updates come out\nCurrent Version: 6 - compatible with SimplyShaders 1.1.4-1.1.5\n\n\n## How to use\n* Install Simply Shaders quilt or puzzle\n* add shaderpacks into /mods/shaderpacks/   -since v1.1.4\n  * previously in /mods/assets/shaders/\n* find the shader button (bottom left of options menu) \n* select shader pack and enable it ",
    "type": ["shader"],
    "categories": ["shadows", "vanilla-like"],
    "featuredCategories": ["shadows", "vanilla-like"],
    "licenseId": "LGPL-3.0",
    "licenseName": "GNU Lesser General Public License v3.0 only",
    "licenseUrl": "",
    "dateUpdated": "2025-01-11T20:08:26.562Z",
    "datePublished": "2024-09-20T21:05:04.240Z",
    "downloads": 44,
    "followers": 0,
    "slug": "testshaders",
    "visibility": "listed",
    "issueTrackerUrl": null,
    "projectSourceUrl": null,
    "projectWikiUrl": null,
    "discordInviteUrl": null,
    "clientSide": "unknown",
    "serverSide": "unknown",
    "loaders": [],
    "gameVersions": ["0.3.16", "0.3.15", "0.3.14", "0.3.11", "0.3.1"],
    "gallery": [
        {
            "id": "gGK0EPMayW9ioNBm7K",
            "name": "Shaders",
            "description": "64 chunk render distance ",
            "image": "https://cdn.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/gallery/s2y6xAQzAslF04YaUb",
            "imageThumbnail": "https://cdn.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/gallery/dJH8_ag7j_waPvPfYu_420.webp",
            "featured": true,
            "dateCreated": "2024-09-21T16:33:01.832Z",
            "orderIndex": 1
        }
    ],
    "members": [
        {
            "id": "i0KkDKYrQ31C1ljXab",
            "userId": "ah2LyusAsuzzobzcRe",
            "teamId": "v3QTbnu6UcfGUrYADq",
            "userName": "Shfloop",
            "avatar": "https://cdn.crmm.tech/cdn/data/user/ah2LyusAsuzzobzcRe/repqJiI8XfwnHGnMSa_128.jpeg",
            "role": "Owner",
            "isOwner": true,
            "accepted": true,
            "permissions": [],
            "organisationPermissions": []
        }
    ],
    "organisation": null
}
```

[Type reference](/packages/utils/src/types/api/index.ts#L52)


### Query parameters
- **Include Project Versions** \
    key: `includeVersions` \
    type: `true | false` \
    default: `false`

:::info
If `true`, the API returns an additional `versions` field in the project object which contains the [project's versions list](/version/get-project-versions.html).
:::

- **Featured versions only** \
    key: `featuredOnly` \
    type: `true | false` \
    default: `false`