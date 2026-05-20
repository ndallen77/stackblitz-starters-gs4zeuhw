# Kaleidos Editor — TipTap Sandbox (v0.3)

Real TipTap in a Vite + React project. Built for browser-based IDE environments
(StackBlitz, CodeSandbox) so it runs without local installation.

---

## Running in StackBlitz

The easy path:

1. Go to **stackblitz.com**.
2. Drag this entire folder (or the zip) onto the StackBlitz home page.
3. StackBlitz will detect it's a Vite project, install dependencies, and boot the dev server.
4. The preview pane on the right shows the running editor.

Alternative: log in to StackBlitz with GitHub (free), use **Create > Project > Import from local**, point at this folder.

Once it's running, click **Fork** in StackBlitz to save your own copy under your account — that lets your edits persist between sessions.

---

## Running locally (if you ever leave the Chromebook)

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

---

## What's in here

```
src/
  main.jsx                       — React entry point
  App.jsx                        — Main component, editor + JSON panel + persistence
  styles.css                     — Citizen Sleeper palette, all component styles
  seedDoc.js                     — Default TipTap document loaded on first visit
  extensions/
    GlossaryMark.js              — Inline annotation mark with termId + term attrs
    PullQuoteBlock.jsx           — Block node with React NodeView (inline editing)
    ImageBlock.jsx               — Block node with React NodeView (url/alt/caption)
  components/
    Toolbar.jsx                  — Format buttons + custom block inserters
index.html                       — Shell (loads Google Fonts)
vite.config.js                   — Vite + React config
package.json                     — TipTap 2.10.x, React 18, Vite 6
```

---

## Persistence

The editor autosaves to `localStorage` under the key `kaleidos.article_body.v1`
every 800ms after you stop typing. Refresh the page — your work survives.

Three buttons in the header:

- **Export JSON** — downloads the current document as a `.json` file.
- **Reset** — reloads the seed document (overwrites saved state).
- **Clear Storage** — removes the localStorage key entirely. Reload after to start fresh.

---

## What this proves

- TipTap's document model produces clean JSON that maps directly to the
  `blog_posts.article_body` field (jsonb in Supabase).
- Custom node extensions (`PullQuoteBlock`, `ImageBlock`) integrate
  seamlessly with the editor surface.
- React NodeViews give reviewers an inline-editing UX without leaving the
  document flow.
- Inline marks (`GlossaryMark`) attach structured data (the `termId`) to
  arbitrary text ranges, survive editing, and serialize cleanly.

---

## What this does NOT yet have

Deferred per the editor spec:

- **CarouselBlock** — pattern is the same as ImageBlock, scaled to an array of slides
- **ReferenceMark** and **WikipediaMark** — identical pattern to GlossaryMark, different attrs
- **LwyrBlock** — see OQ-01 in the editor spec; may not be needed
- **Autocomplete against `glossary_terms` table** — currently a `prompt()` for the termId
- **Image upload** — currently URL paste; production needs a Supabase Storage integration
- **The surrounding form fields** — hook, summary, hero, tags, co-reviewers, soundtrack
  (this artifact only handles the article body, which is the hardest part)

Each of these is a known-shape addition. The architecture is in place.

---

## Useful files to read

If you want to understand the TipTap mental model:

- `src/extensions/GlossaryMark.js` — the simplest extension. Read this first.
- `src/extensions/PullQuoteBlock.jsx` — shows the full node + NodeView pattern.
- `src/seedDoc.js` — shows what TipTap JSON actually looks like.

The TipTap docs are at **tiptap.dev**. The "Extensions" section is what you'll
reference most often.
