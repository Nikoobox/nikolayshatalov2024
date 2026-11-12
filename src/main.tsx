import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { ThemeContextProvider } from "./theme/ThemeContextProvider";
import LoadingSpinner from "./components/Loader";

const App = lazy(() => import("./App"));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <App />
      </Suspense>
    </ThemeContextProvider>
  </React.StrictMode>
);
