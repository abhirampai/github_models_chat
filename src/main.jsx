import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AppState, createAppState } from "./Hooks/utils.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppState.Provider value={createAppState()}>
      <App />
    </AppState.Provider>
  </StrictMode>
);
