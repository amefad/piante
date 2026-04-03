import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./AuthContext";
import { AppProvider } from "./AppContext";
import App from "./App";
import Snackbar from "./Snackbar";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AppProvider>
          <App />
          <Snackbar />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
