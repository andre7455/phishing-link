# Welcome to my ~~repo~~ portfolio

Since you're here, you're probably wondering why this site is open-source.  
Well, I am making this site as a showcase of some of my capabilities as a programmer. However, my preference is definitely focused on the backend. By this I mean cloud hosting and networking.

## Deployment Strategy

This site is CI/CD, for example. However, I have implemented this on my own end with a webhook integration—because of reasons.  
I will attempt over time to slowly make this repo more and more of a technical showcase. However, this will be done in the free time I have during my studies.

## Local development

For day-to-day development, run the Vite dev server directly instead of rebuilding Docker. This is the fast workflow: edit files, save, and Vite will hot reload the page. If hot reload does not pick something up, just refresh the browser.

First install dependencies:

```sh
npm install
```

Then start the dev server:

```sh
npm run dev
```

This command keeps running in your terminal. Vite watches your Svelte, Tailwind, and asset files for changes and automatically hot reloads the browser. Leave this terminal open while developing. Stop it with `Ctrl+C` when you are done.

Open the dev site at:

```txt
http://localhost:5173
```

Use this while working on the Svelte/Tailwind frontend. You do **not** need to run `docker compose up --build` after every change.

## AI-assisted development

This repo includes `AGENTS.md` as guidance for AI coding agents. Future AI changes should follow that file, keep the quality commands passing, and add or update tests for every new feature or behavior change.

## Project structure

```txt
src/
  components/  Reusable Svelte components
  routes/      Top-level page/route components
  lib/         Shortcut discovery and shared content-session logic
  styles/      Focused Tailwind component-style modules
  content/
    shortcuts/ Numbered markdown, PDF, and URL shortcut files
  app.css      Tailwind entry point and ordered style imports
  App.svelte   App shell
  main.js      Browser entry point
tests/         Vitest test files, excluded from Docker builds
```

Desktop and mobile share shortcut discovery, icon rendering, content rendering,
and the open/close/redirect logic in `src/lib/shortcutSession.js`. Each launcher has
its own content session. Keep environment-specific layout in the route components
and styling in the corresponding `src/styles/` modules, using Tailwind `@apply`.

## Shortcut content

Add markdown files in `src/content/shortcuts/` named `<number>-<Name>.md`.
The number controls ordering; the name becomes the shortcut label on desktop and mobile.
Put the matching PNG in `public/assets/shortcut-icons/`, for example
`1-About me.md` uses `1-About me.png`.

Markdown images use root-relative asset URLs:

```md
![Photo](/assets/pictures/photo.png)
```

To redirect a shortcut instead of opening markdown content, add this at the top of its file:

```md
---
redirect: https://example.com
---
```

Root-relative destinations such as `/some-page` also work, but that destination must exist.
Redirects navigate the current browser tab on both desktop and mobile.

PDF files also automatically generate shortcuts. Drop a file such as `2-CV.pdf`
into `src/content/shortcuts/` and its matching `2-CV.png` icon into
`public/assets/shortcut-icons/`. PDFs and markdown share the same numeric ordering.

PDFs open inside a resizable desktop frame or the mobile app view. The mobile Home
button returns to the launcher. A direct open/download link is provided because
embedded PDF support varies by browser, especially on mobile.

Plain-text `.url` files also generate shortcuts. For example, create
`src/content/shortcuts/3-GitHub.url` containing only the destination:

```txt
https://github.com/your-name
```

URL shortcuts automatically load the destination site's `/favicon.ico` on desktop,
mobile, and in the Start menu. If it fails to load, the matching local PNG at
`public/assets/shortcut-icons/3-GitHub.png` is used as a fallback. Sites using only
custom favicon paths need that local PNG. Icons are requested directly from the
destination (no third-party service); visitors' browsers contact that site to load
its icon, with no referrer sent. Root-relative links use this site's `/favicon.ico`.

URL shortcuts share
numeric ordering with markdown and PDFs and navigate the current browser tab on
desktop and mobile (including from the Start menu). Root-relative destinations such
as `/some-page` also work. Leading/trailing whitespace is ignored; empty files or
files containing multiple URL lines are rejected. No metadata or `.ini` format is needed.

Vite watches content during development; production content is bundled at build time,
so newly added content files require a production rebuild before deployment.

## Startup preference

After continuing past the intro, the `portfolioStartupSeen` cookie remembers that choice
for one year. Later visits skip the animation. This is a preference cookie, not tracking.
To replay the intro during development, delete that cookie in your browser's developer tools.

## Quality checks

Run unit tests once:

```sh
npm test
```

Run unit tests in watch mode while developing:

```sh
npm run test:watch
```

Run Svelte diagnostics:

```sh
npm run check
```

Run Svelte diagnostics in watch mode while developing:

```sh
npm run check:watch
```

`svelte-check` catches Svelte compiler issues, accessibility warnings, invalid markup, unused component CSS, and type/check-JS problems.

Run ESLint:

```sh
npm run lint
```

The ESLint setup uses Svelte-aware linting plus Google/Airbnb-style JavaScript conventions, including camelCase variable names, semicolons, single quotes, `prefer-const`, strict equality, and a 100-character line limit.

## Production build

```sh
npm run build
```

## Production Docker

The Dockerfile uses multiple stages: Node builds the Svelte app, then Nginx serves only the generated static files in the final image.

```sh
npm run prod
```

The production container will be available at `http://localhost:81`.

Useful production commands:

```sh
npm run prod:logs
npm run prod:down
```

## Goals I Want to Achieve

To be completely honest, I don't really know where I want to go with this page. I was first inspired by [ytcracker](https://ytcracker.com/v2020/) and his website. But I must admit that that does not really meet the goals of my project completely.

One of my big goals here is to have a showcase of my coding skills, and making a desktop env for in the browser would be very cool, NGL. I can put my GitHub in an iframe in there and I will do some cool, unique things. But the creativity needed is not really my thing. So along the way, we’ll see where I end up. I don't think I will do anything CMS-like because, well, let's face it—securing that might be a pain. Although it’s also a fun challenge... maybe I’ll let CTFs run on it, idk.

## What I Have on My TODO for This Page

- Automated testing  
- Blog-like capability  
- To be decided
