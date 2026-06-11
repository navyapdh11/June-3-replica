# 🚀 AI Companion Build & Deployment Guide

This document is for your desktop environment. It addresses the architectural issues encountered during the Android-based CLI refactoring and provides steps for stable production deployment.

## 🛠️ Build Environment Issues
The build errors encountered (native binary compatibility for `rollup` and `esbuild` on Android) are platform-specific. On your desktop, run the following to reset and build successfully:

1. **Clean Project State:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Verify Build:**
   ```bash
   npm run build
   ```

## ⚛️ React Hydration Fixes
The "flashing" behavior observed in production is a hydration mismatch caused by server-side vs. client-side state initialization (`localStorage` discrepancies). 

### How to apply the fix:
Add a mount-check to your primary components (e.g., `CleanersApp.tsx`, `App.tsx`):

```tsx
const [isMounted, setIsMounted] = useState(false);
useEffect(() => setIsMounted(true), []);

if (!isMounted) return <div className="loading-state">Loading...</div>;
```

## 🚀 Deployment Recommendations
Because you are using an SPA architecture with server-side logic (`server.ts` + `BullMQ`), I recommend these deployment strategies:

1. **Vercel (SPA-Only):** If you only need the frontend, remove the `esbuild` server bundling from `package.json` and deploy as a standard Vite SPA.
2. **Dokploy/VPS (Full Stack):** Since you are using Express + BullMQ, you should deploy via **Dokploy**. This allows you to manage both the Node.js backend (with Redis/BullMQ support) and the Vite frontend within a stable Docker container environment.

## 📈 Next Steps
- **Audit Tool:** Use the `src/utils/SEOValidator.ts` utility I created to generate a comprehensive SEO report before pushing your final production update.
- **Testing:** Execute `npm run test` (if using Vitest) on your desktop, as it will run seamlessly without the Android-specific binary conflicts.
