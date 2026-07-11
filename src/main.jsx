import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./assets/theme.css";
import "./i18n";

import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import AppThemeProvider from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <App />
        </SubscriptionProvider>
      </AuthProvider>
    </AppThemeProvider>
  </React.StrictMode>
);