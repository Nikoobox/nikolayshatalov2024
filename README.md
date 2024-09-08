# nikolayshatalov2024

🚀 A `TypeScript` single-page portfolio built with `Create React App`, featuring `Material UI` library for styling, along with `Particles.js`, `typewriter-effect`, `react-wavify`, and `framer-motion` for dynamic and interactive animations. The application employs reusable components and UI elements to ensure consistency and reduce code duplication. A custom `mui theme` has been implemented to define default styling across the app.

🌗 `Dark Mode` & `Light Mode` Implementation
This project includes a custom theme toggle between `dark` and `light` modes, utilizing `MUI` theming system. The implementation leverages React's state management to persist user preferences:

Custom Design Tokens: `getDesignTokens` generates theme variations based on the active mode (`light` or `dark`). These tokens define custom palettes, backgrounds, and typography settings.
State Management: The `useCustomTheme` hook manages the theme mode using React's `useState`, and persists the user's preference in `localStorage`.
Theme Creation: The active theme is dynamically generated with `createTheme` and memoized via `useMemo` for performance optimization.
Mode Toggle: Users can switch between modes using the `toggleDarkMode` function, which updates the state and re-applies the theme.
This setup ensures a consistent and customizable user interface, adapting to both user preferences and system settings.

`React.lazy` and `React.Suspense` are used to improve user experience by displaying a loading indicator while waiting for a component to load.

`EmailJS` has been integrated to handle contact form submissions. The `react-hook-form` library is utilized for optimal form state management and validation, and the `react-pdf` package is used to render the PDF resume inside a modal.

The `posthog-js` library provides feature flags, enabling a better development experience and smoother feature releases.

<div align="start" >
  <a href="https://nikolayshatalov.com/">Live Site</a>
</div>

# Getting Started with Create React App

This project was initialized using [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Starts the application in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will automatically reload if you make changes.\
Any lint errors will be displayed in the console.

### `yarn build`

Builds the application for production in the `build` directory.\
The build process bundles React in production mode and optimizes the output for performance.

The output is minified and includes hashed filenames.\
Your application is now ready for deployment!

For additional information on deployment, refer to the [deployment documentation](https://facebook.github.io/create-react-app/docs/deployment).

## Learn More

You can find more information in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn more about React, visit the [React documentation](https://reactjs.org/).
