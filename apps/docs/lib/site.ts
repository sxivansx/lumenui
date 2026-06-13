export const GITHUB_OWNER = 'sxivansx'
export const GITHUB_REPO = 'lumenui'
export const GITHUB_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`

/** Shown when the live star count can't be fetched, so the badge never goes blank. */
export const FALLBACK_STARS = 480

/**
 * Fetch the repo's star count from the GitHub API. Cached for an hour (ISR) and
 * returns null on any failure so the UI can fall back gracefully.
 */
export async function getStarCount(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as { stargazers_count?: number }
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null
  } catch {
    return null
  }
}

/** Compact star count, e.g. 480 → "480", 1234 → "1.2k". */
export function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}
