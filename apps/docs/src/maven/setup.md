# Maven Setup

_Configure your project to download versions directly from the CrMods API using standard Maven or Gradle build tools._

### Repository Details

- **Base API URL**: `https://api.crmods.org/maven/`
- **Group ID**: `maven.crmods`
- **Artifact ID**: `slug` or `id` of the target project.
- **Version**: `slug` or `id` of the specific project version.

## Adding the Repository (`build.gradle`)

```groovy
repositories {
    exclusiveContent {
        forRepository {
            maven {
                name = "CrMods"
                url = "https://api.crmods.org/maven/"
            }
        }
        filter {
            includeGroup "maven.crmods"
        }
    }
}
```

## Adding a Dependency

Dependencies are formatted as `groupId:artifactId:version`.

```groovy
dependencies {
    modImplementation "maven.crmods:{project}:{version}"
}
```