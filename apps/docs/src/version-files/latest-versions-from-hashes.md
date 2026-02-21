# Get latest version from hash
_SHA1 and SHA512 hashes are supported_

POST `/api/version-files/update` \
_Returns a map from input hash to the latest version of the project the version of the provided hash belongs to_

```json
{
    "6d37f994f50697b36221bc7e84333783b2d14577": {
        "id": "I1uoODEUnXP4ZLw1hB",
        "projectId": "4xvLkWrQx2lt6Vyx6Z",
        "title": "TestShaderV8",
        "versionNumber": "8",
        "changelog": "### added pack settings\r\n### added basic volumetric clouds",
        "slug": "8",
        "datePublished": "2025-01-11T20:08:26.545Z",
        "featured": true,
        "downloads": 4,
        "releaseChannel": "release",
        "gameVersions": ["0.3.16", "0.3.15", "0.3.14"],
        "loaders": [],
        "primaryFile": {
            "id": "u3ttJQpSrzyQH-4V77",
            "isPrimary": true,
            "name": "TestShaderV8.zip",
            "url": "https://cdn.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/version/I1uoODEUnXP4ZLw1hB/TestShaderV8.zip",
            "size": 24354,
            "type": "zip",
            "sha1_hash": "d180dc418edf939a6b61dacf1065861e86404184",
            "sha512_hash": "f33bcc6d09ffc253112bb1c74ef328c920612785bfc9edb862ec533ffe7c4968bc3be11cc9af5d6d70ca15bd06b642896eed3ed8acbefe5fd48043f6c4d974ec"
        },
        "files": [
            {
                "id": "u3ttJQpSrzyQH-4V77",
                "isPrimary": true,
                "name": "TestShaderV8.zip",
                "url": "https://cdn.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/version/I1uoODEUnXP4ZLw1hB/TestShaderV8.zip",
                "size": 24354,
                "type": "zip",
                "sha1_hash": "d180dc418edf939a6b61dacf1065861e86404184",
                "sha512_hash": "f33bcc6d09ffc253112bb1c74ef328c920612785bfc9edb862ec533ffe7c4968bc3be11cc9af5d6d70ca15bd06b642896eed3ed8acbefe5fd48043f6c4d974ec"
            }
        ],
        "author": {
            "id": "ah2LyusAsuzzobzcRe",
            "userName": "Shfloop",
            "avatar": "https://cdn.crmm.tech/cdn/data/user/ah2LyusAsuzzobzcRe/repqJiI8XfwnHGnMSa_128.jpeg",
            "role": ""
        },
        "dependencies": [
            {
                "id": "nftsPiuIKeOyO_c3uK",
                "projectId": "ULi2_4S0blE1Kd2pEa",
                "versionId": null,
                "dependencyType": "required"
            }
        ]
    },
    ...
}
```

REQUEST BODY: `application/json`
- **Algorithm** \
    key: `algorithm` \
    type: `sha1` | `sha512` \
    default: `sha512`

- **Hashes** \
    key: `hashes` \
    type: `string[]`

- **Game Versions** _(optional)_ \
    key: `gameVersions` \
    type: [`string[]`](/api/tags/game-versions)

- **Loader** _(optional)_ \
    key: `loader` \
    type: [`string`](/api/tags/loaders)

- **Release Channel** _(optional)_ \
    key: `releaseChannel` \
    type: [`string`](/packages/utils/src/types/index.ts#L91)