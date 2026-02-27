# Adding your translations

Thank you for wanting to help translate! This page walks you through the full process.

:::tip Where to start
Focus on **`translation.ts`** and **`tags.ts`** first, these cover most of what a regular user will see on the site.
:::

---

## Steps

### 1. Fork the repo

Go to [github.com/PuzzlesHQ/cosmic-mod-manager/fork](https://github.com/PuzzlesHQ/cosmic-mod-manager/fork) and create your own fork. \
_(A GitHub account is required.)_

---

### 2. Register your language

Add an entry to [apps/frontend/app/locales/meta.ts](/apps/frontend/app/locales/meta.ts):

```ts
{
    code: "es",             // ISO 639-1 language code
    name: "Spanish",        // Name in English
    displayName: "Español", // Name in the language itself
    dir: "ltr",             // "ltr" (left-to-right) or "rtl" (right-to-left)
}
```

If you're adding a **regional variant** (e.g. Latin American Spanish), also include a `region` field:

```ts
{
    code: "es",
    name: "Spanish",
    displayName: "Español",
    dir: "ltr",
    region: {
        code: "419",
        name: "Latin America",
        displayName: "Latinoamérica",
    }
}
```

You can also set a `fallback` locale, when a translation key is missing, it'll try this locale before falling back to English. Useful for regional variants or closely related languages:

```ts
{
    code: "es",
    name: "Spanish",
    displayName: "Español",
    dir: "ltr",
    region: {
        code: "419",
        name: "Latin America",
        displayName: "Latinoamérica",
    },
    fallback: "fr"
}
```

> Skip this step if you're only updating an existing locale.

---

### 3. Create a folder for your locale

Under `apps/frontend/app/locales/`:
- With a region: `lang-REGION` | e.g. `es-419`
- Without a region: just `lang` | e.g. `fr`

> Skip this step if the folder already exists.

---

### 4. Edit the translations

Pick whichever method works for you:

#### Option A: Web editor

We built a translation editor for this: **[translate.crmm.tech](https://translate.crmm.tech)** \
No need to edit files manually, it shows every string alongside the reference locale in a form-like UI.

1. **Open the editor** at [translate.crmm.tech](https://translate.crmm.tech)

2. **Pick a reference locale**: what you'll read while translating. Defaults to English, but you can switch to any other existing locale. _(Note: non-English locales may have missing keys that the editor won't show.)_

3. **Load the locale to edit**: pick an existing one to update it, or leave it empty to start fresh.

4. **Translate**: fill in each string (excluding the quotes). Use the **hide translated** checkbox at the bottom to show only the missing ones (useful when updating an existing one).

5. **Save**: copy the output (or download the file) and paste it into the corresponding file on your fork. You can do this directly on GitHub in your browser without cloning anything.

   > By default the editor loads files from the main repo. If your fork has partial changes you want to build on, point the editor to your fork from the **settings icon** in the navbar.


#### Option B: Local Text editor

Recommended if you're comfortable with JavaScript/TypeScript.

1. **Clone your fork**
    ```bash
    git clone --depth 1 https://github.com/{YOUR_USERNAME}/cosmic-mod-manager
    ```

2. **Add a `translation.ts` file** in your locale folder using this template:
    ```ts
    import type { Locale } from "~/locales/types";

    export default { } satisfies Locale;
    ```
    Use `PartialLocale` instead of `Locale` if you're doing a partial override. \
    See [`app/locales/en/translation.ts`](/apps/frontend/app/locales/en/translation.ts) for keys reference.

3. **Translate the other files**: browse `apps/frontend/app/locales/en/` to see what else is there (like `tags.ts`, `about.ts`). Create matching files in your folder and import them in `translation.ts`:
    ```ts
    import type { Locale } from "~/locales/types";
    import tags from "./tags";

    export default {
        // ...
        search: {
            tags: tags,
        },
    } satisfies Locale;
    ```

    > You don't have to translate everything at once. Anything you leave out is filled in from the fallback locale.

4. **Commit and push**
    ```bash
    git add .
    git commit -m "msg_describing_what_you_added/changed"
    git push
    ```

:::tip VS Code tip
Put your cursor inside any translation object and press `Ctrl` + `Space`. VS Code will suggest all the missing keys so you don't have to cross-reference the English file manually.

_Doesn't work in browser-based VS Code. [GitHub Codespaces](https://github.com/features/codespaces) is a good alternative._
:::

---

### 5. Open a pull request

On your fork's GitHub page, click **Contribute** to open a PR against the main repo. Once it's open we'll take a look and get it merged.
