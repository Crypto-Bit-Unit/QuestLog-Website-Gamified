import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { COURSES } from "@/game/courses";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Flame, Sparkles, ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "Logic", "Math", "Code", "Mind", "Money", "Writing", "Science"] as const;

function getProgress(courseId: string): number {
  try {
    const raw = localStorage.getItem(`questlog.course.${courseId}`);
    if (!raw) return 0;
    return JSON.parse(raw).progress ?? 0;
  } catch {
    return 0;
  }
}

export default function Learn() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return COURSES.filter((c) => (cat === "All" || c.category === cat) && c.title.toLowerCase().includes(q.toLowerCase()));
  }, [cat, q]);

  const inProgress = COURSES.filter((c) => {
    const p = getProgress(c.id);
    return p > 0 && p < 1;
  });

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="pixel-text text-[10px] text-primary text-glow mb-1">LEARN HUB</div>
          <h1 className="text-3xl font-bold tracking-tight">Skill Academy</h1>
          <p className="text-muted-foreground text-sm">Interactive courses · earn XP for every correct answer.</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses…" className="pl-9" />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
              cat === c ? "bg-primary text-primary-foreground border-primary shadow-glow-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {inProgress.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground pixel-text">
            <Flame className="size-3.5 text-accent" /> CONTINUE LEARNING
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {inProgress.map((c) => {
              const p = getProgress(c.id);
              return (
                <Link key={c.id} to={`/learn/${c.id}`} className="panel p-4 hover:border-primary/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{c.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{c.title}</div>
                      <Progress value={p * 100} className="h-1.5 mt-2" />
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const p = getProgress(c.id);
          const totalQ = c.lessons.reduce((s, l) => s + l.questions.length, 0);
          return (
            <Link key={c.id} to={`/learn/${c.id}`} className="panel p-5 hover:border-primary/50 transition-all group flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{c.emoji}</div>
                <Badge variant="outline" className="text-[10px]">
                  {c.difficulty}
                </Badge>
              </div>
              <h3 className="font-bold text-lg leading-tight mb-1">{c.title}</h3>
              <p className="text-xs text-muted-foreground mb-4 flex-1">{c.blurb}</p>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
                <span>{c.lessons.length} lessons · {totalQ} questions</span>
                <span className="flex items-center gap-1 text-accent font-mono">
                  <Sparkles className="size-3" /> +{c.xpPerQuestion} XP
                </span>
              </div>
              <Progress value={p * 100} className="h-1" />
            </Link>
          );
        })}
      </section>
    </div>
  );
}
