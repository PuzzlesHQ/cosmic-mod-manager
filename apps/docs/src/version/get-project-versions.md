# Get project versions

GET [`/api/project/{ID|slug}/version`](/api/project/4xvLkWrQx2lt6Vyx6Z/version)

```json
"success": true,
"data": [
    {
        "id": "I1uoODEUnXP4ZLw1hB",
        "projectId": "4xvLkWrQx2lt6Vyx6Z",
        "title": "TestShaderV8",
        "versionNumber": "8",
        "slug": "8",
        "datePublished": "2025-01-11T20:08:26.545Z",
        "featured": true,
        "downloads": 4,
        "changelog": "### added pack settings\r\n### added basic volumetric clouds",
        "releaseChannel": "release",
        "gameVersions": ["0.3.16", "0.3.15", "0.3.14"],
        "loaders": [],
        "primaryFile": {
            "id": "u3ttJQpSrzyQH-4V77",
            "isPrimary": true,
            "name": "TestShaderV8.zip",
            "size": 24354,
            "type": "zip",
            "url": "https://api.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/version/I1uoODEUnXP4ZLw1hB/TestShaderV8.zip",
            "sha1_hash": "d180dc418edf939a6b61dacf1065861e86404184",
            "sha512_hash": "f33bcc6d09ffc253112bb1c74ef328c920612785bfc9edb862ec533ffe7c4968bc3be11cc9af5d6d70ca15bd06b642896eed3ed8acbefe5fd48043f6c4d974ec"
        },
        "files": [
            {
                "id": "u3ttJQpSrzyQH-4V77",
                "isPrimary": true,
                "name": "TestShaderV8.zip",
                "size": 24354,
                "type": "zip",
                "url": "https://api.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/version/I1uoODEUnXP4ZLw1hB/TestShaderV8.zip",
                "sha1_hash": "d180dc418edf939a6b61dacf1065861e86404184",
                "sha512_hash": "f33bcc6d09ffc253112bb1c74ef328c920612785bfc9edb862ec533ffe7c4968bc3be11cc9af5d6d70ca15bd06b642896eed3ed8acbefe5fd48043f6c4d974ec"
            }
        ],
        "author": {
            "id": "ah2LyusAsuzzobzcRe",
            "userName": "Shfloop",
            "avatar": "https://cdn.crmm.tech/cdn/data/user/ah2LyusAsuzzobzcRe/repqJiI8XfwnHGnMSa_128.jpeg",
            "role": "Owner"
        },
        "dependencies": [
            {
                "projectId": "ULi2_4S0blE1Kd2pEa",
                "versionId": null,
                "dependencyType": "required"
            }
        ],
        "isDuplicate": false
    },
    ...
]
```

[Type reference](/packages/utils/src/types/api/index.ts#L125)


## Get a specific project version

GET [`/api/project/{ID|slug}/version/{ID/slug}`](/api/project/4xvLkWrQx2lt6Vyx6Z/version/I1uoODEUnXP4ZLw1hB)

```json
"success": true,
"data": {
    "id": "I1uoODEUnXP4ZLw1hB",
    "projectId": "4xvLkWrQx2lt6Vyx6Z",
    "title": "TestShaderV8",
    "versionNumber": "8",
    "slug": "8",
    "datePublished": "2025-01-11T20:08:26.545Z",
    "featured": true,
    "downloads": 4,
    "changelog": "### added pack settings\r\n### added basic volumetric clouds",
    "releaseChannel": "release",
    "gameVersions": ["0.3.16", "0.3.15", "0.3.14"],
    "loaders": [],
    "primaryFile": {
        "id": "u3ttJQpSrzyQH-4V77",
        "isPrimary": true,
        "name": "TestShaderV8.zip",
        "size": 24354,
        "type": "zip",
        "url": "https://api.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/version/I1uoODEUnXP4ZLw1hB/TestShaderV8.zip",
        "sha1_hash": "d180dc418edf939a6b61dacf1065861e86404184",
        "sha512_hash": "f33bcc6d09ffc253112bb1c74ef328c920612785bfc9edb862ec533ffe7c4968bc3be11cc9af5d6d70ca15bd06b642896eed3ed8acbefe5fd48043f6c4d974ec"
    },
    "files": [
        {
            "id": "u3ttJQpSrzyQH-4V77",
            "isPrimary": true,
            "name": "TestShaderV8.zip",
            "size": 24354,
            "type": "zip",
            "url": "https://api.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/version/I1uoODEUnXP4ZLw1hB/TestShaderV8.zip",
            "sha1_hash": "d180dc418edf939a6b61dacf1065861e86404184",
            "sha512_hash": "f33bcc6d09ffc253112bb1c74ef328c920612785bfc9edb862ec533ffe7c4968bc3be11cc9af5d6d70ca15bd06b642896eed3ed8acbefe5fd48043f6c4d974ec"
        }
    ],
    "author": {
        "id": "ah2LyusAsuzzobzcRe",
        "userName": "Shfloop",
        "avatar": "https://cdn.crmm.tech/cdn/data/user/ah2LyusAsuzzobzcRe/repqJiI8XfwnHGnMSa_128.jpeg",
        "role": "Owner"
    },
    "dependencies": [
        {
            "projectId": "ULi2_4S0blE1Kd2pEa",
            "versionId": null,
            "dependencyType": "required"
        }
    ],
    "isDuplicate": false
}
```

[Type reference](/packages/utils/src/types/api/index.ts#L125)


## Get the latest version of a project

GET [`/api/project/{ID|slug}/version/latest`](/api/project/4xvLkWrQx2lt6Vyx6Z/version/latest) \
_Returns the same response object as the above one_


QUERY PARAMS:
- **Release Channel** \
    key: `releaseChannel` \
    type: `ENUM { release | beta | alpha | dev }` \
    default: `release`

- **Game Version** \
    key: `gameVersion` \
    type: [`string`](/api/tags/game-versions)

- **Loader** \
    key: `loader` \
    type: [`string`](/api/tags/loaders)


## Download version file directly from the api

GET [`/api/project/{ID|slug}/version/latest/primary-file`](/api/project/4xvLkWrQx2lt6Vyx6Z/version/latest/primary-file)

Suffix the above API endpoints with `/primary-file` to download the primary file or `/{FILE_NAME}` to download that specified file from that version.

All the query param filters work the same.
