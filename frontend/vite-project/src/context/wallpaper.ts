import { createContext, useContext } from "react";

import type {
  Wallpaper,
} from "../data/wallpaper";

export interface WallpaperContextValue {
  wallpaper: Wallpaper;
  setWallpaper: (wallpaper: Wallpaper) => void;
}

export const WallpaperContext =
  createContext<WallpaperContextValue | null>(null);

export function useWallpaper(): WallpaperContextValue {
  const ctx = useContext(WallpaperContext);

  if (!ctx) {
    throw new Error(
      "useWallpaper must be used within WallpaperProvider",
    );
  }

  return ctx;
}
