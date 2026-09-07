import { AuthActionPanel } from "../components/Auth/AuthActionpanel";
import AuthHeader from "../components/Auth/AuthHeader";
import { AuthHeroPanel } from "../components/Auth/AuthHeroPanel";
import { useWallpaper } from "../context/wallpaper";
import type { ReactNode } from "react";

function AuthPage(): ReactNode {
  const { frameStyle } = useWallpaper();

  return (
    <div
      className="box-border flex min-h-dvh flex-col p-3 sm:p-5 md:p-8"
      style={frameStyle}
    >
      <div className="mx-auto flex w-full max-w-368 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-background text-foreground">
        <AuthHeader />

        <main className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
          <AuthHeroPanel />
          <AuthActionPanel />
        </main>
      </div>
    </div>
  );
}

export default AuthPage;