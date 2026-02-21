# Adding your translations

1. **Fork the repo https://github.com/PuzzlesHQ/cosmic-mod-manager/fork**

2. **Clone your fork locally with git:** \
    _The command looks something like this, you can just copy the fork's url from the browser's address bar_
    ```bash
    git clone --depth 1 https://github.com/{YOUR_USERNAME}/cosmic-mod-manager
    ```

    > NOTE: If you just want to edit an existing translation file, you can do that directly from [GitHub](https://github.com/PuzzlesHQ/cosmic-mod-manager/blob/main/apps/frontend/app/locales) or [VsCode Web](https://vscode.dev/github/PuzzlesHQ/cosmic-mod-manager/blob/main/apps/frontend/app/locales/meta.ts)

3. Open the cloned folder in a code editor that supports TypeScript, I'd suggest [**VSCode**](https://code.visualstudio.com/Download)

4. Now that you've opened it in an editor, open [**apps/frontend/app/locales/meta.ts**](/apps/frontend/app/locales/meta.ts)

    ```ts
        const SupportedLocales: LocaleMetaData[] = [
            {
                code: "en",
                name: "English",
                nativeName: "English",
                dir: "ltr",
            },
        
            // Example
    +       {
    +           code: "es", // ISO-639 code of the language
    +           name: "Spanish",
    +           nativeName: "Español",
    +           dir: "ltr",
    +           region: {
    +               code: "ES",
    +               name: "Spain",
    +               displayName: "España",
    +           },
    +       },
    +   ];
    ```

    > [!NOTE]
    > Add the `region` field only if you are adding a regional variant of a language, otherwise you can omit that field.

5. Create the language folder in `/apps/frontend/app/locales` directory. \
 The name of the folder should be `{lang}-{REGION}` (eg: `es-ES`). \
If your lang's metadata doesn't have region field then just `{lang}` (eg: `es`).

6. Create the entry file `translation.ts` in the your folder. \
    Reference - [`app/locales/en/translation.ts`](/apps/frontend/app/locales/en/translation.ts)
    ```ts
    import type { Locale } from "~/locales/types";

    export default { } satisfies Locale;
    ```
    You can reference the english locale and add the translations.

> Now listen carefully, we're not using traditional `JSON` files for translations, all the translation files are in `TypeScript`. Why, you ask. It has several advantages over plain JSON. We can use regular javascript functions to perform logic for things like singular, plural; get Type inference of translation object, so you know where and what translation is missing. Additionally we can return Arrays and Object which helps when dealing with formatting. \
> \
> So having a code editor that supports TypeScript (when I say supports TS, I mean, it has a TypeScript lsp and provides syntax highlighting) will help you a lot.

7. Now, the translation is not crammed up in a single file, it's organized in separate files all located under the same directory/folder of you locale. Open up the `apps/frontend/app/locales/en` folder and see what additional files it has, create those under your folder and translate the contents. \
If you can't translate all of that at once, there's no need to copy and duplicate the files from default locale for fallback, that is handled automatically for you. \
\
Example (Translating the tags): \
    The tags are in a separate file, named `tags.ts`. So if I'm going to translate that, I'll create a file `tags.ts` in the concerned locale's folder and add the translations. After I'm done with that I'll open up the respective directory's `translation.ts`, \
    import the translated tags at the top of the file
    ```diff
    + import tags from "./tags";
    ```

    add the `"tags"` key in `"search"` field of the main translation object
    ```diff
    export default { 
        // other things

        search: {
    +       tags: tags
        },
    } satisfies Locale;
    ```


8. After you're done translating, commit the changes and make a pull request to the main repo. Here's how to do that:

- **Commiting the changes**
    - Via GUI: You can use the builtin Git UI for commiting and pushing the changes
    - Via Terminal: You can use the `git` CLI
    ```bash
    # Stage the changes
    git add .

    # Commit them
    git commit -m "DESCRIBE_WHAT_YOU_ADDED"

    # Push to GitHub
    git push
    ```


## Example
Here's an example to show the exact process of adding a locale. Suppose you wanted to add `French` locale, here's how you'd go about that.

1. Fork and clone the repo. (I'm not going to explain it again)
2. Create the metadata entry in [**apps/frontend/app/locales/meta.ts**](/apps/frontend/app/locales/meta.ts)
    ```ts
    const SupportedLocales: defineLocales([
        //...

        {
            code: "fr",
            name: "French",
            nativeName: "Français",
            dir: "ltr",
            region: {
                code: "FR",
                name: "France",
                displayName: "France",
            },
        }
    ]);
    ```

3. Create a folder for the locale under `apps/frontend/app/locales/`, in this case the folder name would be `fr-FR`

4. Create the `translation.ts` file in the folder and add the template content
    ```ts
    import type { Locale } from "~/locales/types";

    export default { 
        common: {
            settings: "...",
            success: "...",
            error: "...",
            home: "...",
            somethingWentWrong: "...",
            // ...
        },
        // ...
    } satisfies Locale;
    ```

5. When done translating commit the changes and push to the GitHub fork
    ```bash
    git add .
    git commit -m "Added french locale"
    git push
    ```

6. Now go to the fork and press the button that says `Contribute` to open a pull request to the main repo.

    And that's it.


## Some Additional Notess


:::info
If you decide to copy paste an existing lang folder and then edit that with the translation, make sure you don't use the default `en` for that, if you do you'll need to change the `TypeScript` types imported in the files. \
I'd recommend you to use a code editor that supports typescript because there are types available for all the translation keys so your editor will let you know when something doesn't match the expected type.
:::


### A really helpful tip for those who will be using VS Code (or any editor that supports TypeScript)

_NOTE: This doesn't work in vscode web version. You can use GitHub codespace if you don't have VS Code installed._

If you don't wanna search for every missing key manually in the base translation when updating your translation files your editor can lend you a hand. Put your cursor inside the translation object and press `Ctrl` + `Space`, it'll pop open a list of suggestions that includes all the keys that are missing from that object.
