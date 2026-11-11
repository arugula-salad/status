// Arugula's status page (status.arugula.io), from UptimeFlare.
// What each monitor watches, and how to post an incident: README.md.
// The page is public and so is this file: no tokens or private hosts here.

// Don't edit this line
import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  title: 'Arugula status',
  links: [
    { link: 'https://arugula.io', label: 'Arugula' },
    { link: 'https://docs.arugula.io', label: 'Docs' },
    { link: 'https://github.com/arugula-salad/arugula', label: 'GitHub' },
    { link: 'https://github.com/arugula-salad/arugula/discussions', label: 'Report a problem', highlight: true },
  ],
  group: {
    'Arugula control': ['control', 'app'],
    'Install and download': ['install_sh', 'release_downloads'],
    'Website and docs': ['site', 'docs'],
  },
  customFooter:
    '<p style="text-align:center;font-size:12px;margin-top:10px">Checked every minute from Cloudflare\'s network, outside the Fly.io apps it watches. Built with <a href="https://github.com/lyc8503/UptimeFlare">UptimeFlare</a>; <a href="https://github.com/arugula-salad/status">its config</a>.</p>',
}

const workerConfig: WorkerConfig = {
  monitors: [
    {
      // The hub: sign-in, devices and the relay that carries terminals.
      id: 'control',
      name: 'Control: sign-in and relay',
      method: 'GET',
      target: 'https://control.arugula.io/control.json',
      tooltip: 'control.arugula.io: signing in, joining machines, and terminals reached through the relay',
      statusPageLink: 'https://control.arugula.io',
      expectedCodes: [200],
      timeout: 10000,
      responseKeyword: '"control"',
    },
    {
      // app.arugula.io is the platform's page, which the hub forwards to the
      // platform (chat, Cloud, projects): it answers only while both are up.
      id: 'app',
      name: 'Platform: chat, Cloud and projects',
      method: 'GET',
      target: 'https://app.arugula.io/',
      tooltip: 'app.arugula.io: projects, chat, boards and hosted workspaces',
      statusPageLink: 'https://app.arugula.io',
      expectedCodes: [200],
      timeout: 10000,
      responseKeyword: '<html',
    },
    {
      id: 'install_sh',
      name: 'Install script',
      method: 'GET',
      target: 'https://arugula.io/install.sh',
      tooltip: 'curl -fsSL https://arugula.io/install.sh | sh',
      statusPageLink: 'https://arugula.io/install.sh',
      expectedCodes: [200],
      timeout: 10000,
      responseKeyword: 'arugula-salad/arugula',
    },
    {
      // The newest release's checksums, which every install reads: GitHub's
      // redirect to its asset store is followed.
      id: 'release_downloads',
      name: 'Release downloads',
      method: 'GET',
      target: 'https://github.com/arugula-salad/arugula/releases/latest/download/SHA256SUMS',
      tooltip: 'The newest release on GitHub, which install.sh and the app download',
      statusPageLink: 'https://github.com/arugula-salad/arugula/releases/latest',
      expectedCodes: [200],
      timeout: 15000,
    },
    {
      id: 'site',
      name: 'Website',
      method: 'GET',
      target: 'https://arugula.io/',
      statusPageLink: 'https://arugula.io',
      expectedCodes: [200],
      timeout: 10000,
    },
    {
      id: 'docs',
      name: 'Docs',
      method: 'GET',
      target: 'https://docs.arugula.io/',
      statusPageLink: 'https://docs.arugula.io',
      expectedCodes: [200],
      timeout: 10000,
    },
  ],
  // No notifications from here: the operators' own alerts are in Arugula's
  // launch runbook. This page is for people using Arugula.
}

// Incidents and maintenance shown on the page (README.md, "Posting an
// incident"). The newest goes first. An incident with no `end` stays up
// until one is added.
const maintenances: MaintenanceConfig[] = []

// Don't edit this line
export { maintenances, pageConfig, workerConfig }
