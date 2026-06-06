# create-ucode

An interactive project initializer for [ucode](https://github.com/jow-/ucode), OpenWrt's modern scripting language.

`create-ucode` helps you scaffold a production-ready ucode project in seconds, complete with unit testing, Docker-based isolation, and OpenWrt package integration.

---

## Quick Start

The fastest way to start a new ucode project is using `npm create`:

```bash
npm create ucode my-app
```

Follow the interactive prompts to choose your template and set your maintainer info. Once finished:

```bash
cd my-app
make test   # Runs the unit tests in a Docker container
```

---

## Features

- **Latest OpenWrt Support**: Targets OpenWrt 25.12 (using the `apk` package manager).
- **Integrated Testing**: Out-of-the-box configuration for [utest](https://github.com/m00qek/utest).
- **Dockerized Workflow**: Test your scripts in a bit-identical OpenWrt environment without needing a router.
- **OpenWrt Ready**: Generates a standard `Makefile` compatible with the OpenWrt SDK and buildroot.
- **Dual Mode**: Use the friendly interactive wizard or script it via CLI flags.

---

## CLI Reference

### Usage
`npm create ucode [project-name] [options]`

### Arguments
| Argument | Description |
| :--- | :--- |
| `project-name` | (Optional) The directory name and `PKG_NAME`. Defaults to `my-ucode-app`. |

### Options
| Flag | Description |
| :--- | :--- |
| `--template`, `-t` | Specify the template variant (e.g., `pure-ucode`). |
| `--maintainer`, `-m` | Set the maintainer string (e.g., `"Name <email>"`). |
| `--help`, `-h` | Show help information. |

### Unattended Mode
To skip all prompts (useful for CI/CD):
```bash
npm create ucode my-app --template pure-ucode --maintainer "Bot <bot@example.com>"
```

---

## Development

If you want to contribute to `create-ucode` or run it from source:

### Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts
- `npm start`: Run the interactive CLI.
- `npm run dev`: Generate a `dev-app` project for rapid testing.
- `npm test`: Run a collision-free smoke test in `/tmp`.

### Linking for Local Use
You can link the package to your global npm registry to test `npm create ucode` as a user would:
```bash
npm link
```

---

## License

MIT — see [LICENSE](LICENSE).
