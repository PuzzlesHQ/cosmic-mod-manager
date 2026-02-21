# Get an organization

GET [`/api/organization/{ID|slug}`](/api/organization/example-org)

```json
{
    "id": "Tz1NpKlMrE4aYeVWXb",
    "teamId": "nBcJdRxQpF7mKoLsAw",
    "name": "Example Organization",
    "slug": "example-org",
    "icon": "https://cdn.crmm.tech/cdn/data/organization/Tz1NpKlMrE4aYeVWXb/icon_128.webp",
    "description": "An example organization.",
    "members": [
        {
            "id": "i0KkDKYrQ31C1ljXab",
            "userId": "ah2LyusAsuzzobzcRe",
            "teamId": "nBcJdRxQpF7mKoLsAw",
            "userName": "Shfloop",
            "avatar": "https://cdn.crmm.tech/cdn/data/user/ah2LyusAsuzzobzcRe/repqJiI8XfwnHGnMSa_128.jpeg",
            "role": "Owner",
            "isOwner": true,
            "accepted": true,
            "permissions": [],
            "organisationPermissions": []
        }
    ]
}
```

[Type reference](/packages/utils/src/types/api/index.ts#L164)

---

## Get an organization's projects

GET [`/api/organization/{ID|slug}/projects`](/api/organization/example-org/projects)

Returns a list of projects owned by the organization. Same shape as [Get a user's projects](/user/get.html#get-a-user-s-projects).

---

## Get multiple organizations

GET [`/api/organizations?ids=ID1,ID2`](/api/organizations?ids=Tz1NpKlMrE4aYeVWXb)

_`ids` is a comma-separated list, not JSON encoded._

Returns an array of organization objects (same shape as above).

### Query parameters

- **IDs** \
    key: `ids` \
    type: `string[]` \
    max: `100`

---

## Get user's organizations

GET `/api/organization` _(returns the current user's organizations)_ \
GET `/api/user/{userId}/organization` _(returns a specific user's organizations)_

Returns a list of organizations the user is a member of. Same shape as [Get an organization](#get-an-organization) above.

:::info Authentication required
The `/api/organization` route (without a user ID) requires authentication.
:::
