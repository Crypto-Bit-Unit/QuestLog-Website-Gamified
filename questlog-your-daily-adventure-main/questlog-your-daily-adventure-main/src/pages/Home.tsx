import { useGame } from "@/game/store";
import { levelFromXp, rankFromLevel, todayStr } from "@/game/types";
import heroImg from "@/assets/hero.jpg";
import { TaskCard } from "@/components/game/TaskCard";
import { AddQuestDialog } from "@/components/game/AddQuestDialog";
import { Flame, Trophy, Zap, Shield, Brain, Wind, Sword, Star, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ACHIEVEMENTS = [
  { id: "first", icon: Star, label: "First Quest", color: "text-accent" },
  { id: "streak3", icon: Flame, label: "3-Day Fire", color: "text-warning" },
  { id: "boss", icon: Sword, label: "Boss Slayer", color: "text-diff-boss" },
  { id: "focus", icon: Target, label: "Laser Focus", color: "text-primary" },
];

export default function Home() {
  const { player, tasks } = useGame();
  const lvl = levelFromXp(player.xp);
  const today = todayStr();

  const todaysTasks = tasks.filter((t) => t.isDaily || (t.completedAt && new Date(t.completedAt).toISOString().slice(0, 10) === today));
  const previewTasks = tasks.filter((t) => !t.completed).slice(0, 4);
  const completedToday = tasks.filter((t) => t.completed && t.completedAt && new Date(t.completedAt).toISOString().slice(0, 10) === today).length;
  const dailyTotal = tasks.filter((t) => t.isDaily).length || 1;
  const dailyProgress = Math.min(1, completedToday / dailyTotal);

  // weekly calendar
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* HERO */}
      <section className="relative h-[300px] md:h-[360px] rounded-2xl overflow-hidden border border-border">
        <img src={heroImg} alt="Mystical quest portal" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
          <div className="pixel-text text-[10px] text-primary text-glow mb-2">⚔ COMMAND CENTER</div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Welcome back, <span className="gold-text">{player.name}</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg">Your next legend awaits. {previewTasks.length} active quests on the board.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild className="bg-gradient-xp text-primary-foreground font-bold shadow-glow-primary"><Link to="/quests">Enter Quest Board</Link></Button>
            <Button asChild variant="outline" className="border-primary/40"><Link to="/timer">Start Focus Session</Link></Button>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT */}
        <div className="space-y-6 min-w-0">
          {/* PLAYER CARD */}
          <section className="panel-glow p-6 relative overflow-hidden scanline">
            <div className="grid md:grid-cols-[auto_1fr] gap-6">
              <div className="flex flex-col items-center md:items-start gap-3">
                <div className="relative">
                  <div className="size-24 rounded-2xl bg-gradient-hero flex items-center justify-center text-5xl shadow-glow-primary animate-pulse-glow">
                    {player.avatar}
                  </div>
                  <span className="absolute -bottom-2 -right-2 pixel-text text-[9px] bg-accent text-accent-foreground rounded px-1.5 py-1">LVL {lvl.level}</span>
                </div>
                <div className="text-center md:text-left">
                  <div className="font-bold text-lg">{player.name}</div>
                  <div className="pixel-text text-[9px] text-primary">{rankFromLevel(lvl.level).toUpperCase()}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground font-mono">XP {lvl.current} / {lvl.needed}</span>
                    <span className="text-primary font-mono">{Math.floor(lvl.progress * 100)}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden border border-border">
                    <div className="h-full xp-bar transition-all" style={{ width: `${lvl.progress * 100}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Stat icon={Shield} label="STR" value={player.stats.str} color="text-stat-str" />
                  <Stat icon={Wind} label="AGI" value={player.stats.agi} color="text-stat-agi" />
                  <Stat icon={Brain} label="INT" value={player.stats.int} color="text-stat-int" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground pixel-text mb-2">ACHIEVEMENTS</div>
                  <div className="flex gap-2">
                    {ACHIEVEMENTS.map((a) => (
                      <div key={a.id} className="size-10 rounded-md panel flex items-center justify-center hover:scale-110 transition-transform" title={a.label}>
                        <a.icon className={`size-5 ${a.color}`} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* WEEKLY CALENDAR */}
                <div>
                  <div className="text-[10px] text-muted-foreground pixel-text mb-2">THIS WEEK</div>
                  <div className="flex gap-1.5">
                    {week.map((d, i) => {
                      const isToday = d.toDateString() === new Date().toDateString();
                      const active = i < 7 - 1 && (i + player.streak) >= 5; // simulated activity
                      return (
                        <div key={i} className={`flex-1 flex flex-col items-center gap-1 p-2 rounded ${isToday ? "bg-primary/15 border border-primary/40" : "bg-muted/40"}`}>
                          <span className="text-[9px] text-muted-foreground">{["S","M","T","W","T","F","S"][d.getDay()]}</span>
                          <span className={`size-2 rounded-full ${active || isToday ? "bg-primary shadow-glow-primary" : "bg-muted-foreground/30"}`} />
                          <span className="text-[10px] font-mono">{d.getDate()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TASK PREVIEW */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="pixel-text text-[10px] text-primary">►</span> Active Quests
              </h2>
              <AddQuestDialog />
            </div>
            <div className="space-y-3">
              {previewTasks.length === 0 ? (
                <div className="panel p-8 text-center text-muted-foreground">
                  All quests cleared. Add a new one to keep leveling up.
                </div>
              ) : (
                previewTasks.map((t) => <TaskCard key={t.id} task={t} />)
              )}
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-4">
          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="size-5 text-warning text-glow" />
              <span className="pixel-text text-[10px] text-warning">STREAK</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold gold-text">{player.streak}</span>
              <span className="text-muted-foreground text-sm">days</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Keep the fire burning. Complete one quest today.</p>
          </div>

          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="size-5 text-accent" />
              <span className="pixel-text text-[10px] text-accent">NEXT REWARD</span>
            </div>
            <div className="text-sm font-semibold mb-2">Reach Level {lvl.level + 1}</div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-gold" style={{ width: `${lvl.progress * 100}%` }} />
            </div>
            <div className="text-xs text-muted-foreground mt-2 font-mono">{lvl.needed - lvl.current} XP to go</div>
          </div>

          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="size-5 text-primary text-glow" />
              <span className="pixel-text text-[10px] text-primary">DAILY PROGRESS</span>
            </div>
            <div className="text-sm font-semibold mb-2">{completedToday} / {dailyTotal} cleared</div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full xp-bar" style={{ width: `${dailyProgress * 100}%` }} />
            </div>
          </div>

          <div className="panel p-5">
            <div className="pixel-text text-[10px] text-secondary mb-3">⚡ ACTIVE BOOSTS</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-success animate-pulse" /> Morning Focus +10%</li>
              <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-accent animate-pulse" /> Streak Bonus +{Math.min(player.streak * 2, 30)}%</li>
              <li className="flex items-center gap-2 text-muted-foreground"><span className="size-1.5 rounded-full bg-muted-foreground/40" /> Weekend Rush (Sat)</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="panel p-3 text-center">
      <Icon className={`size-4 mx-auto ${color}`} />
      <div className="pixel-text text-[8px] text-muted-foreground mt-1">{label}</div>
      <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
    </div>
  );
}
