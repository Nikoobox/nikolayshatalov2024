import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { ThemeContextProvider } from "./theme/ThemeContextProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeContextProvider>
    <App />
  </ThemeContextProvider>
);
