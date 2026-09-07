import {
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_THEME_PRESET_ID,
  type HeroUIThemePresetId,
} from "../data/heroui-theme-preset";

import {
  applyThemePresetToDocument,
  isValidThemePreset,
  ThemeContext,
} from "./theme";

export type Theme = "light" | "dark";

export interface ThemeProviderProps {
  children: ReactNode;
}

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (next: Theme) => void;
  toggleTheme: () => void;
  themePreset: HeroUIThemePresetId;
  setThemePreset: (
    next:
      | HeroUIThemePresetId
      | ((prev: HeroUIThemePresetId) => HeroUIThemePresetId),
  ) => void;
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;

  const theme = localStorage.getItem("theme");

  if (theme === "light" || theme === "dark") {
    return theme;
  }

  return null;
}

function applyDomTheme(theme: Theme): void {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.setAttribute(
    "data-theme",
    theme === "dark" ? "dark" : "light",
  );
}

function readStoredThemePreset(): HeroUIThemePresetId {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_PRESET_ID;
  }

  const themePreset = localStorage.getItem("theme-preset");

  if (themePreset && isValidThemePreset(themePreset)) {
    return themePreset;
  }

  return DEFAULT_THEME_PRESET_ID;
}

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => readStoredTheme() ?? getSystemTheme(),
  );

  const [themePreset, setThemePresetState] =
    useState<HeroUIThemePresetId>(readStoredThemePreset);

  // Apply light/dark mode.
  useLayoutEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  // Apply theme preset, such as sky, spotify, etc.
  useLayoutEffect(() => {
    applyThemePresetToDocument(themePreset);
  }, [themePreset]);

  // Store theme and theme preset in localStorage.
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("theme-preset", themePreset);
  }, [theme, themePreset]);

  const setTheme = (next: Theme): void => {
    setThemeState(next);
  };

  const toggleTheme = (): void => {
    setThemeState((current) =>
      current === "dark" ? "light" : "dark",
    );
  };

  const setThemePreset = (
    next:
      | HeroUIThemePresetId
      | ((prev: HeroUIThemePresetId) => HeroUIThemePresetId),
  ): void => {
    setThemePresetState((prev) => {
      const resolved =
        typeof next === "function" ? next(prev) : next;

      return isValidThemePreset(resolved)
        ? resolved
        : DEFAULT_THEME_PRESET_ID;
    });
  };

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
    themePreset,
    setThemePreset,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
