# Update your profile

::: info Authentication required
These endpoints require a valid session or PAT with the `USER_WRITE` scope.
:::

PATCH `/api/user`

REQUEST BODY: `multipart/form-data`

```json
{
    "success": true,
    "message": "User profile updated successfully"
}
```

### Fields

- **Display name** \
    key: `name` \
    type: `string | null` \
    maxLength: `64`

- **Username** \
    key: `userName` \
    type: `string` \
    maxLength: `32` \
    Must be URL-safe (lowercase letters, numbers, hyphens).

- **Bio** \
    key: `bio` \
    type: `string | null` \
    maxLength: `256`

- **Avatar** \
    key: `avatar` \
    type: [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) | `string` | `null` \
    Pass a file to update the avatar. Pass any string to keep the current one. Pass `null` to remove it. \
    Supported formats: any image type. The server converts it to WebP.

- **Profile page background** \
    key: `profilePageBg` \
    type: [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) | `string` | `null` \
    Pass null to remove the existing background. Pass any other non-empty string to keep the existing background. Pass a file to set a new one. \
    Supported formats: image or video files.
