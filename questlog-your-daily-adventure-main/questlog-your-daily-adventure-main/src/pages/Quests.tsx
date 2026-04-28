import { useState } from "react";
import { useGame } from "@/game/store";
import { TaskCard } from "@/components/game/TaskCard";
import { AddQuestDialog } from "@/components/game/AddQuestDialog";
import { Difficulty } from "@/game/types";

type Filter = "all" | "daily" | "hard" | "boss";

export default function Quests() {
  const { tasks } = useGame();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "daily") return t.isDaily;
    if (filter === "hard") return t.difficulty === "hard";
    if (filter === "boss") return t.difficulty === "boss";
    return true;
  });

  const tabs: { v: Filter; label: string; count: number }[] = [
    { v: "all", label: "All", count: tasks.length },
    { v: "daily", label: "Daily", count: tasks.filter((t) => t.isDaily).length },
    { v: "hard", label: "Hard", count: tasks.filter((t) => t.difficulty === "hard").length },
    { v: "boss", label: "Boss", count: tasks.filter((t) => t.difficulty === "boss").length },
  ];

  const totalXp = tasks.filter((t) => !t.completed).reduce((a, t) => a + t.xp, 0);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="pixel-text text-[10px] text-primary mb-1">⚔ QUEST BOARD</div>
          <h1 className="text-3xl md:text-4xl font-bold">Daily Quests</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} quests · <span className="text-accent font-mono">{totalXp} XP</span> available</p>
        </div>
        <AddQuestDialog />
      </div>

      <div className="flex gap-2 flex-wrap border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.v}
            onClick={() => setFilter(t.v)}
            className={`px-4 py-2 -mb-px text-sm font-semibold transition-all border-b-2 ${
              filter === t.v ? "border-primary text-primary text-glow" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label} <span className="text-xs font-mono opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="panel p-12 text-center">
            <div className="text-5xl mb-3">🗡️</div>
            <p className="text-muted-foreground">No quests in this realm. Forge a new one.</p>
          </div>
        ) : (
          filtered.map((t) => <TaskCard key={t.id} task={t} />)
        )}
      </div>
    </div>
  );
}
