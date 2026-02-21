---
outline: deep
---

# Introduction

Welcome to the CRMM API documentation.

### Important links
- GitHub: [https://github.com/PuzzlesHQ/cosmic-mod-manager](https://github.com/PuzzlesHQ/cosmic-mod-manager)
- Website: [https://crmm.tech](https://crmm.tech)
- API base URL: [https://api.crmm.tech/api](https://api.crmm.tech/api)
- Rate limit reference: [limits.ts](/apps/backend/src/middleware/rate-limit/limits.ts)

---

## Authentication

Most read endpoints are public and require no authentication. Write endpoints require either a **Personal Access Token (PAT)** or a browser session cookie.

### Personal Access Tokens (recommended)

For scripts and apps, PATs are preferred. Create one on the [CRMM settings page](https://crmm.tech/settings/account) and pass it in the `Authorization` header:

```bash
curl -X PATCH \
  --header "Authorization: YOUR_PAT_TOKEN" \
  --form "icon=@./icon.webp" \
  https://api.crmm.tech/api/project/my-project/icon
```

See the [PAT documentation](/auth/pat) for available scopes and the full management API.

### Session cookie (browser / manual testing)

You can also use your browser session token in a `Cookie` header. Mostly useful for quick manual testing.

```bash
curl -X PATCH \
  --header "Cookie: auth-token=YOUR_SESSION_TOKEN" \
  --form "icon=@./icon.webp" \
  https://api.crmm.tech/api/project/my-project/icon
```

**How to find your session token:**
1. Log in at [crmm.tech](https://crmm.tech).
2. Open DevTools (`Ctrl`+`Shift`+`I`) and go to the **Network** tab.
3. Refresh the page and click the first request to `api.crmm.tech`.
4. In the **Headers** section, find the `Cookie:` entry.
5. Copy the value of `auth-token` (everything after `auth-token=` up to the next `;`).