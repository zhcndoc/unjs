import { Buffer } from 'node:buffer'

export const cachedUnJSGitHubOrg = defineCachedFunction(async () => {
  const org = await $fetch<{ followers: number }>('https://anymeta.top/github/orgs/unjs')

  return org
}, {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  group: 'github',
  name: 'unjsGitHubOrg',
  getKey: () => 'unjsGitHubOrg',
})

export const cachedGitHubRepos = defineCachedFunction(async () => {
  const data = await $fetch<{ stargazers_count: number }[]>('https://anymeta.top/github/orgs/unjs/repos?per_page=100')

  return data.map(repo => ({ stars: repo.stargazers_count }))
}, {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  group: 'github',
  name: 'githubRepos',
  getKey: () => 'githubRepos',
})

const cachedGitHubRepo = defineCachedFunction(async (owner: string, repo: string) => {
  const data = await $fetch<{ stargazers_count: number }>(`https://anymeta.top/github/repos/${owner}/${repo}`)

  return { stars: data.stargazers_count }
}, {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  group: 'github',
  name: 'githubRepo',
  getKey: (owner: string, repo: string) => `githubRepo:${owner}/${repo}`,
})

/**
 * Get repository metadata from GitHub
 */
export async function fetchStars(owner: string, repo: string): Promise<number> {
  const metadata = await cachedGitHubRepo(owner, repo)

  return metadata.stars
}

const cachedGitHubContributors = defineCachedFunction(async (owner: string, repo: string) => {
  const data = await $fetch<{ id: number, login: string, contributions: number }[] | undefined>(`https://anymeta.top/github/repos/${owner}/${repo}/contributors?per_page=100`)

  return (data || []).map(({ id, login, contributions }) => ({ id, username: login, contributions }))
}, {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  group: 'github',
  name: 'githubContributors',
  getKey: (owner: string, repo: string) => `githubContributors:${owner}/${repo}`,
})

/**
 * Get contributors from GitHub
 */
export async function fetchContributors(owner: string, repo: string): Promise<{ id: number, username: string }[]> {
  const contributors = await cachedGitHubContributors(owner, repo)

  const filteredContributors = contributors.filter(({ username }) => !username.includes('[bot]'))
  const sortedContributors = filteredContributors.sort((a, b) => b.contributions - a.contributions)

  return sortedContributors.map(({ id, username }) => ({ id, username }))
}

export const cachedLatestRelease = defineCachedFunction(async (owner: string, repo: string) => {
  const data = await $fetch<{ tag_name: string }>(`https://anymeta.top/github/repos/${owner}/${repo}/releases/latest`)

  return { tag: data.tag_name }
}, {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  group: 'github',
  name: 'latestRelease',
  getKey: (owner: string, repo: string) => `latestRelease:${owner}/${repo}`,
})

export const cachedGitHubReadme = defineCachedFunction(async (owner: string, repo: string) => {
  const data = await $fetch<{ content: string, encoding: string }>(`https://anymeta.top/github/repos/${owner}/${repo}/readme`)

  return data.encoding === 'base64' ? Buffer.from(data.content, 'base64').toString('utf8') : data.content
}, {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  group: 'github',
  name: 'githubReadme',
  getKey: (owner: string, repo: string) => `githubReadme:${owner}/${repo}`,
})
