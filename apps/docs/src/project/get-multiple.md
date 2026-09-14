# Get multiple projects
Get multiple projects by their IDs.

GET [`/api/projects?ids=ID1,ID2`](/api/projects?ids=4xvLkWrQx2lt6Vyx6Z) \
_*ids is not json encoded, it's just a comma separated list_
```json
[
    {
        "icon": "https://cdn.crmods.org/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/ls2JTf78WZg8XCv8qx_128.webp",
        "id": "4xvLkWrQx2lt6Vyx6Z",
        "slug": "testshaders",
        "name": "TestShaders",
        "summary": "Test shaderpack for SimplyShaders mod.",
        "type": ["shader"],
        "downloads": 284,
        "followers": 0,
        "dateUpdated": "2025-02-22T01:12:19.202Z",
        "datePublished": "2024-09-20T21:05:04.240Z",
        "status": "approved",
        "visibility": "listed",
        "clientSide": "required",
        "serverSide": "unsupported",
        "featuredCategories": ["shadows", "vanilla-like"],
        "categories": ["shadows", "vanilla-like"],
        "gameVersions": ["0.3.26", "0.3.16", "0.3.15", "0.3.14", "0.3.11", "0.3.1"],
        "loaders": ["simply_shaders"],
        "featured_gallery": null,
        "color": "#8a696f",
        "author": "Shfloop",
        "isOrgOwned": false
    }
]
```
[Type reference - `ProjectListItem`](/packages/utils/src/types/api/index.ts#L142)

### Query parameters
- **IDs** \
    key: `ids` \
    type: `string[]` \
    max: `100` \
    format: `ID1,ID2,ID3` _(comma separated list)_

- **Include** _(Optional)_ \
    key: `include` \
    type: `string`
    - `version-list`: Returns an extra `versions` field for each project containing the list of versionNumber of project's versions
    - `version-slug`: Returns an extra `versions` field for each project that contains the list of `slug`s of project's versions
    - `version-info`: Returns an extra `versions` field for each project that contains list of version data (Type Reference: [ProjectVersionData](/packages/utils/src/types/api/index.ts#L124))

---

_The following query params are only applicable when `include` is set._

- **version-info-limit** _(Optional)_ \
    key: `version-info-limit` \
    type: `number` \
    default: `15` \
    _Limits the number of versions returned when `include=version-info`. This is done to prevent the response from getting gigantic_

- **Game Version** _(Optional)_ \
    key: `gameVersion` \
    type: [`string`](/api/tags/game-versions)

- **Loader** _(Optional)_ \
    key: `loader` \
    type: [`string`](/api/tags/loaders)

- **Release Channel** _(Optional)_ \
    key: `releaseChannel` \
    type: `ENUM { release | beta | alpha | dev }` \
    :::info
    _The api returns all versions that match the selected `releaseChannel` or are more stable than that, which means `releaseChannel=beta` would return `beta` versions but also `release`. To get versions from just the selected channel, suffix the value with `-only`. eg `beta-only`._
    :::