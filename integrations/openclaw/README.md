# OpenClaw integration for Nationalist Academy

This directory documents an **opt-in, local developer/operator integration** of [OpenClaw](https://github.com/openclaw/openclaw) with the Nationalist Academy project.

## Design and production boundary

- OpenClaw remains an upstream Git checkout; this repository does not vendor or modify its source.
- The checkout is kept outside this repository at `~/.local/share/nationalistacademy/openclaw` by default. Override it with `OPENCLAW_GIT_DIR`.
- OpenClaw's user configuration, credentials, sessions, and runtime state remain in the user's home directory, not in Git.
- The installer is not run by GitHub Actions, Pages, Blogger, or any deployment workflow.
- This integration does not configure a gateway service, expose a network port, connect external accounts, or enable autonomous actions. Those require separate review and explicit operator configuration.
- Nothing here changes `main`, Blogger settings, DNS, secrets, or production deployments.

## Requirements

- macOS, Linux, or WSL (the upstream `install.sh` supports these environments).
- A working internet connection and `curl`.
- Git; the upstream installer can install it if missing.
- A supported Node.js runtime. The upstream installer checks and may provision a compatible runtime.

Windows users should follow the official [Windows installation guide](https://docs.openclaw.ai/install) rather than running the Bash script in PowerShell.

## Install

From a local clone of this repository, run:

```bash
bash integrations/openclaw/install.sh
```

The wrapper downloads the official installer over HTTPS and requests a Git-based OpenClaw checkout in the separate directory described above. It skips onboarding and runs the installer's version verification. It does **not** run `openclaw onboard` or install/configure a gateway service.

Equivalent upstream command (with the integration's isolated checkout path):

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --install-method git --version main --git-dir "${HOME}/.local/share/nationalistacademy/openclaw" --no-onboard --verify
```

After installation, open a new terminal if needed, confirm the CLI is on your PATH, then review the official [onboarding and security guidance](https://docs.openclaw.ai/). Only proceed with onboarding when you are ready to choose providers, permissions, and any integrations.

## Optional custom checkout path

```bash
OPENCLAW_GIT_DIR="$HOME/src/openclaw" bash integrations/openclaw/install.sh
```

Keep this checkout outside the Nationalist Academy repository. Do not commit OpenClaw state, credentials, tokens, session data, logs, or local configuration.

## Verification

```bash
openclaw --version
openclaw doctor
```

Run `openclaw doctor` only after completing the official onboarding/configuration flow. Review any proposed repairs before accepting them.

## Security checklist

1. Use only the official installer URL and inspect upstream release/security notices before upgrades.
2. Never put API keys, OAuth tokens, passwords, private keys, or personal session data in this repository, issues, or pull requests.
3. Do not expose the gateway to the public internet by default. Follow OpenClaw's current authentication and network-hardening documentation before enabling remote access.
4. Grant only the tools and filesystem access required for a specific task; review approvals before allowing shell, browser, messaging, or other external actions.
5. Keep the gateway stopped until you explicitly configure and approve its use.
6. Treat agent output and fetched content as untrusted; verify commands and changes before execution.
7. Keep this integration opt-in. No CI workflow or production deployment should install or start OpenClaw.

## Upstream references

- [OpenClaw source repository](https://github.com/openclaw/openclaw)
- [Official installation guide](https://docs.openclaw.ai/install)
- [Installer details and flags](https://docs.openclaw.ai/install/installer)
- [Official documentation](https://docs.openclaw.ai/)

OpenClaw is an independent upstream project. This integration is maintained by Nationalist Academy as installation guidance and a local wrapper; it does not imply endorsement or affiliation.
