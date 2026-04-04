import type { PackageJson } from 'pkg-types'

async function fetchWithRetry<T>(url: string, retries = 5): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await $fetch<T>(url)
    }
    catch (error: any) {
      if (error?.response?.status === 429 && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)))
        continue
      }
      throw error
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`)
}

const cachedNpmMonthlyDownloads = defineCachedFunction(async (name: string) => {
  const downloads = await fetchWithRetry<{ downloads: number }>(`https://api.npmjs.org/downloads/point/last-month/${name}`)

  return downloads.downloads
}, {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  group: 'npm',
  name: 'npmMonthlyDownloads',
  getKey: (name: string) => `npmMonthlyDownloads:${name}`,
})

/**
 * Get the monthly downloads for a package
 */
export async function fetchMonthlyDownloads(name: string): Promise<number> {
  const downloads = await cachedNpmMonthlyDownloads(name)

  return downloads
}

const cachedNpmPackages = defineCachedFunction(async (name: string) => {
  const packageJson = await fetchWithRetry<PackageJson>(`https://registry.npmjs.org/${name}/latest`)

  return packageJson
}, {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  group: 'npm',
  name: 'npmPackages',
  getKey: (name: string) => `npmPackages:${name}`,
})

/**
 * Get the package.json for a package
 */
export async function fetchPackageJson(name: string): Promise<PackageJson> {
  const packageJson = await cachedNpmPackages(name)

  return packageJson
}
