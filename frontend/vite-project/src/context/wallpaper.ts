import { createContext, useContext, type CSSProperties } from "react";

import type { Wallpaper } from "../data/wallpaper";

export interface WallpaperContextValue {
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  wallpaper: Wallpaper;
  frameStyle: CSSProperties;
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
