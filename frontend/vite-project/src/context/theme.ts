import { createContext, useContext } from "react";

import {
  DEFAULT_THEME_PRESET_ID,
  HERO_UI_THEME_PRESETS,
  type HeroUIThemePresetId,
} from "../data/heroui-theme-preset";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (next: Theme) => void;
  toggleTheme: () => void;
  themePreset: HeroUIThemePresetId;
  setThemePreset: (
    next:
      | HeroUIThemePresetId
      | ((prev: HeroUIThemePresetId) => HeroUIThemePresetId)
  ) => void;
}

export const ThemeContext =
  createContext<ThemeContextValue | null>(null);

const PRESET_IDS = new Set<HeroUIThemePresetId>(
  HERO_UI_THEME_PRESETS.map((preset) => preset.id)
);

export function isValidThemePreset(
  presetId: string
): presetId is HeroUIThemePresetId {
  return PRESET_IDS.has(presetId as HeroUIThemePresetId);
}

export function applyThemePresetToDocument(
  presetId: string
): void {
  const id: HeroUIThemePresetId = isValidThemePreset(presetId)
    ? presetId
    : DEFAULT_THEME_PRESET_ID;

  document.documentElement.setAttribute(
    "data-theme-preset",
    id
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error(
      "useTheme must be used within ThemeProvider"
    );
  }

  return ctx;
}
