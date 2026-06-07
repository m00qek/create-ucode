# create-ucode

An interactive project initializer for [ucode](https://github.com/jow-/ucode), OpenWrt's modern scripting language.

`create-ucode` helps you scaffold a production-ready ucode project in seconds, complete with unit testing, Docker-based isolation, OpenWrt package integration, and GitHub Actions CI.

---

## Quick Start

**Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and Node.js.

```bash
npm create ucode@latest my-app
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
- **GitHub Actions CI**: Lint, test, and publish `.apk` packages on every push. Releases are triggered by a version tag.
- **Dual Mode**: Use the friendly interactive wizard or script it via CLI flags.

---

## CLI Reference

### Usage
`npx create-ucode [project-name] [options]`

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
npx create-ucode my-app --template pure-ucode --maintainer "Bot <bot@example.com>"
```

---

## Development

### Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts
- `npm start`: Run the interactive CLI.
- `npm test`: Run a smoke test that scaffolds a project into a temp directory and verifies the output.

### Linking for Local Use
To test `npm create ucode@latest` end-to-end as a user would:
```bash
npm link
```

---

## License

MIT — see [LICENSE](LICENSE).
