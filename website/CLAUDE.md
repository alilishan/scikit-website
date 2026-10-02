@AGENTS.md

## Hidden pages

- **/process is hidden (since Oct 2026).** `src/app/process/page.tsx` returns 404 because
  `PROCESS_PAGE_ENABLED = false`; the page code and its content (`steps`, `promises` in
  `src/content/home.ts`) are kept. Links to it are commented out in the header, footer, home page
  ("See full process"), `sitemap.ts` and `llms.txt/route.ts`. Each spot is marked
  `PROCESS PAGE HIDDEN`. To restore: set the flag to `true`, uncomment those links, and add
  `"/process"` back to the sitemap list. The home page "How We Work" section still shows the steps.
