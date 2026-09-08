# SmartVet Africa Academy

Minimal static coming-soon page for SmartVet Africa Academy.

## Stack

Static HTML + SVG. No runtime dependencies.

## Production

- Domain: `https://academy.smartvet.africa`
- Canonical path: `/opt/tuku/apps/smartvet-academy`
- Edge static path: `/opt/tuku/platform/edge/traffiq-web/smartvet-academy`
- Edge proxy: Tuku Caddy (`tuku-edge`)
- Public VPS IPv4: `213.32.19.29`

## DNS

Create an A record for host `academy` pointing to `213.32.19.29`. Caddy is already configured for `academy.smartvet.africa` and will issue HTTPS automatically once DNS resolves.
