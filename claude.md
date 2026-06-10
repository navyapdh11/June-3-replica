# Claude Development Instructions - June-3-replica

## 🎯 Project Overview
June-3-replica is a sophisticated enterprise-grade cleaning platform and SEO/AEO engine. It integrates a React 19 frontend with an Express/BullMQ backend.

## 🏗️ Architectural Mandates
- **Monolith Decomposition:** The current project has several extremely large components (e.g., `CleanersApp.tsx` > 4k lines). Prioritize refactoring these into logical sub-components in `src/components/`.
- **Type Safety:** Maintain strict TypeScript usage. Do not bypass types. `src/types.ts` is the source of truth.
- **Style:** Use TailwindCSS v4. Stick to the established slate/indigo/emerald color palette.
- **State Management:** Leverage React 19 hooks and existing context providers.

## 🛠️ Key Workflows
- **Backtests:** When modifying SEO or routing logic, verify against the `Empirical Backtest Suite` in `ProgrammaticLandingPage.tsx`.
- **Integration:** All CRM and payment handshakes (Stripe, Twenty CRM) must be validated via the `IntegrationConsole.tsx`.
- **Queues:** Background tasks should use the BullMQ pattern defined in `server.ts` and `src/utils/queue.ts`.

## 🧪 Validation Standards
- **Schema Validation:** Use Zod for any new API payloads.
- **Testing:** Add Vitest unit tests for new utility functions in `src/utils/`.
