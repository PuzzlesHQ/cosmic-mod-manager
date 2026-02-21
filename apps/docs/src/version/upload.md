# Upload a version


POST `/project/{ID|slug}/version`
```json
{
    "success": true,
    "message": "Successfully created new version",
    "slug": "NEW_VERSION'S_SLUG"
}
```

REQUEST BODY: `multipart/form-data`

- **Title** \
    key: `title` \
    type: `string` \
    maxLength: `64`

- **Changelog** \
    key: `changelog` \
    type: `string` \
    maxLength: `65256`

- **ReleaseChannel** \
    key: `releaseChannel` \
    type: `ENUM { release | beta | alpha | dev }`

- **Featured** \
    key: `featured` \
    type: `booleanish string ("true" | "false")`

- **VersionNumber** \
    key: `versionNumber` \
    type: `string`

- **Loaders** \
    key: `loaders` \
    type: `string[]` (Check [/tags/loaders](/api/tags/loaders) for a list of available loaders)

- **GameVersions** \
    key: `gameVersions` \
    type: `string[]` (Check [/tags/game-versions](/api/tags/game-versions) for a list of available game versions)

- **Dependencies** \
    key: `dependencies` \
    type: `Dependency[]`
    ```ts
    interface Dependency {
        projectId: string,
        versionId: string | null,
        dependencyType: "required" | "optional" | "incompatible" | "embedded",
    }
    ```

- **PrimaryFile** \
    key: `primaryFile` \
    type: [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)

- **AdditionalFiles** \
    key: `additionalFiles` \
    type: [`File[]`](https://developer.mozilla.org/en-US/docs/Web/API/File) \
    maxLength: `10`
