# Team Management

Teams are shared between projects and organizations. Each project and organization has a `teamId` field that identifies its team.

::: info Authentication required
All team endpoints require a valid session or PAT with the appropriate scope.
:::

---

## Invite a member

POST `/api/team/{teamId}/invite`

Invites a user to a team by username. The invited user will receive a pending invite that they must accept.

REQUEST BODY: `application/json`

- **Username** \
    key: `userName` \
    type: `string`

```json
{
    "success": true,
    "message": "Invitation sent"
}
```

---

## Accept a team invite

PATCH `/api/team/{teamId}/invite`

Accepts a pending team invitation for the currently authenticated user.

```json
{
    "success": true,
    "message": "Invitation accepted"
}
```

---

## Leave a team

POST `/api/team/{teamId}/leave`

Removes the currently authenticated user from the team. The team owner cannot leave; ownership must be transferred first.

```json
{
    "success": true,
    "message": "Left the team"
}
```

---

## Update a team member

PATCH `/api/team/{teamId}/member/{memberId}`

Updates a team member's role and permissions.

REQUEST BODY: `application/json`

- **Role** \
    key: `role` \
    type: `string` \
    maxLength: `64` \
    A display label for the member's role (e.g. `"Developer"`, `"Translator"`).

- **Permissions** \
    key: `permissions` \
    type: [`ProjectPermission[]`](/packages/utils/src/types/index.ts#L96) \
    Available values: `upload_version`, `delete_version`, `edit_details`, `edit_description`, `manage_invites`, `remove_member`, `edit_member`, `delete_project`, `view_analytics`, `view_revenue`

- **Organisation permissions** \
    key: `organisationPermissions` \
    type: [`OrganisationPermission[]`](/packages/utils/src/types/index.ts#L109) \
    Available values: `edit_details`, `manage_invites`, `remove_member`, `edit_member`, `add_project`, `remove_project`, `delete_organization`, `edit_member_default_permissions` \
    _Only applies when the team belongs to an organization._

```json
{
    "success": true,
    "message": "Member updated"
}
```

---

## Remove a team member

DELETE `/api/team/{teamId}/member/{memberId}`

Removes a member from the team.

```json
{
    "success": true,
    "message": "Member removed"
}
```

---

## Transfer team ownership

PATCH `/api/team/{teamId}/owner`

Transfers ownership of the team to another member.

REQUEST BODY: `application/json`

- **New owner's user ID** \
    key: `userId` \
    type: `string`

```json
{
    "success": true,
    "message": "Ownership transferred"
}
```
