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
