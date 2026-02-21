# Modify a project
Update a project using the API.



## Add / Update project icon

PATCH `/api/project/{ID|slug}/icon`

```json
{
    "success": true,
    "message": "Project icon updated"
}
```

REQUEST BODY: `multipart/form-data`
- **File** \
    key: `file` \
    type: `image/png` `image/jpeg` `image/webp` \
    maxSize: `512 KiB`



## Remove project icon
DELETE `/api/project/{ID|slug}/icon`

```json
{
    "success": true,
    "message": "Project icon deleted"
}
```



## Update project details
PATCH `/project/{ID|slug}`

```json
{
    "success": true,
    "message": "Project details updated",
    "slug": "project-slug"
}
```

REQUEST BODY: `multipart/form-data`
*All Fields are required. If you don't wish to update a certain field, just send the old data as is*

- **Name** \
    key: `name` \
    type: `string` \
    maxLength: `32`

- **slug** \
    key: `slug` \
    type: `string` (URL safe & lowercase)

- **Visibility** \
    key: `visibility` \
    type: [`ENUM`](/packages/utils/src/types/index.ts#L74) `{ listed | private | unlisted | archived }`

- **Type** \
    key: `type` \
    type: [`ENUM`](/packages/utils/src/types/index.ts#L44) `{ mod | modpack | shader | resource-pack | datamod | plugin }`

- **Client side** \
    key: `clientSide` \
    type: [`ENUM`](/packages/utils/src/types/index.ts#L159) `{ unknown | required | optional | unsupported }`

- **Server side** \
    key: `serverSide` \
    type: [`ENUM`](/packages/utils/src/types/index.ts#L159) `{ unknown | required | optional | unsupported }`

- **Summary** \
    key: `summary` \
    type: `string` \
    maxLength: `256`

- **Icon** \
    key: `icon` \
    type: `string | File` \
    maxSize: `512 KiB`

    *If you don't intend to update the icon, just send any string value in that form field. Sending any [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value will cause the current project icon to be deleted.*



## Update project description
PATCH `/project/{ID|slug}/description`

```json
{
    "success": true,
    "message": "Project description updated"
}
```

REQUEST BODY: `application/json`
- **Description** \
    key: `description` \
    type: `string` \
    maxLength: `65256 characters`



## Update project tags
PATCH `/project/{ID|slug}/tags`

```json
{
    "success": true,
    "message": "Project tags updated"
}
```

REQUEST BODY: `application/json`
- **Categories** \
    key: `categories` \
    type: `string[]` \
    *Check [/tags/categories](/api/tags/categories) for a list of available categories. Filter the categories list by project type using the `type` query parameter, like [/tags/categories?type=shader](/api/tags/categories?type=shader).*

- **FeaturedCategories** \
    key: `featuredCategories` \
    type: `string[]` (It must be a subset of the list of categories you provide) \
    maxLength: `3`

EXAMPLE:
```json
// For a shader
{
    "categories": ["atmosphere", "bloom", "colored-lighting", "reflections"],
    "featuredCategories": ["bloom", "reflections"]
}
```



## Update project license
PATCH `/project/{ID|slug}/license`

```json
{
    "success": true,
    "message": "Project license updated"
}
```

REQUEST BODY: `application/json`

- **Name** \
    key: `name` \
    type: `string`

- **ID** \
    key: `id` \
    type: `string`

- **Url** (optional) \
    key: `url` \
    type: `string`

:::info
If you use a [SPDX](https://spdx.org/licenses) license ID, the name and a url to spdx page will be added automatically. \
If you've a custom license and it doesn't have a SPDX ID, you can just provide the name and the url if possible. \
Check for the list of licenses here [`/tags/licenses`](/api/tags/licenses).
:::