# Arugula status

The public status page for [Arugula](https://arugula.io)'s hosted services, at
**https://status.arugula.io**. It's [UptimeFlare](https://github.com/lyc8503/UptimeFlare)
(Apache-2.0, upstream's README is [UPTIMEFLARE.md](UPTIMEFLARE.md)) on Cloudflare
Workers and Pages: it checks each service every minute from Cloudflare's network, so it
stays up and says "down" when Arugula's Fly.io apps don't answer.

## What it watches

[`uptime.config.ts`](uptime.config.ts) has the monitors:

| Monitor | Checks | Means |
|---|---|---|
| Control: sign-in and relay | `https://control.arugula.io/control.json` answers 200 with `"control"` | the hub is up: sign-in, joining machines, terminals through the relay |
| Platform: chat, Cloud and projects | `https://app.arugula.io/` answers 200 | the platform is up: the hub forwards this page to it, so it answers only while both are |
| Install script | `https://arugula.io/install.sh` answers 200 and names the repo | `curl … \| sh` works |
| Release downloads | the newest GitHub release's `SHA256SUMS` downloads | installs and updates can fetch a release |
| Website | `https://arugula.io/` answers 200 | |
| Docs | `https://docs.arugula.io/` answers 200 | |

The platform has no public address of its own (it's on Fly's private network), so the
page it serves through the hub stands in for it.

## Posting an incident

Add an entry to `maintenances` in `uptime.config.ts` and push to `main`; the deploy takes
about three minutes. Newest first:

```ts
const maintenances: MaintenanceConfig[] = [
  {
    monitors: ['control'],             // the monitors it's about; leave out for all
    title: 'Investigating slow sign-ins',
    body: "Some people can't sign in. We're looking into it.",
    start: '2026-12-01T14:05:00Z',
    // end: '2026-12-01T14:40:00Z',     // add when it's over; without it, it stays up
    color: 'red',                       // red: incident; yellow (default): maintenance; blue: info
  },
]
```

Update the `body` as it goes, and add `end` when it's resolved: the entry moves to the
*Incident history* page. A scheduled maintenance is the same with a future `start`. While
an entry covers a monitor, its downtime is shown as maintenance.

## Setting it up (once)

The deploy is [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) (upstream's,
less its KV migration, plus the custom domain). It runs on every push to `main`, once the
repository has:

- **`CLOUDFLARE_API_TOKEN`** (secret): an API token on the Cloudflare account that holds
  `arugula.io`, made at *My Profile → API Tokens → Create Custom Token* with only:
  - Account · **Workers Scripts** · Edit (the checking worker, its cron and Durable Object)
  - Account · **D1** · Edit (the worker's history database)
  - Account · **Cloudflare Pages** · Edit (the page, and its custom domain)
  - Zone · **DNS** · Edit, for the zone `arugula.io` only (the `status` CNAME)

  Account Resources: that one account. No IP filtering is needed (GitHub's runners use
  it). TTL: none, or a reminder to rotate it.
- **`CLOUDFLARE_ACCOUNT_ID`** (variable): that account's id.
- **`STATUS_DOMAIN`** (variable): `status.arugula.io`.

The first deploy makes the `uptimeflare_worker` worker, the `uptimeflare_d1` database and
the `uptimeflare` Pages project in that account, then adds `status.arugula.io` to the
project and a proxied CNAME to its `*.pages.dev` name. If the account has never used
Workers, open *Workers & Pages* in the dashboard once first: that makes its
`workers.dev` subdomain, which the deploy needs.

## Updating UptimeFlare

This repository started from upstream at
[`8035521`](https://github.com/lyc8503/UptimeFlare/commit/8035521268a54222959eaf720c82f530e755b6bb)
(2026-10-21, after the CVE-2026-29779 fix). Upstream is one maintainer's project: read
what changed before taking it, then merge it by hand, keeping `uptime.config.ts`,
`.github/workflows/deploy.yml` and this README. The *Upstream Sync* workflow does the same
when run by hand; it never runs on its own.
