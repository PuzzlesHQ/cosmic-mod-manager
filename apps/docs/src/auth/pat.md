# Personal Access Tokens (PATs)

Personal Access Tokens let you authenticate API requests without a browser session. Each token has an expiry date and a set of scopes that limit what it can do.

::: info Authentication required
Creating, editing, and deleting PATs requires a valid session. PAT management cannot be done with a PAT itself (restricted scopes).
:::

---

## Using a PAT

Pass the token value in the `Authorization` header of your request:

```bash
curl -X PATCH \
  --header "Authorization: YOUR_PAT_TOKEN" \
  --form "icon=@./icon.webp" \
  https://api.crmm.tech/api/project/my-project/icon
```

---

## List your PATs

GET `/api/pat`

```json
[
    {
        "id": "pBcJdRxQpF7mKoLsAw",
        "name": "CI deploy token",
        "userId": "ah2LyusAsuzzobzcRe",
        "scopes": ["project_read", "version_create", "version_write"],
        "dateCreated": "2025-10-01T12:00:00.000Z",
        "dateExpires": "2026-10-01T00:00:00.000Z",
        "dateLastUsed": "2026-02-20T08:44:12.000Z"
    },
    ...
]
```

[Type reference](/packages/utils/src/types/api/pat.ts#L3)

---

## Create a PAT

POST `/api/pat`

The `token` value is **only returned once** at creation time. Store it securely.

```json
{
    "id": "pBcJdRxQpF7mKoLsAw",
    "name": "CI deploy token",
    "userId": "ah2LyusAsuzzobzcRe",
    "scopes": ["project_read", "version_create", "version_write"],
    "dateCreated": "2025-10-01T12:00:00.000Z",
    "dateExpires": "2026-10-01T00:00:00.000Z",
    "dateLastUsed": null,
    "token": "crmm_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

REQUEST BODY: `application/json`

- **Name** \
    key: `name` \
    type: `string` \
    minLength: `1`, maxLength: `64`

- **Expiry date** \
    key: `dateExpires` \
    type: `string` (ISO 8601 date, e.g. `"2027-01-01"`) \
    Must be in the future.

- **Scopes** \
    key: `authScopes` \
    type: [`API_SCOPE[]`](/packages/utils/src/pats.ts#L2)

---

## Update a PAT

PATCH `/api/pat/{patId}`

Accepts the same body as [Create a PAT](#create-a-pat). Returns the updated PAT object (without the `token` field).

---

## Delete a PAT

DELETE `/api/pat/{patId}`

```json
{
    "success": true,
    "message": "PAT deleted successfully"
}
```

---

## Available scopes

The following scopes can be granted to a PAT. Some scopes are **restricted** and can't be assigned to a PAT at all, they are only available to browser sessions.

| Scope | Description |
|:------|:------------|
| `user_read` | Read public user profile data |
| `user_read_email` | Read your email address |
| `user_write` | Update your profile |
| `user_write_email` | Update your email address |
| `project_create` | Create new projects |
| `project_read` | Read project data |
| `project_write` | Edit projects |
| `project_delete` | Delete projects |
| `version_create` | Upload new versions |
| `version_read` | Read version data |
| `version_write` | Edit versions |
| `version_delete` | Delete versions |
| `organization_create` | Create organizations |
| `organization_read` | Read organization data |
| `organization_write` | Edit organizations |
| `organization_delete` | Delete organizations |
| `collection_create` | Create collections |
| `collection_read` | Read collections |
| `collection_write` | Edit collections |
| `collection_delete` | Delete collections |
| `notification_read` | Read notifications |
| `notification_write` | Mark notifications as read |
| `notification_delete` | Delete notifications |
| `report_create` | Submit reports |
| `report_read` | Read reports |
| `report_write` | Edit reports |
| `report_delete` | Delete reports |
| `thread_read` | Read discussion threads |
| `thread_write` | Post to discussion threads |

::: warning Restricted scopes
The following scopes are **not available to PATs** and are reserved for browser sessions only: `pat_create`, `pat_read`, `pat_write`, `pat_delete`, `user_session_read`, `user_session_delete`, `user_auth_write`, `user_delete`, `analytics_read`.
:::

[Full scope reference](/packages/utils/src/pats.ts#L2)
