# AI Assistant Reflections

For Assignment 4 I used **Claude** (Anthropic's coding assistant) rather than GitHub Copilot. This file documents the prompts I gave it, the code it produced or critiqued, what worked, what I had to change, and what I learned. The assignment asks about Copilot specifically but the underlying skill — evaluating AI-generated code — is the same, and Claude is now part of my usual workflow.

---

## Session goal

I had a partial scaffold for Assignment 4 based on the code shown in Week 8, which I adapted to my application. The scaffolding included a `routes/api/` folder with an incomplete `api-meetings.js` file, a `services/meetingservice.js` that exported five functions without defining them, and an `app.js`. My goal was to get a working REST API at `/api/meetings` backed by the same service layer the HTML routes use.

I specifically asked Claude not to make any changes, so that I could review its suggestions. I mainly used Claude for debugging purposes. I worked iteratively: asked Claude to review a file at a time, identify errors, then applied fixes myself, asked again, repeated until clean.

---

## Prompt 1 — "Tell me which files will need changes. Do not make changes"

I pasted the five REST endpoints and expected status codes and asked Claude to audit the existing codebase and list what had to change, without editing anything.

**What worked**
- Claude produced a prioritized list covering all relevant files: `services/meetingservice.js`, `routes/api/api-meetings.js`, `app.js`, `routes/meetings.js' and `routes/index.js`.
- This was hepful as it allowed me to be sure I was not missing other files that would need changes
- For each file it explained *why* the change was needed, not just *what* to change. E.g., it flagged that `require("../../middleware/meetingUpload/upload")` pointed at a directory that didn't exist, so the file would throw `MODULE_NOT_FOUND` at startup before any route could be hit.
- It asked me three scoping questions before proceeding (path naming `/api/meetings` vs `/api/items`, whether to handle missing-ID explicitly, DELETE response shape). That prevented a rewrite based on the wrong assumptions.

**What I changed**
- Nothing about the list itself. I worked through the changes one file at a time and asked Claude to re-verify after each edit.

**What I learned**
- Asking the assistant to *plan without implementing* is a better workflow for me than asking it to write the code directly. I keep control of the edits and I end up understanding the codebase instead of just accepting a large diff.

---

## Prompt 2 — Validate and refactor

After I implemented each function in `services/meetingservice.js` and rewrote sections of `routes/api/api-meetings.js`, I repeatedly asked Claude to verify the current state of the file and simplify the code

**What worked**
- Claude caught real bugs I would have otherwise discovered only at runtime:
  - **Duplicate `const meetingService`** declarations in `api-meetings.js` — a `SyntaxError`, file won't parse.
  - **Top-level `await` in a CommonJS file** — I had written a bare `try { await ... }` block outside any function (I'd deleted the `router.post(...)` wrapper by accident).
  - **Brace imbalance** on the POST handler — one too many `}`.
  - **Name mismatch** in `routes/index.js` — I'd imported the service as `Meeting` but called `meetingService.list()`.
- It distinguished "won't load" blockers from "will return the wrong status code" behavior issues, which helped me prioritize.

**What I changed**
- Every time I pasted a fix, Claude would find the next layer of problems. I iterated 5–6 times on `api-meetings.js` before it was clean. Some of those iterations were my typos, some were genuinely new issues exposed by previous fixes.

**What I learned**
- Claude is very good at static analysis of a single file, especially brace-counting and cross-referencing requires against actual files on disk. It's less good at catching cross-file behavior issues without being pointed at them — e.g., the middleware-ordering bug (see Prompt 4) it correctly flagged as a *potential* issue in an audit, but didn't re-raise urgently until I hit the runtime error.

---

## Prompt 3 — "Do I need the middleware?"

Claude had flagged a require for `../../middleware/meetingUpload/upload` in `api-meetings.js`. I asked whether I actually needed it.

**What worked**
- The answer tied to my actual schema: `Meeting.videoUrl` is a `String`, not a file — the assignment stores a URL, not an uploaded video. Multer is for multipart file uploads, which this project doesn't do.
- Claude pointed to the other places in my code that treat `videoUrl` as a string (the HTML form, the service) as evidence.

**What I changed**
- Removed `multer`, the broken middleware import, the `upload` object, and the `upload.single('video')` call from the POST route. Swapped `req.file.path` for `req.body.videoUrl`.

**What I learned**
- "Do I need this?" is a high-leverage question. A lot of my scaffolding was cargo-culted from an the class example and wasn't relevant here. Asking before deleting is faster than researching the library.

---

## Prompt 4 — "Cannot read properties of undefined (reading 'title')"

After Postman-testing a POST, I got this runtime error and pasted it with no other context.

**What worked**
- Claude immediately identified the cause: in `app.js` I had mounted the API router on line 24 but `express.json()` wasn't registered until line 35. Middleware runs in registration order, so `req.body` was `undefined` when my handler read `req.body.title`.
- Claude had actually warned about this exact issue in its earlier audit, calling it the one real bug left to fix — I'd ignored the warning and gotten bitten. After the error message, it made the edit directly (three small `Edit` calls to move the require and the `app.use` to group them with the other route mounts).

**What I changed**
- Nothing beyond Claude's suggested edit. Restarted the server and the POST worked.

**What I learned**
- **Middleware order matters.** This is the #1 thing I took away from this assignment. It's not just CORS or body parsers — any cross-cutting concern has to be registered before the routes that need it.
- Also: when the assistant flags something as "the one real bug left," take it seriously instead of assuming it'll work.

---

## Prompt 5 — "How do I set CORS so any browser can access?" and then "with res.set?"

I first asked for a CORS solution, got a recommendation to `npm install cors` and use the package. Then I asked for the manual `res.set(...)` version instead.

**What worked**
- The manual version covered the non-obvious bits: preflight `OPTIONS` handling (short-circuit with `res.sendStatus(204)`), `Access-Control-Allow-Headers: Content-Type` for JSON POST/PUT to work, and the same middleware-ordering lesson from Prompt 4 (register before the routes).
- Claude also flagged gotchas I didn't ask about: `Access-Control-Allow-Origin: *` can't be used with credentials; custom headers need to be listed. Useful to know even if not needed for the assignment.

**What I changed**
- Copy-pasted the middleware directly. Later Claude caught that I had accidentally duplicated `express.json()` and `express.urlencoded()` after the paste — I deleted the dupes.

**What I learned**
- CORS is two things in a trench coat: a simple-request response header, and a separate preflight handshake. If you only set `Access-Control-Allow-Origin: *` you handle GETs but JSON POSTs silently break.

---

## Prompt 6 — "Update README.md"

Asked Claude to update the README to reflect Assignment 4's additions.

**What worked**
- Claude edited surgically: added a JSON API section with an endpoint/status-code table and a curl example, added an Architecture section showing HTML routes and the API both funnel through the service layer, renamed "Routes" → "HTML routes" for disambiguation. Didn't touch the existing Run/Deploy sections.

**What I changed**
- Nothing so far.

**What I learned**
- Asking for "additive" documentation changes (don't rewrite, just add) is a useful framing. I got a consistent README instead of a reformatted one.
---
## Summarizing prompts

I also asked Claude to summarize all the prompts I used during the sessions to assist me with accurate reporting in this file
---

## Overall reflection

Using Claude on this assignment felt more like pair programming than code completion. The pattern that worked best was: paste the spec, ask for a plan, then iterate file-by-file asking "is this correct now?" after each of my edits. That kept me in the driver's seat — I made the changes, Claude reviewed them — instead of accepting a big AI-generated diff I didn't fully understand.

The strongest uses were **static review** (brace counting, cross-file name mismatches, missing requires) and **diagnostic questions**. The weakest use was when I asked overly open-ended questions like "is it correct now?" without specifying what I cared about — Claude would sometimes re-flag minor style issues alongside real bugs, and I had to mentally sort them. Being specific ("check the POST handler's brace structure") gave better results.

The single most valuable output was the middleware-order diagnosis. I'd have spent an hour debugging "why is `req.body` empty" on my own.

One habit I'll keep: asking the assistant to produce a **plan without code** before any implementation work. One habit I'll change: not ignoring warnings the assistant explicitly labels as blockers.
