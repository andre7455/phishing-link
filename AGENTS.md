# Agent Instructions

This repository is a minimal Svelte/Vite frontend served in production by a multi-stage Docker image.

## Development workflow

- Use `npm run dev` for local development. Vite watches files and hot reloads the browser.
- Use Docker only for production verification with `npm run prod`.
- Do not rebuild Docker after every frontend change during normal development.

## Quality requirements

Every code change should keep these commands passing:

```sh
npm run check
npm run lint
npm test
npm run build
```

## Project structure

- `src/routes/` contains top-level page/route components.
- `src/components/` contains reusable UI components.
- `tests/` contains Vitest test files.
- Keep tests outside `src/` so they are not included in the production Docker build context.

## Testing policy

- Always add or update tests for new features and behavior changes.
- Use Vitest for unit tests.
- Use `@testing-library/svelte` for Svelte component tests.
- Prefer testing user-visible behavior over implementation details.
- Place tests in `tests/`, not next to source files.

## Code style

- Follow the ESLint rules in `eslint.config.js`.
- Use camelCase for variables and functions.
- Use single quotes and semicolons.
- Prefer `const` unless reassignment is required.
- Keep lines at or below 100 characters when practical.
- Keep Svelte components simple and focused.

## Svelte/Tailwind notes

- Prefer Tailwind utility classes for styling.
- Keep global CSS in `src/app.css` minimal.
- Run `npm run check` to catch Svelte compiler, accessibility, unused CSS, and type issues.

## Docker notes

- The production image is built through `Dockerfile`.
- The final runtime stage serves static files with Nginx.
- Keep `.dockerignore` strict so the Docker build context stays small.
