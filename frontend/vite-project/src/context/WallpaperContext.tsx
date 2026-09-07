import { useEffect, useState, type ReactNode } from "react";
import { frameStyleFromUrl, getWallpaperById } from "../data/wallpaper";
import { WallpaperContext } from "./wallpaper";

const STORAGE_KEY = "chat-wallpaper-id";

function readStoredWallpaperId(): string {
  const wallpaperId = localStorage.getItem(STORAGE_KEY);
  if (wallpaperId) return wallpaperId;

  return "sonoma-horizon";
}

interface WallpaperProviderProps {
  children: ReactNode;
}

export function WallpaperProvider({
  children,
}: WallpaperProviderProps) {
  const [wallpaperId, setWallpaperIdState] = useState<string>(
    readStoredWallpaperId
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, wallpaperId);
  }, [wallpaperId]);

  const wallpaper = getWallpaperById(wallpaperId);

  const setWallpaperId = (id: string): void => {
    setWallpaperIdState(id);
  };

  const frameStyle = frameStyleFromUrl(wallpaper.url);

  return (
    <WallpaperContext.Provider
      value={{
        wallpaperId,
        setWallpaperId,
        wallpaper,
        frameStyle,
      }}
    >
      {children}
    </WallpaperContext.Provider>
  );
}
