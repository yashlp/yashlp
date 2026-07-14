"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AesTheme = "light" | "dark";

type ThemeContextValue = {
  theme: AesTheme;
  toggleTheme: () => void;
  setTheme: (t: AesTheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "oa_aes_theme";

function applyTheme(theme: AesTheme) {
  const root = document.querySelector(".aesthetics-root");
  if (root) {
    root.setAttribute("data-aes-theme", theme);
  }
  document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AesTheme>("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as AesTheme | null;
      if (stored === "dark" || stored === "light") {
        setThemeState(stored);
        applyTheme(stored);
        return;
      }
    } catch {
      // ignore
    }
    applyTheme("light");
  }, []);

  const setTheme = useCallback((t: AesTheme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAesTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "light" as AesTheme,
      toggleTheme: () => undefined,
      setTheme: () => undefined,
    };
  }
  return ctx;
}
