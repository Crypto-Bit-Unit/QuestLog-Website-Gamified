import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { COURSES } from "@/game/courses";
import { useGame } from "@/game/store";
import { levelFromXp } from "@/game/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, Flame, Sparkles, Trophy, RotateCcw, ChevronRight } from "lucide-react";
import { toast } from "sonner";

type Phase = "intro" | "quiz" | "result";

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { player, updatePlayer } = useGame();
  const course = useMemo(() => COURSES.find((c) => c.id === courseId), [courseId]);

  const allQuestions = useMemo(
    () => (course ? course.lessons.flatMap((l) => l.questions.map((q) => ({ ...q, lessonTitle: l.title }))) : []),
    [course],
  );

  const [phase, setPhase] = useState<Phase>("intro");
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);

  if (!course) {
    return (
      <div className="panel p-8 text-center">
        <p>Course not found.</p>
        <Button asChild className="mt-4"><Link to="/learn">Back to Learn</Link></Button>
      </div>
    );
  }

  const current = allQuestions[idx];
  const progress = (idx / allQuestions.length) * 100;

  const start = () => {
    setPhase("quiz");
    setIdx(0); setPicked(null); setStreak(0); setBestStreak(0); setCorrectCount(0); setEarnedXp(0);
  };

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === current.answer;
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      setCorrectCount((c) => c + 1);
      const bonus = newStreak >= 3 ? Math.floor(course.xpPerQuestion * 0.5) : 0;
      const gained = course.xpPerQuestion + bonus;
      setEarnedXp((x) => x + gained);
      if (bonus) toast.success(`🔥 ${newStreak}× streak! +${gained} XP`);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (idx + 1 >= allQuestions.length) {
      // finalize: award XP + persist progress
      if (earnedXp > 0) {
        updatePlayer({ xp: player.xp + earnedXp });
        const before = levelFromXp(player.xp).level;
        const after = levelFromXp(player.xp + earnedXp).level;
        if (after > before) toast.success(`🎉 LEVEL UP! Now level ${after}`);
      }
      try {
        localStorage.setItem(`questlog.course.${course.id}`, JSON.stringify({ progress: 1, completedAt: Date.now() }));
      } catch {}
      setPhase("result");
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  };

  // INTRO
  if (phase === "intro") {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <button onClick={() => navigate("/learn")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> Back to Learn
        </button>
        <div className="panel p-8 text-center">
          <div className="text-7xl mb-3">{course.emoji}</div>
          <Badge variant="outline" className="text-[10px] mb-3">{course.difficulty} · {course.category}</Badge>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">{course.blurb}</p>
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-6 text-sm">
            <div className="panel p-3"><div className="text-lg font-bold">{course.lessons.length}</div><div className="text-xs text-muted-foreground">Lessons</div></div>
            <div className="panel p-3"><div className="text-lg font-bold">{allQuestions.length}</div><div className="text-xs text-muted-foreground">Questions</div></div>
            <div className="panel p-3"><div className="text-lg font-bold text-accent">+{course.xpPerQuestion}</div><div className="text-xs text-muted-foreground">XP each</div></div>
          </div>
          <Button onClick={start} size="lg" className="mt-6 shadow-glow-primary">
            Start Course <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
        <div className="panel p-5">
          <div className="text-xs pixel-text text-muted-foreground mb-3">LESSONS</div>
          <ul className="space-y-2">
            {course.lessons.map((l, i) => (
              <li key={l.id} className="flex items-start gap-3 p-3 rounded-md border border-border">
                <div className="size-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{l.title}</div>
                  <div className="text-xs text-muted-foreground">{l.intro}</div>
                </div>
                <Badge variant="secondary" className="text-[10px]">{l.questions.length} Q</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // RESULT
  if (phase === "result") {
    const accuracy = Math.round((correctCount / allQuestions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto">
        <div className="panel p-8 text-center space-y-4">
          <Trophy className="size-16 mx-auto text-accent" />
          <h1 className="text-3xl font-bold">Course Complete!</h1>
          <p className="text-muted-foreground">{course.title}</p>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="panel p-4"><div className="text-2xl font-bold text-accent">+{earnedXp}</div><div className="text-xs text-muted-foreground">XP earned</div></div>
            <div className="panel p-4"><div className="text-2xl font-bold">{correctCount}/{allQuestions.length}</div><div className="text-xs text-muted-foreground">{accuracy}% correct</div></div>
            <div className="panel p-4"><div className="text-2xl font-bold flex items-center justify-center gap-1"><Flame className="size-5 text-accent" />{bestStreak}</div><div className="text-xs text-muted-foreground">Best streak</div></div>
          </div>
          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={start}><RotateCcw className="size-4" /> Retry</Button>
            <Button asChild><Link to="/learn">More courses</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => navigate("/learn")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Exit
        </button>
        <div className="flex items-center gap-3 text-xs">
          {streak >= 2 && (
            <span className="flex items-center gap-1 text-accent font-mono"><Flame className="size-3.5" /> {streak}× streak</span>
          )}
          <span className="font-mono text-muted-foreground">{idx + 1} / {allQuestions.length}</span>
        </div>
      </div>
      <Progress value={progress} className="h-1.5" />

      <div className="panel p-6 space-y-4">
        <div className="text-[10px] pixel-text text-muted-foreground">{current.lessonTitle}</div>
        <h2 className="text-xl font-bold leading-snug">{current.q}</h2>
        <div className="grid gap-2">
          {current.options.map((opt, i) => {
            const isAnswer = i === current.answer;
            const isPicked = picked === i;
            const show = picked !== null;
            const cls = !show
              ? "border-border hover:border-primary hover:bg-primary/5"
              : isAnswer
                ? "border-success bg-success/10 text-success"
                : isPicked
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border opacity-50";
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={`flex items-center gap-3 text-left p-3.5 rounded-md border-2 transition-all ${cls}`}
              >
                <span className="size-6 rounded-md border border-current flex items-center justify-center text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                <span className="flex-1 text-sm">{opt}</span>
                {show && isAnswer && <Check className="size-4 text-success" />}
                {show && isPicked && !isAnswer && <X className="size-4 text-destructive" />}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className={`p-3 rounded-md text-sm border ${picked === current.answer ? "border-success/40 bg-success/5" : "border-accent/40 bg-accent/5"}`}>
            <div className="font-semibold mb-1 flex items-center gap-2">
              {picked === current.answer ? <><Check className="size-4 text-success" /> Correct! <span className="text-accent ml-auto flex items-center gap-1"><Sparkles className="size-3" /> +{course.xpPerQuestion} XP</span></> : <><X className="size-4 text-destructive" /> Not quite</>}
            </div>
            <p className="text-muted-foreground">{current.explain}</p>
          </div>
        )}

        {picked !== null && (
          <Button onClick={next} className="w-full" size="lg">
            {idx + 1 >= allQuestions.length ? "Finish" : "Next"} <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
