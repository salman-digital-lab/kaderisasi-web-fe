# Google login

Google is an additional way to prove ownership of an email address. The public
Adonis API still owns users and issues the same JWT used by both public APIs.
Email/password registration, login, and password recovery remain available.
No database migration or account reset is needed. The existing nullable-password
migration (`1771200000000_alter_public_users_for_alumni.ts`) must already be applied.

## Configuration

Create an OAuth client of type **Web application** in Google Cloud / Google Auth
Platform. Configure the consent screen, application name, support email,
authorized domain, homepage, privacy policy, and terms URLs. While the app is in
testing, add the Google accounts used for acceptance testing as test users.
Request only `openid email profile`.

Add the exact authorized redirect URI:

- Local: `http://localhost:3000/api/auth/google/callback`
- Production: `https://<public-website-host>/api/auth/google/callback`

The callback belongs to the frontend, not port 3333 or the admin API. This is a
server authorization-code flow; no browser SDK or popup origin is required.

Configure the selected environment's **frontend** file, `docs/.env.<mode>.web-fe`:

```dotenv
GOOGLE_CLIENT_ID=<web-client-id>.apps.googleusercontent.com
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

Configure the matching **backend** file, `docs/.env.<mode>.be`:

```dotenv
GOOGLE_CLIENT_ID=<same-web-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<client-secret>
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

Use the production HTTPS callback for production. `NEXT_PUBLIC_APP_URL` must
match the website origin. The frontend's existing `SERVER_BE_API` or
`NEXT_PUBLIC_BE_API` must point to the public Adonis API, including `/v2`.
Never prefix the client secret with `NEXT_PUBLIC_` or put it in frontend files.
Do not commit environment values.

Install backend dependencies with `npm ci`; restart/rebuild both public apps
after configuration. The workspace launcher copies the selected environment
files as described in `docs/ENVIRONMENTS.md` at the workspace root. If the same
tmux stack is already running, restart it to apply changed source environment
files. Direct development uses web-fe `.env.local` and web-be `.env`.

The Google option stays hidden when frontend configuration is absent or invalid.
If the frontend is configured but the backend is not, users see a recoverable
message and can continue with email/password.

## Account behavior

- An existing public user with the same email is reused. Its ID, password
  hash, member ID, profile, badges, registrations, and history are untouched.
- Matching is case-insensitive. Ambiguous matches fail without merging accounts.
- A legacy-only member is imported with their original name, contact details,
  level, and badges. Their old password still works through the existing legacy
  hash until a new password is set; a set password always takes precedence.
- A new email creates an active user, member ID, and profile in one transaction.
  Password stays null. Users can set a password through **Lupa password**.
- Explicitly inactive accounts are not activated through Google. The historical
  `no_account` migration default is accepted, matching existing password login;
  it is not treated as an account suspension and is left unchanged.
- Only verified Gmail or Google Workspace email claims are accepted. Google
  accounts using third-party mailboxes must use email/password or password
  recovery because Google is not authoritative for those mailboxes. See
  [Google's verification guidance](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).
- This feature matches verified email on every sign-in; it does not create a
  persistent provider link or move a local account when a Google email changes.

## Flow and security

Both `/login` and `/register` offer **Lanjutkan dengan Google**. Initiation is a
Next server action with a ten-minute HttpOnly, SameSite=Lax flow cookie, random
state, nonce, and PKCE S256. The backend exchanges the single-use authorization
code using its client secret and verifies the ID token signature, issuer,
audience, expiry, nonce, and authoritative email. Google access/refresh tokens
are neither stored nor returned to the browser. The callback writes the normal
application session cookie and redirects without exposing the JWT in a URL.

Homepage navigation returns to `/`. Activity joining retains the activity form
destination. Club and Ruang Curhat entry points retain their detail/service
page. Desktop and mobile navbar login links retain the current pathname.
Cancellation, expired state, and failures retain the safe destination and the
login/registration choice. External URLs, API destinations, and auth loops are
rejected. Google success performs no activity/club registration or consultation
submission automatically; existing forms and eligibility checks still apply.

## Verification

From web-fe:

```sh
npm run lint
npm run typecheck
npm test
npm exec playwright -- test --config=playwright.auth.config.ts
```

The browser suite builds the frontend and uses fixture APIs and an intercepted
Google redirect. Port 3000 must be free. It tests desktop/mobile destinations,
new-user registration, cancellation, email-login fallback, navigation links,
keyboard focus, and layout. Screenshots are saved under ignored `test-results/`.

From web-be:

```sh
npm run lint
npm run typecheck
npm run build
node ace test unit
node scripts/test-google-auth.mjs
```

The database runner reads only `docs/.env.test.be`, creates an isolated schema
from the three relevant tables in the Go sqlc snapshot, sets an explicit search
path with no public fallback, and removes the owned schema afterward. It does
not run migrations, touch shared application rows, or create storage objects.

Before release, use the real configured Google client to check existing-user
and new-user sign-in, consent cancellation, and password login afterward.
Automated browser tests mock Google's authorization UI; they cannot verify the
Cloud project's credentials, consent screen, or domain configuration.

## UI decisions

Reuse the Salman auth layout, typography, spacing, and responsive container to
keep both sign-in methods familiar. Use a neutral Google button and Google's
[official logo](https://developers.google.com/identity/branding-guidelines) to
identify the provider. Keep the existing colored email submit button. Display
errors inline and allow retry or email login. Design dials: energy 1, rhythm 1,
motion 1.

## Local verification record (2026-09-10)

- Frontend lint and typecheck passed; 100 unit tests passed.
- Backend lint, typecheck, and build passed; the unit run passed 21 tests, with
  opt-in database suites skipped in that run.
- The dedicated database run passed all 5 Google account tests. Cleanup removed
  `google_auth_test_e21eeff999124106b66855710f9db9f9`; no storage objects were created.
- Production frontend build and all 18 desktop/mobile auth browser tests passed.
  Google authorization and the API response were fixtures in this browser run.
- Login, registration, and forgot-password screenshots were inspected at the
  same 1280px desktop and 390px mobile widths. No horizontal overflow was found.

Antislop delivery checks for the changed UI:

- **Hard gate PASS:** the Google button submits a real server action; browser
  tests exercised login, registration, cancellation, password fallback, and
  keyboard focus. The new copy contains no fabricated claims or decorative
  content. Existing branding and an official Google logo are used.
- **Purpose gate PASS:** the provider logo identifies the action, the divider
  separates authentication choices, and the explanatory text describes account
  matching. Existing Salman colors, spacing, and typography are reused.
- **Liveliness PASS:** energy 1 / rhythm 1 / motion 1; existing BMKA branding and
  the primary form action remain the page's visual anchors, confirmed in the
  matching desktop/mobile screenshots.
- **Craftsmanship PASS:** responsive layout and keyboard navigation passed the
  browser checks; cancellation and backend rejection have retryable error
  handling. Missing Google configuration hides the provider option.

Live Google acceptance remains pending the matching client secret and callback
configuration. These results verify the implementation, not the Google Cloud
project settings.
