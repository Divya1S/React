# React Learning Projects

A collection of small React projects built while learning React, from the
fundamentals up through Vite, props, and Tailwind CSS. Each folder is a
self-contained project with its own dependencies.

## Projects

| Folder | Stack | Description |
| ------ | ----- | ----------- |
| [`01basicreact`](./01basicreact) | Create React App | Basic React app scaffolded with CRA. |
| [`01vitereact`](./01vitereact) | Vite + React | Minimal Vite-powered React starter. |
| [`02counter`](./02counter) | Vite + React | Counter app exploring state and `useState`. |
| [`03tailwindprops`](./03tailwindprops) | Vite + React + Tailwind CSS | Working with props and Tailwind styling. |
| [`customReact`](./customReact) | Vanilla JS | A from-scratch mini implementation of React's render to understand how it works under the hood. |

## Getting started

Each project manages its own dependencies. To run one, `cd` into its folder
and install:

```bash
cd 01vitereact      # or any project folder
npm install
npm run dev         # CRA projects use `npm start`
```

`customReact` has no build step — open its `index.html` directly in a browser.

## Notes

- `node_modules/`, build output, and editor/OS files are intentionally not
  tracked (see [`.gitignore`](./.gitignore)). Run `npm install` to restore
  dependencies.
