import { useGame } from "@/game/store";
import { levelFromXp, TaskCategory } from "@/game/types";
import { TrendingUp, Zap, Target, Trophy } from "lucide-react";

const CATS: TaskCategory[] = ["work", "study", "fitness", "creative", "personal"];
const CAT_COLORS: Record<TaskCategory, string> = {
  work: "hsl(180 95% 55%)",
  study: "hsl(280 80% 60%)",
  fitness: "hsl(0 85% 60%)",
  creative: "hsl(45 100% 60%)",
  personal: "hsl(142 76% 50%)",
};

export default function Analytics() {
  const { player, tasks, sessions } = useGame();
  const lvl = levelFromXp(player.xp);

  // 7-day XP bar chart (from completed tasks)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const xpByDay = days.map((d) => {
    const key = d.toDateString();
    return tasks.filter((t) => t.completed && t.completedAt && new Date(t.completedAt).toDateString() === key).reduce((a, t) => a + t.xp, 0);
  });
  const maxXp = Math.max(50, ...xpByDay);

  // category time donut
  const totalSecsByCat = CATS.map((c) => ({
    cat: c,
    secs: sessions.filter((s) => s.category === c).reduce((a, s) => a + s.duration, 0),
  }));
  const totalSecs = Math.max(1, totalSecsByCat.reduce((a, c) => a + c.secs, 0));

  // KPIs
  const completed = tasks.filter((t) => t.completed).length;
  const totalFocusMin = Math.floor(sessions.reduce((a, s) => a + s.duration, 0) / 60);
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  // 30-day heatmap
  const heat = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toDateString();
    const xp = tasks.filter((t) => t.completed && t.completedAt && new Date(t.completedAt).toDateString() === key).reduce((a, t) => a + t.xp, 0);
    return { d, xp };
  });
  const maxHeat = Math.max(1, ...heat.map((h) => h.xp));

  // donut geometry
  let cum = 0;
  const donut = totalSecsByCat.map((c) => {
    const frac = c.secs / totalSecs;
    const start = cum;
    cum += frac;
    return { ...c, start, frac };
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <div className="pixel-text text-[10px] text-primary mb-1">📊 ANALYTICS</div>
        <h1 className="text-3xl md:text-4xl font-bold">Battle Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your conquest. Measure your power.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI icon={Zap} label="Total XP" value={player.xp.toLocaleString()} accent="text-accent" />
        <KPI icon={Trophy} label="Quests Cleared" value={completed} accent="text-success" />
        <KPI icon={Target} label="Completion Rate" value={`${completionRate}%`} accent="text-primary" />
        <KPI icon={TrendingUp} label="Focus Minutes" value={totalFocusMin} accent="text-secondary" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* XP CHART */}
        <div className="panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">XP Earned · Last 7 Days</h2>
            <span className="pixel-text text-[9px] text-primary">+{xpByDay.reduce((a, b) => a + b, 0)} XP</span>
          </div>
          <div className="flex items-end gap-2 h-48">
            {xpByDay.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end h-full">
                  <div
                    className="w-full rounded-t bg-gradient-xp transition-all hover:opacity-80 relative group"
                    style={{ height: `${(v / maxXp) * 100}%`, minHeight: v > 0 ? "4px" : "0" }}
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition">{v}</span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{["S","M","T","W","T","F","S"][days[i].getDay()]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DONUT */}
        <div className="panel p-6">
          <h2 className="font-bold mb-4">Time by Category</h2>
          <div className="flex items-center gap-6">
            <div className="relative size-44 shrink-0">
              <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" />
                {donut.map((d, i) => {
                  const C = 2 * Math.PI * 40;
                  return (
                    <circle
                      key={i}
                      cx="50" cy="50" r="40" fill="none"
                      stroke={CAT_COLORS[d.cat]}
                      strokeWidth="14"
                      strokeDasharray={`${d.frac * C} ${C}`}
                      strokeDashoffset={-d.start * C}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono">{Math.floor(totalSecs / 60)}</span>
                <span className="text-[10px] text-muted-foreground pixel-text">MINUTES</span>
              </div>
            </div>
            <ul className="space-y-2 text-sm flex-1 min-w-0">
              {totalSecsByCat.map((c) => (
                <li key={c.cat} className="flex items-center gap-2">
                  <span className="size-3 rounded shrink-0" style={{ background: CAT_COLORS[c.cat] }} />
                  <span className="capitalize flex-1 truncate">{c.cat}</span>
                  <span className="font-mono text-xs text-muted-foreground">{Math.floor(c.secs / 60)}m</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* HEATMAP */}
      <div className="panel p-6">
        <h2 className="font-bold mb-4">Activity Heatmap · Last 30 Days</h2>
        <div className="grid grid-cols-15 gap-1.5" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
          {heat.map((h, i) => {
            const intensity = h.xp / maxHeat;
            const bg = h.xp === 0 ? "hsl(var(--muted))" : `hsl(180 95% ${30 + intensity * 30}% / ${0.3 + intensity * 0.7})`;
            return (
              <div
                key={i}
                className="aspect-square rounded-sm border border-border/40"
                style={{ background: bg, boxShadow: intensity > 0.5 ? "0 0 8px hsl(180 95% 55% / 0.4)" : undefined }}
                title={`${h.d.toLocaleDateString()}: +${h.xp} XP`}
              />
            );
          })}
        </div>
      </div>

      {/* LEVEL + STREAK */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="panel p-6">
          <h2 className="font-bold mb-3">Level Progression</h2>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-5xl font-bold gold-text">LVL {lvl.level}</span>
            <span className="text-muted-foreground text-sm">→ {lvl.level + 1}</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full xp-bar" style={{ width: `${lvl.progress * 100}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-2 font-mono">{lvl.current} / {lvl.needed} XP</div>
        </div>
        <div className="panel p-6">
          <h2 className="font-bold mb-3">Streak Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="pixel-text text-[9px] text-warning">CURRENT</div>
              <div className="text-3xl font-bold text-warning">{player.streak}</div>
            </div>
            <div>
              <div className="pixel-text text-[9px] text-accent">RECORD</div>
              <div className="text-3xl font-bold gold-text">{Math.max(player.streak, player.streak)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string | number; accent: string }) {
  return (
    <div className="panel p-4">
      <Icon className={`size-5 ${accent}`} />
      <div className="text-2xl font-bold mt-2 font-mono">{value}</div>
      <div className="text-[10px] text-muted-foreground pixel-text mt-1">{label.toUpperCase()}</div>
    </div>
  );
}
