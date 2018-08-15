# KnoxTechTrend

A work-in-progress website for analytics of Knoxville, TN Technology Trends.

## Build & Release

| Branch | Appveyor | GitHub |
|---:|:---:|:---|
| Master | [![Build status](https://ci.appveyor.com/api/projects/status/9nb74udocrkcaxhe/branch/master?svg=true)](https://ci.appveyor.com/project/DanielOliver/knoxtechtrend/branch/master) | [![GitHub release](https://img.shields.io/github/release/DanielOliver/knoxtechtrend.svg)](https://github.com/DanielOliver/flexer/knoxtechtrend/latest) |
| Develop | [![Build status](https://ci.appveyor.com/api/projects/status/9nb74udocrkcaxhe?svg=true)](https://ci.appveyor.com/project/DanielOliver/knoxtechtrend) | [![GitHub release](https://img.shields.io/github/release/DanielOliver/knoxtechtrend/all.svg)](https://github.com/DanielOliver/flexer/knoxtechtrend/latest/all) |

## Environments

* Production: Most recent tagged commit on master branch.
* Test: Most recent non-tagged commit to master branch.
* Develop: Most recent commit to develop branch.

### Environment Variables

| Variable | Description |
| ---:|:--- |
| TENANT_ID | Azure Active Directory Tenant ID |
| SERVICE_PRINCIPAL_NAME | Service principal login name |
| SERVICE_PRINCIPAL_PASSWORD | Service principal login password |
| MEETUP_API_KEY | Meetup API key to access their API |
| KUDU_CLIENT_USERNAME | Azure Functions KUDU client username |
| KUDU_CLIENT_PASSWORD | Azure Functions KUDU client password |
| AZURE_STORAGE_CONNECTION_STRING | Leave empty |
| NETLIFY_ACCESS_TOKEN | |
| PRODUCTION_AZURE_STORAGE_CONNECTION_STRING | Used by GatsbyJS Jam Stack |
| TEST_AZURE_STORAGE_CONNECTION_STRING | Used by GatsbyJS Jam Stack |
| DEVELOP_AZURE_STORAGE_CONNECTION_STRING | Used by GatsbyJS Jam Stack |
| APPVEYOR_API_KEY | |
