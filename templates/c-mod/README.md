# {{PKG_NAME}}

A ucode project with a C extension module.

## Development

**Prerequisites:** Docker and ucode-lint.

| Command | Description |
| :--- | :--- |
| `make test` | Compile the C module and run unit tests |
| `make lint` | Lint `.uc` files with ucode-lint |
| `make package` | Build OpenWrt `.apk` via SDK |
| `make shell` | Open shell in the test container |

`make test` compiles the C module inside the OpenWrt SDK container (first run downloads the SDK image, ~4 GB) and then runs the ucode test suite in a lightweight OpenWrt container. Subsequent runs skip the compile step if sources are unchanged.

## Project layout

```
mod/          C source and CMakeLists.txt for the native extension
src/          ucode scripts (main.uc re-exports from the C module)
test/         utest unit tests
openwrt/      OpenWrt package Makefile for SDK builds
```

## CI & Releases

Push a `v*` tag to trigger a package build and GitHub release.
