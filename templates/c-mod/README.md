# {{PKG_NAME}}

A ucode application with a C extension module for OpenWrt.

## Prerequisites

Docker (everything else runs inside containers).

## Layout

```
mod/                          # C source for the native extension
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
| `make test` | Compile the C module and run all tests |
| `make test-unit` | Compile the C module and run unit tests |
| `make compile` | Compile the C module without running tests |
| `make lint` | Lint ucode source files |
| `make shell` | Open a shell in the test container |
| `make package` | Build the `.apk` package via the OpenWrt SDK |

`make test-unit` compiles the C module inside the OpenWrt SDK container (first run downloads the SDK image, ~4 GB) and then runs the ucode test suite in a lightweight OpenWrt container. Subsequent runs skip the compile step if sources are unchanged. `make compile` also extracts ucode headers into `mod/compile_flags.txt` for IDE support.

## Architecture

### Dependency injection

`src/{{UCODE_MOD_NAME}}.uc` receives a UCI cursor through a `deps` argument instead of importing `uci` directly, and delegates computation to the native C `add` function:

```ucode
import { add } from '{{UCODE_MOD_NAME}}.native';

export function calculate(deps) {
    const a = int(deps.uci.get('{{PKG_NAME}}', 'main', 'a') ?? '2');
    const b = int(deps.uci.get('{{PKG_NAME}}', 'main', 'b') ?? '3');
    return `The sum of ${a} + ${b} is ${add(a, b)}`;
};
```

The CLI entry point (`files/usr/bin/{{PKG_NAME}}`) wires the real cursor at the process boundary. Tests inject a mock cursor. Neither the module nor the tests depend on the global uci module.

### Unit tests

Tests use `mock.inject` from [utest](https://github.com/m00qek/utest) to get a realistic UCI cursor proxy loaded with in-memory config data, then pass it via the DI interface:

```ucode
mock.inject('uci', { data: { "{{PKG_NAME}}": { main: { a: '2', b: '3' } } } }, (uci) => {
    assert.match('The sum of 2 + 3 is 5', calculate({ uci: uci.cursor() }));
});
```

The C `add` function is the real compiled extension — tests run against the actual native module.

## CI & Releases

GitHub Actions runs lint and tests on every push and pull request.

To publish a release, push a version tag:

```bash
git tag v1.0.0
git push --tags
```

This builds packages for all supported OpenWrt versions and creates a GitHub release with the `.apk` files attached.

## Packaging

`make package` builds an `.apk` using the OpenWrt SDK Docker image and writes it to `build/`. The version is stamped with the current git commit short hash (`PKG_VERSION~<hash>`).
