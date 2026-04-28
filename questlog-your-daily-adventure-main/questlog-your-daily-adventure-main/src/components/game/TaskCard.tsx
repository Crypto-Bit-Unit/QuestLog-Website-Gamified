import { Task } from "@/game/types";
import { DifficultyBadge } from "./DifficultyBadge";
import { TaskTimer } from "./TaskTimer";
import { useGame } from "@/game/store";
import { Check, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const catEmoji: Record<string, string> = { work: "💼", study: "📚", fitness: "💪", creative: "🎨", personal: "🌱" };

export function TaskCard({ task }: { task: Task }) {
  const { toggleTask, deleteTask } = useGame();
  const borderColor = {
    easy: "border-l-diff-easy",
    medium: "border-l-diff-medium",
    hard: "border-l-diff-hard",
    boss: "border-l-diff-boss",
  }[task.difficulty];

  return (
    <div className={`panel border-l-4 ${borderColor} p-4 group transition-all hover:border-primary/50 ${task.completed ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleTask(task.id)}
          className={`mt-0.5 size-6 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
            task.completed ? "bg-success border-success shadow-glow-primary" : "border-muted-foreground/40 hover:border-primary"
          }`}
          aria-label={task.completed ? "Uncomplete" : "Complete"}
        >
          {task.completed && <Check className="size-3.5 text-background" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base">{catEmoji[task.category]}</span>
            <h3 className={`font-display font-semibold text-base truncate ${task.completed ? "line-through" : ""}`}>{task.title}</h3>
            <DifficultyBadge d={task.difficulty} />
            {task.isDaily && <span className="pixel-text text-[8px] text-accent">DAILY</span>}
          </div>
          {task.description && <p className="text-xs text-muted-foreground mt-1">{task.description}</p>}
          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-accent">
                <Zap className="size-3.5 fill-accent" />
                <span className="font-mono font-bold text-sm">+{task.xp} XP</span>
              </div>
              {task.timeSpent > 0 && (
                <span className="text-[11px] text-muted-foreground font-mono">⏱ {Math.floor(task.timeSpent / 60)}m</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <TaskTimer task={task} />
              <Button size="icon" variant="ghost" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteTask(task.id)}>
                <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
