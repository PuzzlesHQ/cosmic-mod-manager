# Tags

Tags are static enumerable values used to categorize or filter projects and versions.

---

## Get categories

GET [`/api/tags/categories`](/api/tags/categories)

Returns a list of all available project categories.

```json
[
    {
        "name": "shadows",
        "projectTypes": ["shader"],
        "type": "feature",
        "isDisplayed": true
    },
    {
        "name": "realistic",
        "projectTypes": ["resource-pack", "shader"],
        "type": "category",
        "isDisplayed": true
    },
    ...
]
```

[Type reference](/packages/utils/src/constants/categories.ts#L4)

### Query parameters

- **Filter by project type** \
    key: `type` \
    type: [`ENUM`](/packages/utils/src/types/index.ts#L37) `{ mod | modpack | shader | resource-pack | datamod | plugin | world }` \
    Example: `type=shader`

- **Names only** \
    key: `namesOnly` \
    type: `true | false` \
    default: `false` \
    If `true`, returns a plain `string[]` of category names instead of full objects.

---

## Get game versions

GET [`/api/tags/game-versions`](/api/tags/game-versions)

Returns a list of all supported game versions.

```json
[
    {
        "label": "0.3.16",
        "value": "0.3.16",
        "releaseType": "release",
        "major": true
    },
    {
        "label": "0.3.15-beta.1",
        "value": "0.3.15-beta.1",
        "releaseType": "beta",
        "major": false
    },
    ...
]
```

[Type reference](/packages/utils/src/constants/game-versions.ts#L4)

---

## Get loaders

GET [`/api/tags/loaders`](/api/tags/loaders)

Returns a list of all supported loaders/platforms.

```json
[
    {
        "name": "quilt",
        "supportedProjectTypes": ["mod", "modpack", "world"]
    },
    {
        "name": "simply_shaders",
        "supportedProjectTypes": ["shader"]
    },
    ...
]
```

[Type reference](/packages/utils/src/constants/loaders.ts#L3)

### Query parameters

- **Filter by project type** \
    key: `type` \
    type: [`ENUM`](/packages/utils/src/types/index.ts#L37) `{ mod | modpack | shader | resource-pack | datamod | plugin | world }` \
    Example: `type=mod`

---

## Get licenses

GET [`/api/tags/licenses`](/api/tags/licenses)

Returns the full SPDX license list.

```json
[
    {
        "name": "MIT License",
        "licenseId": "MIT",
        "url": "https://spdx.org/licenses/MIT"
    },
    {
        "name": "Apache License 2.0",
        "licenseId": "Apache-2.0",
        "url": "https://spdx.org/licenses/Apache-2.0"
    },
    ...
]
```

[Type reference](/packages/utils/src/constants/license-list.ts#L8)

---

## Get featured licenses

GET [`/api/tags/licenses/featured`](/api/tags/licenses/featured)

Returns a curated subset of commonly used licenses.

```json
[
    {
        "name": "MIT License",
        "licenseId": "MIT",
        "url": "https://spdx.org/licenses/MIT"
    },
    ...
]
```

---

## Get a specific license

GET [`/api/tags/licenses/{ID}`](/api/tags/licenses/MIT)

Returns the full license text for a single license by its SPDX ID.

```json
{
    "name": "MIT License",
    "licenseId": "MIT",
    "url": "https://spdx.org/licenses/MIT",
    "text": "MIT License\n\nCopyright (c) ...\n\nPermission is hereby granted..."
}
```

---

## Get project types

GET [`/api/tags/project-types`](/api/tags/project-types)

Returns a list of all supported project type identifiers.

```json
["mod", "modpack", "shader", "resource-pack", "datamod", "plugin", "world"]
```

[Type reference](/packages/utils/src/types/index.ts#L37)
