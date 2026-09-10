---
name: api-integration-debug
description: Debug and fix a broken third-party API/OAuth/SSO integration (wrong endpoint, missing fields, silent auth failures) by verifying against official docs and real network traces instead of guessing. Use when a login/SSO flow, webhook, or external API call returns unexpected data, 404s, empty profiles, or generic/placeholder fallback values, or when wiring up a new external OAuth/API integration.
---

# Debugging a broken third-party API / OAuth integration

Built from a real debugging session where a MOPH ID / HealthID OAuth login
kept showing a generic fallback name instead of the real user profile. The
existing code's assumptions about the provider's API (endpoint paths,
response shape, "one token covers everything") were simply wrong, and no
amount of staring at the code found it — only the official integration PDF
and real network traces did.

## The core mistake to avoid

**Do not trust the existing code's assumptions about a third-party API.**
Code that "looks reasonable" (sensible endpoint names like `/oauth/token`,
`/api/v1/users/me`) can still be entirely wrong if nobody verified it against
the provider's actual docs. Time spent reading and re-reading the existing
implementation without an authoritative reference is wasted time. Go get the
reference first.

## Step-by-step

1. **Find the authoritative source before touching code.** Ask the user for
   the official integration guide/PDF/API docs if one might exist — for a
   government or enterprise SSO integration, one almost always does. Don't
   guess endpoint paths by trial-and-error probing (rate limits, wasted
   turns, and you can still miss the real path). If the user hands you a PDF
   URL, note that `WebFetch` often fails to parse binary PDF content — fall
   back to fetching it and reading the saved file with the `Read` tool, which
   handles PDFs natively.

2. **Reproduce with real, verbose logging — not blind guessing.** Add
   temporary debug logging (clearly marked, e.g. `// TEMP DEBUG — remove
   once confirmed working`) at every network hop: request URL, response
   status code, and response body/keys. Don't rely on generic `catch` blocks
   that swallow the real error — a 404 HTML error page parsed as JSON throws
   a confusing `SyntaxError: Unexpected token '<'`, which itself is a strong
   hint the endpoint path is wrong.

3. **Test where the integration actually runs, not where you happen to be
   coding.** Many integrations hardcode a `redirect_uri` or callback domain
   tied to a specific production server. A local dev server on the
   developer's laptop is very often *not* reachable as that domain — find
   out where production actually runs (check `ecosystem.config.js`, deploy
   scripts, or ask) before assuming a code edit will be exercised by the
   next real login attempt. If you don't have direct server access, hand the
   user exact copy-pasteable shell commands rather than assuming they know
   the deploy sequence.

4. **Read the whole doc before writing the fix — SSO flows are often two
   systems wearing one UI.** Don't stop at "found the right token endpoint."
   Check whether the token response actually contains the data you need. If
   it doesn't, the doc will usually describe a *second* downstream API
   (often with its own separate `client_id`/`secret`) that the first token
   must be exchanged against. Implementing only half of a two-system flow
   looks like a fix but silently keeps failing for every real user.

5. **Match field names and shapes exactly, including nesting/arrays.**
   Real API responses frequently differ from a first guess in small but
   fatal ways: fields nested under a `data` wrapper, an `organization` field
   that's an array of affiliations rather than a single object, `snake_case`
   vs `camelCase`, `firstname_th` vs `first_name_th`. Update extraction
   logic to match the doc's example response body verbatim, not a
   plausible-looking guess.

6. **Deploy discipline: code changes need a full cycle, not just a
   restart.** For a built app (e.g. `next start` serving `.next/`), a process
   restart alone serves the *old* build. Every code-change deploy needs:
   pull latest → rebuild → restart with env reload → tail logs. Before
   re-testing after a "fix," confirm the target server's `git log` actually
   contains the fix commit — this catches the single most common wasted
   round-trip (testing against code that was never actually deployed).

7. **Env vars: verify the exact file and exact key names.** In a monorepo,
   confirm which `.env*` file the running app actually loads (per-package,
   not repo root, unless config says otherwise) and that the key names match
   `process.env.X` in the code exactly — a plausible-sounding but wrong name
   (e.g. `PROVIDER_CLIENT_ID` vs the code's `PROVIDER_ID_CLIENT_ID`) fails
   silently with no error, just an empty value.

8. **Clean up temporary debug logging once confirmed working.** Diagnostic
   logs added in step 2 often print secrets-adjacent data (auth codes,
   tokens, full profile payloads) — remove them from the code and redeploy
   once the real fix is verified in production, don't leave them running
   indefinitely.

## Quick checklist for the fix itself

- [ ] Got the official docs (or explicit confirmation none exist)
- [ ] Verified the exact endpoint path, HTTP method, and auth style (header
      vs body vs query) against the docs
- [ ] Verified the response shape (wrapper keys, arrays vs objects, exact
      field names) against a real captured response or the docs' example
- [ ] Confirmed whether the flow is single-system or multi-system (SSO +
      downstream profile API, token-for-token exchange, etc.)
- [ ] Deployed the full cycle (pull/build/restart) and confirmed the target
      server's git log matches
- [ ] Confirmed env vars are in the right file with the right exact names
- [ ] Re-tested end-to-end and captured real logs showing success
- [ ] Removed temporary debug logging and redeployed
