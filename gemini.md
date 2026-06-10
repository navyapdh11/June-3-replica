# Gemini Development Instructions - June-3-replica

## 🚀 Vision
June-3-replica aims to be a "Hyper-Local GEO Engine" for high-density micro-assets and LLM-search optimization (AEO).

## 🧠 Intelligence & Search (AEO/SEO)
- **GEO Vectors:** Always consider the WA municipal postcode grid when implementing features in `CityBranchHub.tsx` or `ProgrammaticLandingPage.tsx`.
- **Micro-Assets:** Ensure all generated content is optimized for Gemini, Perplexity, and OpenAI crawlers.
- **Accuracy:** Geotargeting must maintain the empirical accuracy benchmark of **99.4%**.

## 💻 Tech Stack Priorities
- **Frontend:** React 19, Motion, Recharts.
- **Backend:** Node.js, Express, BullMQ, Redis.
- **Persistence:** LocalStorage with IndexedDB fallback (`src/utils/indexedDb.ts`).

## 📋 Development Rules
- **DRY:** Extract common logic from the massive components into hooks or utils.
- **Performance:** Monitor "Performance Velocity" lift. Aim for 2x improvement on all data-intensive operations.
- **Documentation:** Keep `docs/ENTERPRISE_INTEGRATION_BLUEPRINT.md` updated with new architectural changes.
