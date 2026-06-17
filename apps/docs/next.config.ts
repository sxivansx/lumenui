import type { NextConfig } from 'next'

// When building for GitHub Pages (set GITHUB_PAGES=true in the deploy workflow)
// we emit a fully static export served from the project subpath /<repo>/.
// Local dev and the normal CI build are unaffected (no basePath, no export).
const isPages = process.env.GITHUB_PAGES === 'true'
const repo = 'lumenui' // GitHub Pages project site lives at /<repo>/

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isPages && {
    output: 'export',
    basePath: `/${repo}`,
    // Static hosts can't run the Image Optimization server.
    images: { unoptimized: true },
    // Emit folder/index.html so clean URLs resolve on GitHub Pages.
    trailingSlash: true,
  }),
}

export default nextConfig
