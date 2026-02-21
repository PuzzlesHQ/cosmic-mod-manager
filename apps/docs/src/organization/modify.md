# Create an organization

::: info Authentication required
These endpoints require a valid session or PAT with the appropriate `ORGANIZATION_*` scope.
:::

POST `/api/organization`

```json
{
    "success": true,
    "slug": "new-org-slug"
}
```

REQUEST BODY: `application/json`

- **Name** \
    key: `name` \
    type: `string` \
    minLength: `2`, maxLength: `64`

- **Slug** \
    key: `slug` \
    type: `string` \
    Must be URL-safe. minLength: `2`, maxLength: `64`

- **Description** \
    key: `description` \
    type: `string` \
    minLength: `5`, maxLength: `256`

---

## Update an organization

PATCH `/api/organization/{ID}`

REQUEST BODY: `multipart/form-data`

- **Name** \
    key: `name` \
    type: `string` \
    minLength: `2`, maxLength: `64`

- **Slug** \
    key: `slug` \
    type: `string` \
    Must be URL-safe.

- **Description** \
    key: `description` \
    type: `string` \
    maxLength: `256`

- **Icon** \
    key: `icon` \
    type: [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) | `string` | `null` \
    Pass a file to update the icon. Pass any string to keep the current one. Pass `null` to remove it.

---

## Delete an organization

DELETE `/api/organization/{ID}`

Permanently deletes the organization. All projects owned by it must be removed first.

```json
{
    "success": true,
    "message": "Organization deleted successfully"
}
```

---

## Add a project to an organization

POST `/api/organization/{ID}/projects`

REQUEST BODY: `application/json`

- **Project ID** \
    key: `projectId` \
    type: `string`

```json
{
    "success": true,
    "message": "Project added to organization"
}
```

---

## Remove a project from an organization

DELETE `/api/organization/{orgId}/project/{projectId}`

```json
{
    "success": true,
    "message": "Project removed from organization"
}
```
