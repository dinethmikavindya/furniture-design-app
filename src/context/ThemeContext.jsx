"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mauve_dark") === "true";
    setDark(saved);
    document.documentElement.setAttribute("data-theme", saved ? "dark" : "light");
  }, []);

  const toggle = () => {
    setDark(d => {
      const next = !d;
      localStorage.setItem("mauve_dark", String(next));
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      return next;
    });
  };

  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
