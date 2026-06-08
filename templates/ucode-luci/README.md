# {{PKG_NAME}}

A ucode LuCI application for OpenWrt.

## Prerequisites

Docker (everything else runs inside containers).

## Layout

```
src/                          # Business logic (ucode modules)
files/                        # Mirrors the OpenWrt filesystem
  etc/config/{{PKG_NAME}}     #   UCI config (default values)
  usr/bin/{{PKG_NAME}}        #   CLI entry point
  usr/share/rpcd/acl.d/       #   rpcd ACL grants LuCI access to UCI
  usr/share/luci/menu.d/      #   LuCI sidebar entry
  www/luci-static/resources/view/{{PKG_NAME}}/  # LuCI view (JavaScript)
test/
  unit/                       # utest unit tests
  e2e/                        # Playwright end-to-end tests
  utest.config.uc             # utest configuration
  playwright.config.js        # Playwright configuration
devenv/                       # Docker-based development environment
openwrt/{{PKG_NAME}}/Makefile # OpenWrt SDK package definition
Makefile                      # Development workflow
Dockerfile                    # Unit test runner image
```

**The `files/` convention**: every file under `files/` is installed verbatim to the same path on the target device. `src/` is the only exception — ucode modules there are installed to `/usr/share/ucode/`. When you add a new file to the package, put it under `files/` at its target path.

## Development workflow

| Command | What it does |
|---|---|
| `make luci` | Build and start LuCI at `http://localhost:80` (root / admin) |
| `make luci-shell` | Open a shell in the running LuCI container |
| `make test` | Run all tests (unit + e2e) |
| `make test-unit` | Run unit tests only |
| `make test-e2e` | Run Playwright e2e tests only |
| `make lint` | Lint ucode source files |
| `make shell` | Open a shell in the unit test container |
| `make package` | Build the `.ipk` package via the OpenWrt SDK |

The dev environment mounts `src/` and `files/` directly into the container, so edits are reflected immediately without a rebuild (page reload is enough for the LuCI view; `make luci` restart required for ucode or UCI changes).

## Architecture

### Dependency injection

`src/{{PKG_NAME}}.uc` receives a UCI cursor through a `deps` argument instead of importing `uci` directly:

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
mock.inject('uci', { data: { {{PKG_NAME}}: { main: { name: 'Alice' } } } }, (uci) => {
    assert.match('Hello Alice!', greet({ uci: uci.cursor() }));
});
```

### End-to-end tests

Playwright runs inside Docker against a real OpenWrt container. The container boots a minimal stack — ubusd, rpcd, uhttpd — without procd. The LuCI view is served from the bind-mounted `files/` tree, so it reflects the working tree at test time.

### rpcd ACL

`files/usr/share/rpcd/acl.d/{{PKG_NAME}}.json` grants the `{{PKG_NAME}}` role read and write access to the `{{PKG_NAME}}` UCI package via the built-in `rpcd-mod-uci` plugin. No custom rpcd handler is needed.

## CI & Releases

GitHub Actions runs lint, unit tests, and e2e tests on every push and pull request. Unit and e2e jobs run in parallel after lint.

To publish a release, push a version tag:

```bash
git tag v1.0.0
git push --tags
```

This builds packages for all supported OpenWrt versions and creates a GitHub release with the `.ipk` files attached.

## Packaging

`make package` builds an `.ipk` using the OpenWrt SDK Docker image and writes it to `bin/`. The version is stamped with the current git commit short hash (`PKG_VERSION~<hash>`).
