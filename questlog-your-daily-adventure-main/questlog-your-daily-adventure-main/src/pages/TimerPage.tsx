import { useEffect, useRef, useState } from "react";
import { useGame } from "@/game/store";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { TaskCategory } from "@/game/types";

const PRESETS = [
  { label: "Pomodoro", mins: 25 },
  { label: "Deep Work", mins: 50 },
  { label: "Sprint", mins: 15 },
  { label: "Marathon", mins: 90 },
];

const CATS: TaskCategory[] = ["work", "study", "fitness", "creative", "personal"];
const CAT_COLORS: Record<TaskCategory, string> = {
  work: "hsl(180 95% 55%)",
  study: "hsl(280 80% 60%)",
  fitness: "hsl(0 85% 60%)",
  creative: "hsl(45 100% 60%)",
  personal: "hsl(142 76% 50%)",
};

export default function TimerPage() {
  const { sessions, logSession } = useGame();
  const [duration, setDuration] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [label, setLabel] = useState("Focus session");
  const [category, setCategory] = useState<TaskCategory>("work");
  const startedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          finish(duration);
          return duration;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, duration]);

  function start() {
    setRunning(true);
    if (startedRef.current === null) startedRef.current = Date.now();
  }
  function pause() { setRunning(false); }
  function reset() {
    if (running && startedRef.current) {
      const elapsed = duration - remaining;
      if (elapsed > 30) finish(elapsed);
    }
    setRunning(false);
    setRemaining(duration);
    startedRef.current = null;
  }
  function finish(elapsed: number) {
    setRunning(false);
    logSession({
      taskTitle: label || "Focus session",
      category,
      startedAt: startedRef.current ?? Date.now() - elapsed * 1000,
      endedAt: Date.now(),
      duration: elapsed,
    });
    startedRef.current = null;
  }
  function setPreset(mins: number) {
    setDuration(mins * 60);
    setRemaining(mins * 60);
    setRunning(false);
    startedRef.current = null;
  }

  const progress = 1 - remaining / duration;
  const m = Math.floor(remaining / 60).toString().padStart(2, "0");
  const s = (remaining % 60).toString().padStart(2, "0");

  // Today's sessions
  const today = new Date().toDateString();
  const todays = sessions.filter((s) => new Date(s.startedAt).toDateString() === today);
  const totalToday = todays.reduce((a, s) => a + s.duration, 0);

  // Category breakdown today
  const byCat = CATS.map((c) => ({
    cat: c,
    secs: todays.filter((s) => s.category === c).reduce((a, x) => a + x.duration, 0),
  }));
  const maxCat = Math.max(1, ...byCat.map((c) => c.secs));

  // Ring geometry
  const R = 130;
  const C = 2 * Math.PI * R;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <div className="pixel-text text-[10px] text-primary mb-1">⏱ TIME TRACKER</div>
        <h1 className="text-3xl md:text-4xl font-bold">Focus Chamber</h1>
        <p className="text-muted-foreground text-sm mt-1">Channel your energy. Every minute is XP earned.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="panel-glow p-6 md:p-10 flex flex-col items-center scanline relative">
          <div className="flex gap-2 mb-6 flex-wrap justify-center">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setPreset(p.mins)}
                className={`pixel-text text-[9px] px-3 py-2 rounded border transition-all ${
                  duration === p.mins * 60 ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {p.label.toUpperCase()} · {p.mins}M
              </button>
            ))}
          </div>

          <div className="relative size-[320px]">
            <svg viewBox="0 0 300 300" className="size-full -rotate-90">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(180 95% 55%)" />
                  <stop offset="100%" stopColor="hsl(280 80% 60%)" />
                </linearGradient>
              </defs>
              <circle cx="150" cy="150" r={R} stroke="hsl(var(--muted))" strokeWidth="14" fill="none" />
              <circle
                cx="150" cy="150" r={R}
                stroke="url(#ringGrad)"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - progress)}
                className="transition-all duration-300"
                style={{ filter: "drop-shadow(0 0 12px hsl(180 95% 55% / 0.6))" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="pixel-text text-[9px] text-muted-foreground mb-1">{running ? "FOCUSING" : "READY"}</div>
              <div className="text-6xl md:text-7xl font-bold font-mono tabular-nums text-glow text-primary">{m}:{s}</div>
              <div className="text-xs text-muted-foreground mt-2 capitalize">{category} · {label}</div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {running ? (
              <Button size="lg" onClick={pause} variant="outline" className="border-primary/40">
                <Pause className="size-5 mr-2" /> Pause
              </Button>
            ) : (
              <Button size="lg" onClick={start} className="bg-gradient-xp text-primary-foreground shadow-glow-primary px-8">
                <Play className="size-5 mr-2" /> Start
              </Button>
            )}
            <Button size="lg" variant="ghost" onClick={reset}>
              <RotateCcw className="size-5 mr-2" /> Reset
            </Button>
          </div>

          <div className="mt-6 w-full max-w-md space-y-3">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="What are you working on?"
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm focus:outline-none focus:border-primary"
            />
            <div className="flex gap-2 flex-wrap">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-xs px-3 py-1.5 rounded border capitalize transition-all ${
                    category === c ? "bg-primary/20 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="panel p-5">
            <div className="pixel-text text-[10px] text-accent mb-2">TOTAL FOCUS TODAY</div>
            <div className="text-4xl font-bold gold-text">{Math.floor(totalToday / 60)}<span className="text-lg text-muted-foreground"> min</span></div>
            <div className="text-xs text-muted-foreground mt-1">{todays.length} sessions logged</div>
          </div>

          <div className="panel p-5">
            <div className="pixel-text text-[10px] text-primary mb-3">BY CATEGORY</div>
            <div className="space-y-2.5">
              {byCat.map((b) => (
                <div key={b.cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize">{b.cat}</span>
                    <span className="font-mono text-muted-foreground">{Math.floor(b.secs / 60)}m</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full transition-all" style={{ width: `${(b.secs / maxCat) * 100}%`, background: CAT_COLORS[b.cat] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <div className="pixel-text text-[10px] text-secondary mb-3">SESSION LOG</div>
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {todays.length === 0 && <div className="text-xs text-muted-foreground text-center py-6"><Coffee className="size-6 mx-auto mb-2 opacity-50" />No sessions yet today</div>}
              {todays.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded bg-muted/30 border border-border/50">
                  <span className="size-2 rounded-full shrink-0" style={{ background: CAT_COLORS[s.category] }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{s.taskTitle}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">{s.category}</div>
                  </div>
                  <div className="text-xs font-mono text-primary shrink-0">{Math.floor(s.duration / 60)}m</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
