# Antigravity build prompt: Astrology consultation platform (web + Capacitor mobile)

How to use: paste the MASTER BRIEF first and let Antigravity read it. Then paste ONE phase at a time. Start the next phase only when the previous one runs cleanly.

---

## MASTER BRIEF (paste first)

You are building a premium astrology consultation platform: users read free Vedic charts and panchang, then chat or call verified astrologers, paying per minute from a wallet. Think of a polished, trustworthy product, not a template.

**Stack:** Next.js 16 (App Router) + TypeScript (strict) + Tailwind CSS + Framer Motion. Backend is Firebase only: Auth, Firestore, Cloud Functions (2nd gen, TypeScript, region asia-south1), Cloud Messaging, App Check, Hosting. Mobile is the same codebase wrapped with Capacitor.

**Look and feel:** just like astrotalk.com

**Architecture rules (non-negotiable):**
1. One codebase, two builds. `BUILD_TARGET=web` builds normally for Firebase Hosting. `BUILD_TARGET=mobile` sets `output: 'export'` and `images.unoptimized` for Capacitor. So never use Server Actions, middleware or runtime API routes. All secure logic lives in callable Cloud Functions. No dynamic route segments for runtime IDs on mobile: use query params such as `/astrologer?id=`.
2. The client never touches money or trust. Wallet balances, transactions, session billing, roles and astrologer verification are written only by Cloud Functions.
3. Astrology calculations are a swappable module. Define an `AstroEngine` interface (kundli, divisional charts, dasha, panchang, doshas, matching). Implement it behind that interface inside Cloud Functions only. Never ship the engine to the client bundle. Cache results in Firestore.
4. Security and performance are built in from the first line, not added later (see the checklists in the phases).
5. Keep it focused. Do not create documentation files, audit reports, changelogs or pages I did not ask for. Ask me nothing unless blocked; make a sensible decision and continue.

**Folder shape:** `src/app` (routes), `src/components` (ui, charts, chat, wallet), `src/lib` (firebase client, hooks, utils), `src/features/*`, `functions/src` (callables, triggers, engine, payments), `firestore.rules`, `firestore.indexes.json`, `tests/rules`.

---

## PHASE 1: Foundation and design system
Create the project, Tailwind theme (colour tokens, type scale, radii, shadows, glow), and a small component set: Button, Card, Input, Modal, Sheet, Tabs, Toast, Skeleton, Avatar, Badge. Add the Firebase client (singleton, env-driven), the Firebase emulator suite, App Check initialisation, and the two build targets. Add the app shell: responsive navbar and bottom tab bar, language switcher (English, Hindi), light motion between pages.
Done when: both builds succeed, the shell looks beautiful on a phone width, and the emulators start with one command.

## PHASE 2: Auth and profiles
Firebase Auth (no SMS OTP in this phase). Roles `user`, `astrologer`, `admin` as custom claims set only by a Cloud Function. A saved-profiles feature: users store birth profiles (name, date, time, place, coordinates, timezone) for themselves and family. Route guards on the client, enforced again in rules.
Security: Firestore rules default-deny; users can read and write only their own profile docs; claims are never trusted from the client.
Done when: a user can sign up, add three birth profiles, and cannot read anyone else's data (prove with rules tests in the emulator).

## PHASE 3: Astrology engine and free tools
Implement `AstroEngine` in Cloud Functions with a Vedic open-source library (Lahiri ayanamsa) behind the interface. Callable functions with zod-validated input: `generateKundli`, `getDivisionalCharts`, `getDasha`, `getPanchang`, `getDoshas` (Manglik, Kaal Sarp, Sade Sati), `matchKundli` (Ashtakoot 36 points). Use an offline city dataset for birth-place search (static JSON, fuzzy search, timezone lookup using IANA zones, not a fixed offset).
Frontend: free Kundli page, Matching page, Panchang page, daily horoscope page. Build the North Indian and South Indian chart SVG components yourself: crisp, responsive, with planet glyphs and tap-to-inspect houses.
Performance: cache panchang per date+place and kundli per birth-data hash in Firestore; lazy-load chart components; function minInstances 0 except hot panchang.
Done when: a known test chart matches a trusted reference, results appear in under two seconds cold and instantly when cached.

## PHASE 4: Astrologer marketplace
Astrologer listing with search, filters (language, speciality, price, rating, online), pagination, and a rich profile page. Astrologers toggle online/busy/offline through a callable function; presence stays in Firestore. Seed realistic demo astrologers.
Performance: query with composite indexes (define them), cursor pagination, no unbounded listeners.
Done when: the listing feels instant and filters never trigger full-collection reads.

## PHASE 5: Wallet and per-minute chat
Wallet doc per user, changed only by Cloud Functions inside Firestore transactions with idempotency keys. Chat session flow: user requests, astrologer accepts, session starts with server timestamps. Realtime messages in a subcollection with listeners that always unsubscribe. Billing is computed on the server from start and end timestamps; a scheduled function ends sessions when the balance runs out. Store the transaction ledger immutably.
Security: rules allow only the two participants to read and write messages, with size limits; nobody can write to wallets or ledger from the client.
Done when: two browsers can chat, the balance deducts correctly, a session auto-ends at zero balance, and a client trying to edit its balance is rejected.

## PHASE 6: Payments
Razorpay in test mode: create the order in a callable function, open checkout on the client, and credit the wallet only from a signature-verified webhook function (verify the HMAC, deduplicate by payment id). Add recharge packs, coupon codes, and a transaction history page. Keep the payment layer behind a `PaymentProvider` interface so iOS in-app purchase can be added later.
Done when: a test payment credits the wallet exactly once, even if the webhook is retried.



## PHASE 7: Astrologer dashboard and admin
Astrologer app area: availability, incoming requests, earnings, session history, payout requests. Admin area (admin claim only): verify or reject astrologers, adjust pricing and commission, review payouts, view users and sessions, moderate reviews.
Done when: an admin can onboard an astrologer end to end, and no admin action is possible without the claim (enforced in functions, not just the UI).

## PHASE 8: Shop, pooja booking, reviews, notifications
Product catalogue and cart for remedies, pooja booking with date slots, order history. Ratings and reviews only from users who completed a session. Push notifications through FCM (session requests, order updates, daily horoscope).
Done when: an order and a pooja booking can be placed and tracked, and a review can be left only after a real session.

## PHASE 9: Security and performance hardening
Add and finish these, fixing anything that fails:
- Firestore rules tests covering every collection, run in the emulator.
- App Check enforced on all callable functions and Firestore.
- Rate limiting on expensive callables (per user and IP), idempotency on all money operations.
- Strict CSP and security headers on web hosting; secrets only in Secret Manager; no secret in any client bundle.
- Input validation (zod) on every function; output never leaks other users' data.
- Performance: bundle budget per route, dynamic import for heavy components, list virtualisation for long lists, image sizing, listeners unsubscribed, Lighthouse above 90 on mobile for the main pages.
- Error boundaries, retry with backoff for network failures, and graceful offline behaviour for saved kundlis.
Done when: the rules tests pass, no unbounded reads remain, and the main pages stay smooth on a mid-range phone.

## PHASE 10: Capacitor packaging
Set `BUILD_TARGET=mobile`, add Capacitor (core, android, ios, push notifications, status bar, splash screen, a Firebase auth plugin for native Google sign-in), safe-area handling, and deep links. Add biometric unlock and native push so the app is more than a website. Produce a signed Android AAB and an iOS archive ready for TestFlight.
Done when: the Android build runs on a real device with login, chat, call and push working.