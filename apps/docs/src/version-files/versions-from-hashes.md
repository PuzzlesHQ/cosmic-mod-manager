# Get multiple versions from file hashes
_SHA1 and SHA512 hashes are supported_

POST `/api/version-files` \
_Returns a map from input hash to the version data_

```json
{
    "6d37f994f50697b36221bc7e84333783b2d14577": {
        "id": "EqhMLQH5wVTbxwIfON",
        "projectId": "4xvLkWrQx2lt6Vyx6Z",
        "title": "Test Shader",
        "versionNumber": "4",
        "changelog": "",
        "slug": "4",
        "datePublished": "2024-09-21T00:58:54.132Z",
        "featured": false,
        "downloads": 4,
        "releaseChannel": "release",
        "gameVersions": ["0.3.1"],
        "loaders": [],
        "primaryFile": {
            "id": "fr7fFUQqRsLPv_ILCS",
            "isPrimary": true,
            "name": "testshadersv4.zip",
            "url": "https://cdn.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/version/EqhMLQH5wVTbxwIfON/testshadersv4.zip",
            "size": 18028,
            "type": "zip",
            "sha1_hash": "6d37f994f50697b36221bc7e84333783b2d14577",
            "sha512_hash": "d977f49822675b49bbfd7b7e8bbf6a33ef7ae6a73c970ce7335990af6a91860b9776e735df44f002350d32e5f550418278bf317a7f1d2f3ab39516b63a344eae"
        },
        "files": [
            {
                "id": "fr7fFUQqRsLPv_ILCS",
                "isPrimary": true,
                "name": "testshadersv4.zip",
                "url": "https://cdn.crmm.tech/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/version/EqhMLQH5wVTbxwIfON/testshadersv4.zip",
                "size": 18028,
                "type": "zip",
                "sha1_hash": "6d37f994f50697b36221bc7e84333783b2d14577",
                "sha512_hash": "d977f49822675b49bbfd7b7e8bbf6a33ef7ae6a73c970ce7335990af6a91860b9776e735df44f002350d32e5f550418278bf317a7f1d2f3ab39516b63a344eae"
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
                "id": "71nzW1PnOVAqbZ9MnN",
                "projectId": "ULi2_4S0blE1Kd2pEa",
                "versionId": null,
                "dependencyType": "required"
            }
        ]
    },
    ...
}
```
[Type reference](/packages/utils/src/types/api/index.ts#L122)

REQUEST BODY: `application/json`

- **Algorithm** \
    key: `algorithm` \
    type: `sha1` | `sha512` \
    default: `sha512`

- **Hashes** \
    key: `hashes` \
    type: `string[]`
