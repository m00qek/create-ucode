# {{PKG_NAME}}

A pure ucode project.

## Development

**Prerequisites:** Docker and [ucode-lint](https://github.com/m00qek/ucode-lint).

| Command | Description |
| :--- | :--- |
| `make test` | Run unit tests inside an OpenWrt Docker container |
| `make lint` | Lint source files with ucode-lint |
| `make package` | Build an OpenWrt `.apk` package via the SDK |
| `make shell` | Open a shell inside the test container |

## CI & Releases

GitHub Actions runs lint and tests on every push and pull request.

To publish a release, push a version tag:

```bash
git tag v1.0.0
git push --tags
```

This builds packages for all supported OpenWrt versions and creates a GitHub release with the `.apk` files attached.
