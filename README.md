# nikolayshatalov2024

🚀 A `TypeScript` single-page portfolio built with `Vite` + `React`, featuring `Material UI` library for styling, along with `Particles.js`, `typewriter-effect`, `react-wavify`, and `framer-motion` for dynamic and interactive animations. The application employs reusable components and UI elements to ensure consistency and reduce code duplication. A custom `mui theme` has been implemented to define default styling across the app.

🌗 `Dark Mode` & `Light Mode` Implementation  
This project includes a custom theme toggle between `dark` and `light` modes, utilizing `MUI` theming system. The implementation leverages React's state management to persist user preferences:

- Custom Design Tokens: `getDesignTokens` generates theme variations based on the active mode (`light` or `dark`).
- State Management: The `useCustomTheme` hook manages the theme mode using React's `useState`, and persists the user's preference in `localStorage`.
- Theme Creation: The active theme is dynamically generated with `createTheme` and memoized via `useMemo` for performance optimization.
- Mode Toggle: Users can switch between modes using the `toggleDarkMode` function.

`React.lazy` and `React.Suspense` are used to improve user experience by displaying a loading indicator while waiting for a component to load.

`EmailJS` has been integrated to handle contact form submissions. The `react-hook-form` library is utilized for optimal form state management and validation, and the `react-pdf` package is used to render the PDF resume inside a modal.

The `posthog-js` library provides feature flags, enabling a better development experience and smoother feature releases.

<div align="start">
  <a href="https://nikolayshatalov.com/">Live Site</a>
</div>

## Getting started (Vite)

### Install

```sh
yarn install
```

### Development

```sh
yarn dev
```

Vite will print the local URL in the terminal (commonly `http://localhost:5173`).

### Production build

```sh
yarn build
```

Output is generated in the `dist/` directory.

### Preview production build

```sh
yarn preview
```
