# Status page mobile review

Reviewed 26 September 2026 using synthetic registrations, with no production account or database writes.

## Integration status

The redesign is integrated with the paginated profile-history API in the shared working tree. `/status` requests six registrations per page with `search_scope=name`; profile search retains its existing broader behavior. Authentication and uncached upstream requests remain in the server-side proxy. The page authenticates on the server, then the client fetches paginated records through that proxy. The matching skeleton covers both route loading and the initial history request.

Deploy the public backend's new history endpoint and name-only search option before this frontend. The companion backend task verified its PostgreSQL regression for name-only versus description/status-only matches, exact statuses and unchanged summary counts. No production deployment was performed.

## Visual evidence

- [390px mobile](mobile.png): first registration name and status are visible in the initial 844px viewport.
- [320px mobile](narrow-mobile.png): titles, controls, badges and pagination stay within the viewport.
- [1280px desktop](desktop.png): the same theme and card hierarchy, with horizontal controls and actions.
- [768px tablet](tablet.png), plus matching [mobile profile](profile-390.png) and [desktop profile](profile-1280.png) comparisons.

## Verification

- PASS: production builds in the fixture harness, lint, typecheck, and `git diff --check`.
- PASS: 13 affected unit tests covering distinct status labels, timezone/date fallback and certificate lifecycle rules. Sorting and filtering now belong to the paginated API and are covered by browser/API regressions.
- PASS: all 14 status browser cases across desktop/mobile, plus four shared history regression cases, across the main and final targeted runs. The final delayed-response run adds page clamping and verifies the six-item, name-only, no-store request contract.
- PASS: two layout-stability checks with delayed API/JavaScript. CLS was 0 on both desktop and mobile; see the adjacent JSON files.
- PASS: axe checks on the status content, empty state, error state and certificate-action variants.
- PASS: keyboard-only dropdown selection, visible focus, pagination focus return and clearing filters.
- PASS: 200% text resizing on mobile and a 640px CSS viewport equivalent to 200% browser zoom on a 1280px desktop. This is reflow testing, not a claim of testing a browser's zoom UI or a physical phone.

Commands from `kaderisasi-web-fe` (the Playwright fixture harness runs a production build before starting the app):

```sh
npm run lint
npm run typecheck
npm test -- src/features/status/status-utils.test.ts src/features/certificate/utils/certificateData.test.ts
npm run test:instant -- tests/instant/status.spec.ts tests/instant/profile-history.spec.ts
CLS_BROWSER_TEST=1 npm run test:instant -- tests/instant/status.spec.ts tests/instant/route-cls.spec.ts --grep 'status skeleton|pagination clamps|newest registrations|layout stability: status' --output=test-results/status-integration-final
```

The main integrated run passed 15 of 16 cases. The loading locator briefly matched both the route and client skeleton during Next.js's handoff; it now targets the visible skeleton. The final eight-case run passed, including both loading checks, strengthened request-contract checks, page clamping, and CLS. Earlier visual review also corrected certificate-action contrast, the accessible result-heading name, and mobile pagination label sizing.

## Interaction evidence

- Search: case-insensitive, trimmed activity names; unmatched searches show a no-results message.
- Status selector: exact filtering keeps accepted/passed and rejected/not-passed distinct.
- Hapus filter: restores all records, resets to page one and focuses search.
- Pagination: six items per page, newest registrations first, unknown dates last, focus moves to the result heading. Mobile shows previous/next with an Indonesian page label.
- Detail kegiatan: navigates to the existing activity detail route.
- Lihat Sertifikat: navigates to the synthetic certificate page and renders its activity heading.
- Revoked, awaiting-issuance and legacy certificate actions: labels and destinations match the shared certificate helper. Ineligible registrations have no certificate action.
- Empty state: Cari kegiatan opens the activity catalogue.
- Error state: Coba lagi recovers from a one-shot failure.
- Expired session: clears the cookie through the existing logout route and opens login with the status return destination.
- Announcements: future and absent/invalid dates retain the backend-provided withheld status; valid times render in WIB.

## Design rationale and anti-slop gate

Direction: a calm status lookup page for mobile participants, retaining the Salman visual language. ENERGY 1 / RHYTHM 1 / MOTION 1.

- PASS, hierarchy: the current result is the focal point of each card; compact counts replace the four summary panels.
- PASS, layout: full-width titles and bottom actions prevent competition for narrow horizontal space; consistent record cards support scanning comparable registrations.
- PASS, colour: existing theme blue identifies actions; semantic green/red/orange identify real statuses. Certificate text is darkened locally to meet contrast checks.
- PASS, typography: existing Inter and theme sizes preserve the site's identity; no new fonts or decorative type treatments.
- PASS, spacing and surfaces: existing container widths, spacing, borders and radii match the profile activity page. The announcement surface separates scheduling information from the result.
- PASS, icons: search, status and certificate icons convey their associated action or state and are hidden from assistive technology when redundant with text.
- PASS, mobile/accessibility: checked widths have no horizontal overflow; action targets are at least 44px; text and badges wrap; keyboard controls and visible focus are verified.
- PASS, complete states/actions: loading, empty, error and no-results states are exercised; all page controls have working behaviour and documented destinations.
- PASS, honesty: screenshots are synthetic test fixtures; live counts use returned registration data. No invented product claims, testimonials, navigation, assets or timelines.
- PASS, restraint: no added gradients, glows, large shadows, promotional sections, motion effects or theme switches. Existing default light appearance is the reviewed theme.

These gates apply to the integrated working tree. Fixtures are isolated in-memory accounts; screenshots contain synthetic data.
