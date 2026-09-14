# Get versions of multiple projects
Get a list of versions of multiple projects by project `ids`

GET [`/api/projects/versions?ids=ID1,ID2,ID3`](/api/projects/versions?ids=4xvLkWrQx2lt6Vyx6Z) \
_*ids is not json encoded, it's just a comma separated list_


[Type Reference - ProjectVersionData](/packages/utils/src/types/api/index.ts#L124)


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