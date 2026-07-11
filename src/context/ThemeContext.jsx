import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export default function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(
    localStorage.getItem("theme") || "light"
  );

 useEffect(() => {
  localStorage.setItem("theme", mode);

  if (mode === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}, [mode]);
const toggleTheme = (newMode) => {
  setMode(newMode);

  if (newMode === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
};

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#4f8ef7",
          },
          secondary: {
            main: "#8b5cf6",
          },
          background: {
            default:
              mode === "dark" ? "#0f172a" : "#f5f7fb",
            paper:
              mode === "dark" ? "#1e293b" : "#ffffff",
          },
        },
        shape: {
          borderRadius: 16,
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleTheme,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}