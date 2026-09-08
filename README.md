# SmartVet Africa Academy

Minimal static coming-soon page for SmartVet Africa Academy.

## Stack

Static HTML + SVG. No runtime dependencies.

## VPS deployment

- Canonical path: `/opt/tuku/apps/smartvet-academy`
- Edge static path: `/opt/tuku/platform/edge/traffiq-web/smartvet-academy`
- Edge proxy: Tuku Caddy (`tuku-edge`)
- Public VPS IPv4: `213.32.19.29`

## DNS

Point the chosen apex domain to `213.32.19.29` with an A record. Point `www` to the apex with a CNAME. Once the domain is confirmed, add its Caddy site block and reload Caddy so HTTPS is issued automatically.
