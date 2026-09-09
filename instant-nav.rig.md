# Instant navigation checks

- BUILD: `npm run test:instant` starts `scripts/instant-server.mjs`, which runs a fresh `next build` followed by `next start` on port 3000. No development server is reused.
- EXPOSE: Only the test launcher sets `NEXT_INSTANT_TEST=1` at build and start time. Normal production builds leave the testing API disabled. Never deploy the test build; run `npm run build` for deployment.
- RUN: `npx playwright install chromium`, then `npm run test:instant`. The suite covers desktop (1280×800) and mobile (390×844) using `@next/playwright` on the same version as Next.js.
- TEST USER: Signed-out visitor in a fresh browser context. No real account or credentials. The API serves synthetic public activities and clubs from `tests/instant/fixtures.mjs`; no database or external account is needed.
- DRIFT: Public listings, availability, API latency, and session state may differ from production. Only the API endpoints are replaced; the application rendering, routing, caching, and authentication code run normally. Consultation checks verify its guest login prompt, not signed-in data.
- LOOP: Stop the local dev server to release port 3000, build → run locked tests → fix → rebuild. The launcher and Playwright clean up their processes. A port conflict fails instead of silently reusing a stale server. Restart `npm run dev` after testing if it was running beforehand.
- LIVENESS: The launcher builds and starts the same working directory immediately before each run. No remote deployment is involved.
- WALLS: The fixture API uses an OS-assigned test port and overrides only the test subprocess environment. Real application ports and `.env` files are unchanged. Browser downloads require network access on first setup.

## Verified routes and boundaries

| Route | Immediate content | Deferred content |
| --- | --- | --- |
| `/activity` | Header, title, introduction, illustration, existing list skeleton | URL filters, activity results and pagination |
| `/clubs` | Header, title, introduction, illustration, existing list skeleton | URL filters, club results and pagination |
| `/consultation` | Header, title, introduction and registration section | Session/profile-dependent registration form or login prompt |

These public landing pages use the `(public)` route group so the broad `(common)/loading.tsx` boundary does not hide their static content. Detail and account routes keep their existing boundaries. The shared header renders its logo and desktop links before reading the session; only account controls wait for cookies. Existing cache lifetimes and authentication checks are retained.

Partial Prefetching is enabled globally. The link audit found no explicit full-prefetch calls or manual `router.prefetch` calls requiring migration. Desktop navigation now uses `next/link`; club search uses `next/form`, preserving GET query parameters and browser history.

## Verification record

- Before optimization: all three headings rendered normally through both direct visits and actual menu clicks. With dynamic work paused, all six desktop checks failed because their headings were absent.
- Differential: restored only the implementation while retaining the harness and final assertions; all six checks failed again. Reapplying the implementation passed all 26 desktop/mobile browser checks.
- Locked assertions require the heading to be visible and deferred content to be absent. After release, soft navigation must show the actual content. Initial-load tests reload to obtain an unlocked document.
- Menu tests assert that no new document is requested. Other checks cover activity page 2 and browser Back, club search/empty results/page clamping/history, the consultation guest login prompt, hidden leaderboard navigation, and public homepage/legal content with JavaScript disabled.
- Screenshots compare the shell and resolved content at both viewport sizes. API data is synthetic; these checks do not validate signed-in backend workflows or external authentication.
- Local evidence from this run: [without the fix](test-results/evidence/without-fix.log), [with the fix](test-results/evidence/with-fix.log), [activity before](test-results/evidence/activity-before.png), [activity after](test-results/evidence/activity-desktop-shell.png). Generated evidence is ignored by Git and can be replaced by a later test run; attach it to a review when needed.
