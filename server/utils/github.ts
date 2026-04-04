import { Buffer } from 'node:buffer'
import { useRuntimeConfig } from '#imports'

export const cachedUnJSGitHubOrg = defineCachedFunction(async () => {
  const org = await $fetch<{ followers: number }>('https://api.github.com/orgs/unjs')

  return org
}, {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  group: 'github',
  name: 'unjsGitHubOrg',
  getKey: () => 'unjsGitHubOrg',
})

export const cachedGitHubRepos = defineCachedFunction(async () => {
  const data = await $fetch<{ repos: { stars: number }[] }>('https://ungh.cc/orgs/unjs/repos')

  return data.repos
}, {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  group: 'github',
  name: 'githubRepos',
  getKey: () => 'githubRepos',
})

const cachedGitHubRepo = defineCachedFunction(async (owner: string, repo: string) => {
  const data = await $fetch<{ repo: { stars: number } }>(`https://ungh.cc/repos/${owner}/${repo}`)

  return data.repo
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
  const data = await $fetch<{ contributors: { id: number, username: string, contributions: number }[] }>(`https://ungh.cc/repos/${owner}/${repo}/contributors`)

  return data.contributors
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
  const data = await $fetch<{ release: { tag: string } }>(`https://ungh.cc/repos/${owner}/${repo}/releases/latest`)

  return data.release
}, {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  group: 'github',
  name: 'latestRelease',
  getKey: (owner: string, repo: string) => `latestRelease:${owner}/${repo}`,
})

interface GitHubReadmeResponse {
  content: string
  encoding: string
}

function getGitHubHeaders(): Record<string, string> {
  const { githubToken } = useRuntimeConfig()

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (githubToken)
    headers.Authorization = `Bearer ${githubToken}`

  return headers
}

export const cachedGitHubReadme = defineCachedFunction(async (owner: string, repo: string) => {
  const data = await $fetch<GitHubReadmeResponse>(`https://api.github.com/repos/${owner}/${repo}/readme`, {
    headers: getGitHubHeaders(),
  })

  if (data.encoding !== 'base64')
    return data.content

  return Buffer.from(data.content.replace(/\r?\n/g, ''), 'base64').toString('utf8')
}, {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  group: 'github',
  name: 'githubReadme',
  getKey: (owner: string, repo: string) => `githubReadme:${owner}/${repo}`,
})
