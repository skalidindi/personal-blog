# Personal Blog

[![CI](https://github.com/skalidindi/personal-blog/actions/workflows/ci.yml/badge.svg)](https://github.com/skalidindi/personal-blog/actions/workflows/ci.yml)

Welcome to my personal blog project built with Next.js!

## Overview

This project is a personal blog where I share my thoughts, experiences, and knowledge on various topics. It is built using Next.js, a powerful React framework that enables server-side rendering and static site generation.

## Features

- **Fast and Responsive**: Built with Next.js for optimal performance.
- **SEO Friendly**: Server-side rendering ensures search engines can easily index the content.
- **Optimized Images**: Images are optimized with preloading blurred images for a better user experience.
- **Dynamic Content**: Easily add and manage blog posts.
- **Customizable**: Tailor the design and functionality to suit your needs.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js 24.21.0 (see `.node-version`)
- npm 11.19.0

Volta users do not need to switch versions manually. The `volta` section in
`package.json` pins both tools, so `node` and `npm` automatically resolve to
the project versions while working anywhere inside this repository.

### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:skalidindi/personal-blog.git
   ```
2. Install npm packages
   ```sh
   npm install
   ```
3. Install Chromium for end-to-end tests
   ```sh
   npx playwright install chromium
   ```
4. Run the development server
   ```sh
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Use `npm run dev` while editing for Fast Refresh. `npm run start` serves the
last production build and does not watch source files.

## Quality checks

The project uses Oxlint for linting, Oxfmt for formatting, Vitest for fast
functional tests, Playwright for browser-level end-to-end tests, and the React
Compiler for automatic component memoization.

```sh
npm run lint          # lint the project
npm run lint:fix      # apply safe lint fixes
npm run fmt:check     # check formatting
npm run fmt           # format the project
npm run typecheck     # run TypeScript without emitting files
npm test              # run Vitest once
npm run test:watch    # run Vitest in watch mode
npm run test:e2e      # build the app and run the Playwright test in Chromium
npm run check         # lint, format-check, type-check, and run Vitest
npm run check:all     # run all checks, Playwright, and a production build
```

Lefthook runs Oxlint and Oxfmt against staged files before each commit. GitHub
Actions repeats the complete quality suite and production E2E test on every
pull request and push to `main`; hooks are only the faster local feedback loop.
Dependabot checks npm and GitHub Actions weekly and enables auto-merge for
minor and patch upgrades after the repository's required checks pass. Major
upgrades remain manual. GitHub's repository setting **Allow auto-merge** must
be enabled and the two CI jobs should be required by `main` branch protection.

## Usage

- **Adding Posts**: Add your markdown files to the `posts` directory.
- **Customizing**: Modify the components and styles to fit your personal style.

## Deployment

This project can be easily deployed on platforms like Vercel, Netlify, or any other hosting service that supports Next.js.

## Domain

Visit my blog at [santoshk.me](https://www.santoshk.me) to see it live!

## License

Distributed under the MIT License. See `LICENSE` for more information.
