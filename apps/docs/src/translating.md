# Adding your translations

Thank you for wanting to help translate! There are two ways to contribute:

- **[Using the web editor](#using-the-web-editor)**
- **[Using a code/text editor](#editing-files-with-a-text-editor)** (if you're comfortable with a code editor and git)

:::tip Where to start
Focus on **`translation.ts`** and **`tags.ts`** first because these two contain translations for most of the parts a regular user will interface with.
:::

---

## Using the web editor

We built a dedicated translation editor just for this: **[translate.crmm.tech](https://translate.crmm.tech)**

It shows translation strings side by side. Pick any existing locale as the reference (English by default), and on the other side select "New locale" or load whatever locale you want to work on.

### Steps

1. **Open the editor** at [translate.crmm.tech](https://translate.crmm.tech)

2. **Pick a reference locale**: what you'll read while translating. Defaults to English, but you can switch to any other existing locale. (Please note that locales other than english may have missing keys which the editor won't show)

3. **Load the locale to edit**: either pick an existing one to update it, or leave it to default start a new language from scratch.

4. **Translate**: fill in each string (excluding the quotes). Check the **hide translated** checkbox at the bottom to show only keys with missing translation.

5. **Fork the repo** if you haven't already — [github.com/PuzzlesHQ/cosmic-mod-manager/fork](https://github.com/PuzzlesHQ/cosmic-mod-manager/fork) \
   _(A free GitHub account is required. Forking is needed to submit a pull request.)_

6. **Save your changes**: copy the output from the editor (or download the file), then paste it into the corresponding file on your fork (create it under your locale's folder if it doesn't exist). \
   _(You can edit files directly on GitHub in your browser — no need to download anything)_

   > By default the editor loads translation files from the main repo, which is fine for most cases. If you have a fork with partial changes already in it, you can point the editor to your fork instead from the **settings icon** in the navbar.

7. **Open a pull request** — on your fork's GitHub page, click **Contribute** to submit for review

Once you open the PR we'll take a look and get it merged.

---

## Editing files with a text-editor
This is recommended only if you know a lil bit of javascript/typescript, otherwise you should go the web editor way.

### What you'll need

- A [GitHub](https://github.com) account
- [Git](https://git-scm.com/) installed
- A text editor, preferably one that supports `Typescript` like VS Code or Zed, but you can choose whatever you're comfortable with.

### Steps

1. **Fork and clone the repo**
    ```bash
    git clone --depth 1 https://github.com/{YOUR_USERNAME}/cosmic-mod-manager
    ```

2. **Register your language** by adding an entry in [apps/frontend/app/locales/meta.ts](/apps/frontend/app/locales/meta.ts):
    ```ts
    {
        code: "es",            // ISO 639-1 language code
        name: "Spanish",       // Name in English
        nativeName: "Español", // Name in the language itself
        dir: "ltr",            // "ltr" (left-to-right) or "rtl" (right-to-left)
    },
    ```

    Adding a **regional variant** (e.g. Latin American Spanish)? Also include a `region` field:
    ```ts
    {
        code: "es",
        name: "Spanish",
        nativeName: "Español",
        dir: "ltr",
        region: {
            code: "419",
            name: "Latin America",
            displayName: "Latinoamérica",
        },
    },
    ```

3. **Create a folder** for your locale under `apps/frontend/app/locales/`:
    - With a region: `{lang}-{REGION}` — e.g. `es-419`
    - Without a region: just `{lang}` — e.g. `fr`

4. **Add a `translation.ts` file** inside your new folder starting with this template:
    ```ts
    import type { Locale } from "~/locales/types";

    export default { } satisfies Locale;
    ```
    Use [`app/locales/en/translation.ts`](/apps/frontend/app/locales/en/translation.ts) as a reference for what to fill in.

5. **Translate the rest**: Browse `apps/frontend/app/locales/en/` to see all the other files (like `tags.ts`, `about.ts`). Create matching files in your folder and import them in `translation.ts`:
    ```ts
    import tags from "./tags";

    export default {
        // ...
        search: {
            tags: tags,
        },
    } satisfies Locale;
    ```

    > You don't have to translate everything at once. Anything you leave out falls back to English automatically.

6. **Commit and push** your changes:
    ```bash
    git add .
    git commit -m "msg_describing_what_you_added/changed"
    git push
    ```

7. **Open a pull request** on your fork's GitHub page by clicking **Contribute**.

### Tip for VS Code users

Put your cursor inside a translation object and press `Ctrl` + `Space`. VS Code will list all the missing keys so you don't have to hunt through the English file.

> _Doesn't work in browser-based VS Code. [GitHub Codespaces](https://github.com/features/codespaces) is a good alternative if you don't have it installed locally._
