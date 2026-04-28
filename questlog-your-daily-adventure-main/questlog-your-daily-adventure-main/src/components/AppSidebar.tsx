import { NavLink, useLocation } from "react-router-dom";
import { Home, Swords, Timer, BarChart3, Network, Settings as SettingsIcon, Sparkles, GraduationCap, Newspaper } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useGame } from "@/game/store";
import { levelFromXp } from "@/game/types";

const items = [
  { title: "Command Center", url: "/", icon: Home },
  { title: "Daily Quests", url: "/quests", icon: Swords },
  { title: "Time Tracker", url: "/timer", icon: Timer },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Skill Tree", url: "/skills", icon: Network },
  { title: "Learn Hub", url: "/learn", icon: GraduationCap },
  { title: "Content Feed", url: "/content", icon: Newspaper },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { player } = useGame();
  const lvl = levelFromXp(player.xp);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <div className={`px-4 pt-5 pb-4 ${collapsed ? "px-2" : ""}`}>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-gradient-xp flex items-center justify-center shadow-glow-primary shrink-0">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="pixel-text text-[10px] text-primary text-glow">QUESTLOG</div>
                <div className="text-xs text-muted-foreground">v1.0 · {player.name}</div>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="mt-4 panel p-2.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                <span className="font-mono">LVL {lvl.level}</span>
                <span className="font-mono">{lvl.current}/{lvl.needed}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full xp-bar transition-all" style={{ width: `${lvl.progress * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="pixel-text text-[9px] text-muted-foreground/70">NAVIGATE</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-all ${
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <item.icon className={`size-4 shrink-0 ${active ? "text-primary text-glow" : ""}`} />
                        {!collapsed && <span className="font-medium tracking-wide">{item.title}</span>}
                        {active && !collapsed && <span className="ml-auto size-1.5 rounded-full bg-primary shadow-glow-primary" />}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
