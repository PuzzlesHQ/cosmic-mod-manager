# API Endpoints
A list of all the available backend API endpoints.

-------------

Base URL: `https://api.crmm.tech/api` <br />
NOTE:- `/cdn` urls are not under the base `/api`

### Value Types
* [`AuthProvider`](/packages/utils/src/types/index.ts#L13) &ndash; github, gitlab, discord, google

### Search Endpoints
| Type   | Endpoint  |
|:-------|:----------|
| GET    | [`/search`](/apps/backend/src/routes/search/router.ts#L26) |
| GET    | [`/search/filters/sort-by`](/apps/backend/src/routes/search/router.ts#L26) |
| GET    | [`/search/filters/loaders`](/apps/backend/src/routes/search/router.ts#L26) |
| GET    | [`/search/filters/game-versions`](/apps/backend/src/routes/search/router.ts#L26) |
| GET    | [`/search/filters/categories`](/apps/backend/src/routes/search/router.ts#L26) |
| GET    | [`/search/filters/features`](/apps/backend/src/routes/search/router.ts#L26) |
| GET    | [`/search/filters/resolutions`](/apps/backend/src/routes/search/router.ts#L26) |
| GET    | [`/search/filters/performance-impact`](/apps/backend/src/routes/search/router.ts#L26) |
| GET    | [`/search/filters/license`](/apps/backend/src/routes/search/router.ts#L26) |

### Tags Endpoints
| Type   | Endpoint  |
|:-------|:----------|
| GET    | [`/tags/categories`](/apps/backend/src/routes/tags.ts#L13) |
| GET    | [`/tags/game-versions`](/apps/backend/src/routes/tags.ts#L13) |
| GET    | [`/tags/loaders`](/apps/backend/src/routes/tags.ts#L13) |
| GET    | [`/tags/licenses`](/apps/backend/src/routes/tags.ts#L13) |
| GET    | [`/tags/licenses/featured`](/apps/backend/src/routes/tags.ts#L13) |
| GET    | [`/tags/licenses/{ID}`](/apps/backend/src/routes/tags.ts#L13) |
| GET    | [`/tags/project-types`](/apps/backend/src/routes/tags.ts#L13) |

### Project Endpoints
| Type   | Endpoint  |
|:-------|:----------|
| GET    | [`/project`](/apps/backend/src/routes/project/router.ts#L32) |
| GET    | [`/projects`](/apps/backend/src/routes/project/bulk_router.ts#L9) |
| GET    | [`/projects/random`](/apps/backend/src/routes/project/bulk_router.ts#L9) |
| GET    | [`/project/{ID\|slug}`](/apps/backend/src/routes/project/router.ts#L32) |
| GET    | [`/project/{ID\|slug}/dependencies`](/apps/backend/src/routes/project/router.ts#L32) |
| GET    | [`/project/{ID\|slug}/check`](/apps/backend/src/routes/project/router.ts#L32) |
| POST   | [`/project`](/apps/backend/src/routes/project/router.ts#L32) |
| PATCH  | [`/project/{ID}`](/apps/backend/src/routes/project/router.ts#L32) |
| DELETE | [`/project/{ID}`](/apps/backend/src/routes/project/router.ts#L32) |
| PATCH  | [`/project/{ID}/icon`](/apps/backend/src/routes/project/router.ts#L32) |
| DELETE | [`/project/{ID}/icon`](/apps/backend/src/routes/project/router.ts#L32) |
| PATCH  | [`/project/{ID}/description`](/apps/backend/src/routes/project/router.ts#L32) |
| PATCH  | [`/project/{ID}/tags`](/apps/backend/src/routes/project/router.ts#L32) |
| PATCH  | [`/project/{ID}/external-links`](/apps/backend/src/routes/project/router.ts#L32) |
| PATCH  | [`/project/{ID}/license`](/apps/backend/src/routes/project/router.ts#L32) |
| POST   | [`/project/{ID}/gallery`](/apps/backend/src/routes/project/router.ts#L32) |
| PATCH  | [`/project/{ID}/gallery/{ID}`](/apps/backend/src/routes/project/router.ts#L32) |
| DELETE | [`/project/{ID}/gallery/{ID}`](/apps/backend/src/routes/project/router.ts#L32) |

### Version Endpoints
| Type   | Endpoint  |
|:-------|:----------|
| GET    | [`/project/{ID\|slug}/version`](/apps/backend/src/routes/project/version/router.ts#L14) |
| GET    | [`/project/{ID\|slug}/version/{ID\|slug}`](/apps/backend/src/routes/project/version/router.ts#L14) |
| GET    | [`/project/{ID\|slug}/version/latest`](/apps/backend/src/routes/project/version/router.ts#L14) |
| GET    | [`/project/{ID\|slug}/version/{ID\|slug}/primary-file`](/apps/backend/src/routes/project/version/router.ts#L14) |
| GET    | [`/project/{ID\|slug}/version/latest/primary-file`](/apps/backend/src/routes/project/version/router.ts#L14) |
| POST   | [`/project/{ID}/version`](/apps/backend/src/routes/project/version/router.ts#L14) |
| PATCH  | [`/project/{ID}/version/{ID\|slug}`](/apps/backend/src/routes/project/version/router.ts#L14) |
| DELETE | [`/project/{ID}/version/{ID\|slug}`](/apps/backend/src/routes/project/version/router.ts#L14) |

### Version File Endpoints
| Type   | Endpoint  |
|:-------|:----------|
| GET    | [`/version-file/{hash}`](/apps/backend/src/routes/version-file/router.ts#L22) |
| GET    | [`/version-file/{hash}/download`](/apps/backend/src/routes/version-file/router.ts#L23) |
| POST   | [`/version-file/{hash}/update`](/apps/backend/src/routes/version-file/router.ts#L23) |
| POST   | [`/version-files`](/apps/backend/src/routes/version-file/router.ts#L100) |
| POST   | [`/version-files/update`](/apps/backend/src/routes/version-file/router.ts#L100) |

### Team Endpoints
| Type   | Endpoint  |
|:-------|:----------|
| POST   | [`/team/{ID}/invite`](/apps/backend/src/routes/project/team/router.ts#L20) |
| PATCH  | [`/team/{ID}/invite`](/apps/backend/src/routes/project/team/router.ts#L20) |
| POST   | [`/team/{ID}/leave`](/apps/backend/src/routes/project/team/router.ts#L20) |
| PATCH  | [`/team/{ID}/member/{ID}`](/apps/backend/src/routes/project/team/router.ts#L20) |
| DELETE | [`/team/{ID}/member/{ID}`](/apps/backend/src/routes/project/team/router.ts#L20) |

### User Endpoints
| Type   | Endpoint  |
|:-------|:----------|
| GET    | [`/user`](/apps/backend/src/routes/user/router.ts#L34) |
| GET    | [`/users`](/apps/backend/src/routes/user/bulk_actions/router.ts#L7) |
| GET    | [`/user/{ID\|username}`](/apps/backend/src/routes/user/router.ts#L34) |
| GET    | [`/user/{ID\|username}/projects`](/apps/backend/src/routes/user/router.ts#L34) |
| PATCH  | [`/user`](/apps/backend/src/routes/user/router.ts#L34) |
| DELETE | [`/user`](/apps/backend/src/routes/user/router.ts#L34) |
| POST   | [`/user/delete-account`](/apps/backend/src/routes/user/router.ts#L34) |
| POST   | [`/user/confirmation-action`](/apps/backend/src/routes/user/router.ts#L34) |
| DELETE | [`/user/confirmation-action`](/apps/backend/src/routes/user/router.ts#L34) |
| POST   | [`/user/password`](/apps/backend/src/routes/user/router.ts#L34) |
| PUT    | [`/user/password`](/apps/backend/src/routes/user/router.ts#L34) |
| DELETE | [`/user/password`](/apps/backend/src/routes/user/router.ts#L34) |
| POST   | [`/user/change-password`](/apps/backend/src/routes/user/router.ts#L34) |
| PATCH  | [`/user/password`](/apps/backend/src/routes/user/router.ts#L34) |

### Auth Endpoints
| Type   | Endpoint  |
|:-------|:----------|
| GET    | [`/auth/me`](/apps/backend/src/routes/auth/router.ts#L28) |
| GET    | [`/auth/signin/{AuthProvider}`](/apps/backend/src/routes/auth/router.ts#L28) |
| GET    | [`/auth/signup/{AuthProvider}`](/apps/backend/src/routes/auth/router.ts#L28) |
| GET    | [`/auth/link/{AuthProvider}`](/apps/backend/src/routes/auth/router.ts#L28) |
| POST   | [`/auth/signin/credential`](/apps/backend/src/routes/auth/router.ts#L28) |
| POST   | [`/auth/signin/{AuthProvider}`](/apps/backend/src/routes/auth/router.ts#L28) |
| POST   | [`/auth/signup/{AuthProvider}`](/apps/backend/src/routes/auth/router.ts#L28) |
| POST   | [`/auth/link/{AuthProvider}`](/apps/backend/src/routes/auth/router.ts#L28) |
| DELETE | [`/auth/link/{AuthProvider}`](/apps/backend/src/routes/auth/router.ts#L28) |
| GET    | [`/auth/sessions`](/apps/backend/src/routes/auth/router.ts#L28) |
| GET    | [`/auth/auth-providers`](/apps/backend/src/routes/auth/router.ts#L28) |
| DELETE | [`/auth/sessions`](/apps/backend/src/routes/auth/router.ts#L28) |
| DELETE | [`/auth/sessions/{RevokeCode}`](/apps/backend/src/routes/auth/router.ts#L28) |

### CDN Endpoints
| Type   | Endpoint  |
|:-------|:----------|
| GET    | [`/cdn/data/project/{projectID}/{FILE_NAME}`](/apps/backend/src/routes/cdn/router.ts#L22) |
| GET    | [`/cdn/data/project/{projectID}/gallery/{FILE_NAME}`](/apps/backend/src/routes/cdn/router.ts#L22) |
| GET    | [`/cdn/data/project/{projectID}/version/{versionID}/{FILE_NAME}`](/apps/backend/src/routes/cdn/router.ts#L22) |
| GET    | [`/cdn/data/organization/{orgID}/{FILE_NAME}`](/apps/backend/src/routes/cdn/router.ts#L22) |
| GET    | [`/cdn/data/user/{userID}/{FILE_NAME}`](/apps/backend/src/routes/cdn/router.ts#L22) |