// Minimal ambient types for `jest-axe` (the package ships no declarations and
// there is no maintained @types entry for v10). We only consume `axe()` and read
// `.violations`, so a self-contained shape avoids pulling in @types/jest, which
// would clash with Vitest's globals.
declare module 'jest-axe' {
  export interface AxeViolationNode {
    html: string
    target: string[]
    failureSummary?: string
  }
  export interface AxeViolation {
    id: string
    impact?: 'minor' | 'moderate' | 'serious' | 'critical' | null
    description: string
    help: string
    helpUrl: string
    nodes: AxeViolationNode[]
  }
  export interface AxeResults {
    violations: AxeViolation[]
    passes: unknown[]
    incomplete: unknown[]
    inapplicable: unknown[]
  }
  export function axe(
    html: Element | string,
    options?: Record<string, unknown>,
  ): Promise<AxeResults>
  export function configureAxe(options?: Record<string, unknown>): typeof axe
  export const toHaveNoViolations: unknown
}
