import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useGame } from "@/game/store";
import { levelFromXp, rankFromLevel } from "@/game/types";
import { Flame, Coins } from "lucide-react";

export function AppLayout({ children }: { children: ReactNode }) {
  const { player } = useGame();
  const lvl = levelFromXp(player.xp);
  const available = player.xp - player.spentXp;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border glass sticky top-0 z-40 flex items-center px-4 gap-3">
            <SidebarTrigger className="text-muted-foreground hover:text-primary" />
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="pixel-text text-[9px] text-primary/70">RANK</span>
              <span className="font-display font-semibold text-foreground">{rankFromLevel(lvl.level)}</span>
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 text-sm">
                <Flame className="size-4 text-warning" />
                <span className="font-mono font-semibold">{player.streak}</span>
                <span className="text-muted-foreground hidden sm:inline text-xs">streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Coins className="size-4 text-accent" />
                <span className="font-mono font-semibold gold-text">{available.toLocaleString()}</span>
                <span className="text-muted-foreground hidden sm:inline text-xs">XP</span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md panel">
                <span className="text-2xl">{player.avatar}</span>
                <div className="leading-tight">
                  <div className="text-xs font-semibold">{player.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">LVL {lvl.level}</div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
