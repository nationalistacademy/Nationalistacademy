#!/usr/bin/env bash
set -Eeuo pipefail

: "${HOME:?HOME must be set}"
command -v curl >/dev/null 2>&1 || {
  printf '%s\n' "Error: curl is required." >&2
  exit 1
}

OPENCLAW_GIT_DIR="${OPENCLAW_GIT_DIR:-${HOME}/.local/share/nationalistacademy/openclaw}"

printf 'Installing OpenClaw from the official Git source into: %s\n' "$OPENCLAW_GIT_DIR"
printf '%s\n' "Onboarding and gateway setup are intentionally left for a separate, manual step."

curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh |
  bash -s -- \
    --install-method git \
    --version main \
    --git-dir "$OPENCLAW_GIT_DIR" \
    --no-onboard \
    --verify

printf '\n%s\n' "OpenClaw installation step completed. Check the CLI with: openclaw --version"
