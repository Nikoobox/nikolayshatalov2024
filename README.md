# nikolayshatalov2024

🚀 A `TypeScript` portfolio built with `Vite` + `React`, styled with `Material UI` and designed in a retro pixel-art space theme. Animations use `framer-motion`, `typewriter-effect` and plain CSS. Reusable components and UI elements keep the look consistent and reduce code duplication, and a custom `MUI` theme defines default styling across the app.

<div align="start">
  <a href="https://nikolayshatalov.com/">Live Site</a>
</div>

## Features

- **Pixel-art landing:** an RPG-style dialog box with typewriter text, an astronaut, and a starfield with parallax driven by CSS scroll-driven animations.
- **Space background:** twinkling stars, shooting stars and a constellation in dark mode. Sputnik and two Soyuz spacecraft fly behind the page sections, and clicking a ship opens a popup with its history.
- **Hidden secrets:** a hint button in the footer lists the easter eggs.
- **Space music:** a music player built on the Web Audio API.
- **Project pages:** client-side routing with `react-router-dom` (`/projects/:projectId`).
- **Contact form:** submissions go through `EmailJS`, with form state and validation handled by `react-hook-form`.
- **Resume:** a modal shows a preview of the resume with a PDF download.
- **Analytics:** `posthog-js`.

## 🌗 Dark mode & light mode

The app switches between `dark` and `light` modes using the `MUI` theming system:

- **Design tokens:** `getDesignTokens` generates the theme for the active mode.
- **State:** the `useCustomTheme` hook keeps the mode in `useState` and saves the user's choice in `localStorage`.
- **Theme creation:** the active theme is built with `createTheme` and memoized with `useMemo`.
- **Toggle:** users switch modes with `toggleDarkMode`.

`React.lazy` and `React.Suspense` load the app with a loading indicator shown in the meantime.

## Getting started

Requires Node 20+ and Yarn.

### Install

```sh
yarn install
```

### Development

```sh
yarn dev
```

Vite prints the local URL in the terminal (usually `http://localhost:5173`).

### Production build

```sh
yarn build
```

Output goes to the `dist/` directory.

### Preview production build

```sh
yarn preview
```

## Deployment

Deployed on Netlify (see `netlify.toml`). It builds with `yarn build`, publishes `dist/`, and sends all routes to `index.html` so React Router works.
