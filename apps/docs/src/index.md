---
outline: deep
---


# Introduction

Welcome to the documentation of CRMM api!

### Important links
- GitHub repo: [https://github.com/PuzzlesHQ/cosmic-mod-manager](https://github.com/PuzzlesHQ/cosmic-mod-manager)
- Website URL: [https://crmm.tech](https://crmm.tech)
- API URL: [https://api.crmm.tech/api](https://api.crmm.tech/api)

Also, you can check the API Rate Limits [here](/apps/backend/src/middleware/rate-limit/limits.ts).

<br />

### Authentication

As of now, there's no implementation of PATs, so you'll have to use your cookie for authentication for the time being.

Example:
```bash
curl -X PATCH \
--header "Cookie: auth-token=g5myuyngq3vsgu23afuuzorbecuebndhkbwckoy" \
--form "icon=@./Pictures/iris logo.webp" \
https://api.crmm.tech/api/project/iris/icon
```

### How to get the authToken

*Please note that as of now there's no implementation of PATs, so we will be using your user session token for authentication.*

- Visit [api.crmm.tech](https://api.crmm.tech/api) and open dev tools (press `ctrl` `shift` `i`), also make sure you are logged in else you'd need to [login](https://crmm.tech/login) first.
- Go to the `network` tab and refresh the page (`f5`)
- Click on the first request made to the server
- Scroll down in `headers` section and find `Cookie:`
- Copy the `auth-token=YOUR_AUTH_TOKEN` part of the cookie.
- There you have it, remove the `auth-token=` part and paste the rest in the config