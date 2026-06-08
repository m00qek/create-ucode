# {{PKG_NAME}}

A pure ucode application for OpenWrt.

## Prerequisites

Docker (everything else runs inside containers).

## Layout

```
src/                          # Business logic (ucode modules)
files/                        # Mirrors the OpenWrt filesystem
  etc/config/{{PKG_NAME}}     #   UCI config (default values)
  usr/bin/{{PKG_NAME}}        #   CLI entry point
test/
  unit/                       # utest unit tests
  utest.config.uc             # utest configuration
openwrt/{{PKG_NAME}}/Makefile # OpenWrt SDK package definition
Makefile                      # Development workflow
Dockerfile                    # Unit test runner image
```

**The `files/` convention**: every file under `files/` is installed verbatim to the same path on the target device. `src/` is the only exception — ucode modules there are installed to `/usr/share/ucode/`.

## Development workflow

| Command | What it does |
|---|---|
| `make test` | Run all tests |
| `make test-unit` | Run unit tests only |
| `make lint` | Lint ucode source files |
| `make shell` | Open a shell in the test container |
| `make package` | Build the `.ipk` package via the OpenWrt SDK |

## Architecture

### Dependency injection

`src/{{UCODE_MOD_NAME}}.uc` receives a UCI cursor through a `deps` argument instead of importing `uci` directly:

```ucode
export function greet(deps) {
    const name = deps.uci.get('{{PKG_NAME}}', 'main', 'name') ?? 'World';
    return `Hello ${name}!`;
};
```

The CLI entry point (`files/usr/bin/{{PKG_NAME}}`) wires the real cursor at the process boundary. Tests inject a mock cursor. Neither the module nor the tests depend on the global uci module.

### Unit tests

Tests use `mock.inject` from [utest](https://github.com/m00qek/utest) to get a realistic UCI cursor proxy loaded with in-memory config data, then pass it via the DI interface:

```ucode
mock.inject('uci', { data: { "{{PKG_NAME}}": { main: { name: 'Alice' } } } }, (uci) => {
    assert.match('Hello Alice!', greet({ uci: uci.cursor() }));
});
```

## CI & Releases

GitHub Actions runs lint and tests on every push and pull request.

To publish a release, push a version tag:

```bash
git tag v1.0.0
git push --tags
```

This builds packages for all supported OpenWrt versions and creates a GitHub release with the `.ipk` files attached.

## Packaging

`make package` builds an `.ipk` using the OpenWrt SDK Docker image and writes it to `bin/`. The version is stamped with the current git commit short hash (`PKG_VERSION~<hash>`).
