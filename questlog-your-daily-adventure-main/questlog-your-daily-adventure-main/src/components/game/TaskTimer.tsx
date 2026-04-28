import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/game/store";
import { Task } from "@/game/types";

export function TaskTimer({ task }: { task: Task }) {
  const { addTimeToTask, logSession } = useGame();
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const startedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  function start() {
    setRunning(true);
    if (startedRef.current === null) startedRef.current = Date.now();
  }
  function pause() {
    setRunning(false);
  }
  function stop() {
    setRunning(false);
    if (seconds > 0) {
      addTimeToTask(task.id, seconds);
      logSession({
        taskId: task.id,
        taskTitle: task.title,
        category: task.category,
        startedAt: startedRef.current ?? Date.now() - seconds * 1000,
        endedAt: Date.now(),
        duration: seconds,
      });
    }
    setSeconds(0);
    startedRef.current = null;
  }

  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted/60 border border-border">
        {running ? (
          <div className="flex items-end gap-[2px] h-3">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="w-[2px] bg-primary rounded-sm animate-wave" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : (
          <span className="size-2 rounded-full bg-muted-foreground/50" />
        )}
        <span className="font-mono text-xs tabular-nums text-foreground/90">{m}:{s}</span>
      </div>
      {running ? (
        <Button size="icon" variant="ghost" className="size-7" onClick={pause}>
          <Pause className="size-3.5" />
        </Button>
      ) : (
        <Button size="icon" variant="ghost" className="size-7" onClick={start}>
          <Play className="size-3.5 text-primary" />
        </Button>
      )}
      {seconds > 0 && (
        <Button size="icon" variant="ghost" className="size-7" onClick={stop}>
          <Square className="size-3.5 text-destructive" />
        </Button>
      )}
    </div>
  );
}
