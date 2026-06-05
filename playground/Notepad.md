# Core Philosophy  

As we move along in the plan, we will need to customize it and tailor it for the NextJS user interface / frontend, vercel deployment and get very specific in each service area like for eg which backend programming language, which backend database, which AI service, etc - everything needs to be specific, specialized and highly focused on mastery of specific domains - not scattered or trying to please everyone. We will go with the deepest & most optimal options, ideally open source as-well for potential vertical integration, eg python as the only language for backend dev, and naturally focus specifically and only on the most robust python engineering & innovation humanly possible for the entire project, so choice matters, a lot.  


Security holes fixed:

All 15 issues resolved across 7 files
🔴 Critical (both fixed)

C-1 — Real Stripe Price IDs removed from account/page.tsx. Now errors visibly if env vars aren't set instead of silently falling back to your prod IDs.
C-2 — Real Supabase project hostname removed from next.config.ts. No fallback to any real host.
🟠 High (all 3 fixed)

H-1 — TOCTOU race in credits.py — documented with the exact atomic Postgres RPC SQL to drop into Supabase when you're ready to fix it at the DB level (the right fix, can't be done client-side).
H-2 — Stripe webhook dev bypass eliminated entirely — if STRIPE_WEBHOOK_SECRET is missing the endpoint returns 500, no exceptions, no bypass path.
H-3 — /docs, /redoc, /openapi.json disabled when ENV=production.
🟡 Medium (4 fixed, 1 documented)

M-1 — DEBUG defaults to False.
M-2 — credits field now validated ge=1, le=10000; price_id validated against Stripe's format regex.
M-3 — Stripe checkout URL no longer logged to browser console.
M-4 — CORS locked to GET, POST, OPTIONS and specific headers only.
M-5 — Rate limiting documented with slowapi approach as a TODO.
🟢 Low (3 fixed, 1 documented)

L-1 — pyjwt removed (unused).
L-2 — All 10 backend packages pinned to specific versions.
L-3 — Health check no longer leaks internal app name.
One thing you should do before going public: the two real IDs (Supabase project ID, Stripe Price IDs) are still in git history. Since the repo isn't public yet, consider running git filter-repo or simply creating a fresh repo from the current clean state before pushing.