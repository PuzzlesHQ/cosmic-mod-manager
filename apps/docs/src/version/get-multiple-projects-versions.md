# Get versions of multiple projects
Get a list of versions of multiple projects by project `ids`

GET [`/api/projects/versions?ids=ID1,ID2,ID3`](/api/projects/versions?ids=4xvLkWrQx2lt6Vyx6Z) \
_*ids is not json encoded, it's just a comma separated list_

Returns a map of `projectId` -> [`ProjectVersionData[]`](/packages/utils/src/types/api/index.ts#L124)

```json
{
    "4xvLkWrQx2lt6Vyx6Z": [
        {
            "id": "u33iQhXyZ2PJUTvsfy",
            "projectId": "4xvLkWrQx2lt6Vyx6Z",
            "title": "TestShadersV10",
            "versionNumber": "10",
            "slug": "10",
            "datePublished": "2025-02-22T01:12:19.189Z",
            "featured": true,
            "downloads": 92,
            "changelog": "###\r\nAdded star settings",
            "releaseChannel": "release",
            "gameVersions": [ "0.3.26" ],
            "loaders": [ "simply_shaders" ],
            "primaryFile": {
                "id": "0xxSRbBxUw9K2-oPx9",
                "isPrimary": true,
                "name": "TestShadersV10.zip",
                "size": 25000,
                "type": "zip",
                "url": "https://api.crmods.org/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/version/u33iQhXyZ2PJUTvsfy/TestShadersV10.zip",
                "sha1_hash": "61e39665b51a2a12d9800fd9fc877a1b08188170",
                "sha512_hash": "c62f46e9ecf6be15ea4845c9da10b0a23d7b4502663c7b5efc47f0ca2c75479dd0353f36bf839c492965c2b53633e85111f1eb9d25c0bf6cf50670d573c3c49f"
            },
            "files": [
                {
                    "id": "0xxSRbBxUw9K2-oPx9",
                    "isPrimary": true,
                    "name": "TestShadersV10.zip",
                    "size": 25000,
                    "type": "zip",
                    "url": "https://api.crmods.org/cdn/data/project/4xvLkWrQx2lt6Vyx6Z/version/u33iQhXyZ2PJUTvsfy/TestShadersV10.zip",
                    "sha1_hash": "61e39665b51a2a12d9800fd9fc877a1b08188170",
                    "sha512_hash": "c62f46e9ecf6be15ea4845c9da10b0a23d7b4502663c7b5efc47f0ca2c75479dd0353f36bf839c492965c2b53633e85111f1eb9d25c0bf6cf50670d573c3c49f"
                }
            ],
            "author": {
                "id": "ah2LyusAsuzzobzcRe",
                "userName": "Shfloop",
                "avatar": "https://cdn.crmods.org/cdn/data/user/ah2LyusAsuzzobzcRe/repqJiI8XfwnHGnMSa_128.jpeg",
                "role": ""
            },
            "dependencies": [
                {
                    "projectId": "ULi2_4S0blE1Kd2pEa",
                    "versionId": null,
                    "dependencyType": "required"
                }
            ]
        }
    ]
}
```


### Query parameters

- **limit** _(Optional)_ \
    key: `limit` \
    type: `number` \
    default: `15` \
    _Limits the number of versions returned. This is done to prevent the response from getting gigantic_

- **Game Version** _(Optional)_ \
    key: `gameVersion` \
    type: [`string`](/api/tags/game-versions)

- **Loader** _(Optional)_ \
    key: `loader` \
    type: [`string`](/api/tags/loaders)

- **Release Channel** _(Optional)_ \
    key: `releaseChannel` \
    type: `ENUM { release | beta | alpha | dev }` \
    :::info
    _The api returns all versions that match the selected `releaseChannel` or are more stable than that, which means `releaseChannel=beta` would return `beta` versions but also `release`. To get versions from just the selected channel, suffix the value with `-only`. eg `beta-only`._
    :::