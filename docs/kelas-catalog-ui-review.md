# Kelas catalog UI review

Date: 12 September 2026. Scope: the public `/kelas` catalog and its shared catalog primitives. Implemented locally; production deployment was not part of this change.

## Design decisions

- Read as a learner catalog in the existing Kaderisasi visual language: ENERGY 1 / RHYTHM 1 / MOTION 1.
- Reuse `PageHero`, `PageContainer`, catalog search, card sections, and pagination so Kelas follows Kegiatan and Klub's spacing, typography, controls, surfaces, and responsive grid.
- Use the existing blue accent for navigation, progress, and the illustration. The arched blue backdrop connects the new SVG with the site's other page illustrations.
- Draw a video screen, open book, and lesson notes because those represent this LMS's actual learning materials. The original SVG contains no raster images, fonts, scripts, or external resources and is 2,916 bytes.
- Omit card cover images because courses have no cover-image field. Summaries, minimum level, and personal progress provide useful information within the shared card structure.
- Show both textual progress and a bar, including visited-but-not-completed lessons. Keep the existing course-overview destination for “Buka kelas”.
- Give search a clear-results action and redirect obsolete page numbers to the last available page, matching the other catalogs.
- Keep session-derived course data behind Suspense and leave authenticated, `no-store` data fetching unchanged. No API, database, eligibility, completion, or storage changes.
- Use Next 16.3's `retry` error-boundary callback so retry refetches server data. Browser tests reproduced the old `reset` button's failure and verified recovery after the change.

## Verification

- PASS: `npm run lint`.
- PASS: `npm run typecheck`.
- PASS: `npm test`, 17 files and 130 tests.
- PASS: production build through `scripts/instant-server.mjs`, all 39 pages generated; `/kelas` retains partial prerendering and streamed content.
- PASS: `npx playwright test courses.spec.ts catalogue-consistency.spec.ts --grep 'Kelas|catalogues'`, 8 tests across 1280×800 and 390×844 viewports.
- PASS: browser coverage for shared catalog styling, all three progress states, zero completed lessons after a visit, keyboard search, clearing search, pagination, course navigation, resume link, empty results, no eligible courses, retry, and guest login return URLs.
- PASS: axe WCAG A/AA checks of the Kelas main content at both test widths, including valid progress-bar attributes.
- PASS: manual browser comparison with Klub at desktop and 390px, plus 320px search submission and visible keyboard focus. DOM check at 320px reported no horizontal overflow.
- PASS: visual inspection of the original SVG in the actual page header; no clipping or missing assets. The shared hero hides decorative artwork on mobile to preserve reading space.
- PASS: `git diff --check`.

The browser fixtures are synthetic and in memory. They do not access production accounts, databases, or object storage. Screenshots are recorded under `test-results/courses-Kelas-matches-cata-bf573-ccessible-personal-progress-{desktop,mobile}/{kelas,clubs}.png`.

The initial broader run also executed the existing activity/club **detail** comparison and failed at its `.closest(".mantine-Card-root")` selector. The activity detail heading is already inside a `Paper` header in HEAD. Those detail layouts and that test are unchanged; the affected **catalog** comparison passes on both widths.

## Anti-slop delivery gate

- Hard Gate PASS (R-02): added interface copy contains no em dashes.
- Hard Gate PASS (R-03): browser screenshots and width assertions show no horizontal overflow at 320, 390, and 1280px.
- Hard Gate PASS (R-17, R-18, R-36, R-38): all displayed counts and progress come from the existing response; there are no testimonials or invented product claims. Synthetic content is confined to test fixtures.
- Hard Gate PASS (R-23): the user requested an SVG asset; the new illustration is original and depicts the requested learning materials.
- Hard Gate PASS (R-24, R-26): search, clear, page navigation, course links, and retry have working destinations or handlers, exercised by browser tests.
- Hard Gate PASS (R-25): axe reports no WCAG A/AA violations in the changed catalog.
- Hard Gate PASS (R-27): loading skeleton, empty/search-empty states, unavailable error message, and working retry are present.
- Hard Gate PASS (R-28): no unrelated FAQ added.
- Hard Gate PASS (R-32): native keyboard tests pass and manual 320px inspection shows the focused search button's outline.
- Hard Gate PASS (R-33): UI and SVG were written directly with source patches, followed by formatting.
- Hard Gate PASS (R-34): no theme toggle or theme behavior changed; shared theme tokens remain in use.
- Hard Gate PASS (R-35): production build, automated click-throughs, and manual browser review completed.
- Hard Gate PASS (R-37): direction comes from the explicitly requested existing list pages; the three dials are declared above.
- Purpose Gate PASS (R-01, R-07, R-10, R-12, R-13): no gradients, decorative grids, glass effects, shadows, or glows added.
- Purpose Gate PASS (R-04, R-08): reuse the existing search and pagination icons for their established functions; no ornamental action arrows added.
- Purpose Gate PASS (R-06, R-09): reuse existing catalog typography and level badges; badges identify actual membership requirements.
- Purpose Gate PASS (R-14): equal-width cards support scanning and comparing courses, using the same responsive grid as other catalogs.
- Purpose Gate PASS (R-19): no new animation; the existing loading skeleton and focus/hover behavior are retained.
- Purpose Gate PASS (R-22): the SVG's video, book, and notes depict the LMS's actual materials and reuse the site's illustration palette and arch motif.
- Liveliness PASS: the shared illustrated hero provides one focal point, blue remains the deliberate accent, and shared spacing separates introduction, search, and curriculum.
- Quality PASS (C-1, R-31): reasons for color, layout, typography, spacing, cards, and illustration are recorded above.
- Quality PASS (C-2): changed controls work in browser checks.
- Quality PASS (C-3): the page contains only introduction, search, eligible courses with progress, and pagination.
- Quality PASS (C-4): loading, empty, error, keyboard, and responsive states have concrete verification evidence above.
- Quality PASS (C-5): no fabricated testimonials, product statistics, or security claims.
- Quality PASS (R-05, R-20, R-30): layout follows this application's existing list pages, as the user requested, rather than an outside product template.
- Quality PASS (R-11): existing component radii retained.
- Quality PASS (R-15, R-16): actions use concrete Indonesian labels, including “Cari”, “Buka kelas”, and “Hapus pencarian”.
- Quality PASS (R-21, R-29): existing theme remains unchanged; the SVG uses related blues/neutrals and a small warm bookmark accent.
