import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { PlayerState, Task, TimeSession, XP_BY_DIFFICULTY, todayStr, levelFromXp, Difficulty, TaskCategory } from "./types";
import { toast } from "sonner";

const KEY = "questlog.v1";

interface SaveData {
  player: PlayerState;
  tasks: Task[];
  sessions: TimeSession[];
}

const DEFAULT_PLAYER: PlayerState = {
  name: "Wanderer",
  avatar: "🧙",
  xp: 0,
  spentXp: 0,
  streak: 0,
  lastActiveDate: "",
  stats: { str: 5, agi: 5, int: 5 },
  unlockedSkills: [],
  achievements: [],
  difficulty: "normal",
  notifications: { daily: true, achievements: true, streak: true },
};

const STARTER_TASKS: Task[] = [
  { id: "t1", title: "Drink 8 glasses of water", difficulty: "easy", category: "personal", xp: XP_BY_DIFFICULTY.easy, completed: false, createdAt: Date.now(), timeSpent: 0, isDaily: true },
  { id: "t2", title: "30-minute focused study", difficulty: "medium", category: "study", xp: XP_BY_DIFFICULTY.medium, completed: false, createdAt: Date.now(), timeSpent: 0, isDaily: true },
  { id: "t3", title: "Workout session", difficulty: "hard", category: "fitness", xp: XP_BY_DIFFICULTY.hard, completed: false, createdAt: Date.now(), timeSpent: 0, isDaily: true },
  { id: "t4", title: "Ship feature to production", difficulty: "boss", category: "work", xp: XP_BY_DIFFICULTY.boss, completed: false, createdAt: Date.now(), timeSpent: 0 },
  { id: "t5", title: "Sketch new design idea", difficulty: "easy", category: "creative", xp: XP_BY_DIFFICULTY.easy, completed: false, createdAt: Date.now(), timeSpent: 0 },
];

function load(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SaveData;
      return {
        player: { ...DEFAULT_PLAYER, ...parsed.player, stats: { ...DEFAULT_PLAYER.stats, ...parsed.player.stats }, notifications: { ...DEFAULT_PLAYER.notifications, ...parsed.player.notifications } },
        tasks: parsed.tasks ?? STARTER_TASKS,
        sessions: parsed.sessions ?? [],
      };
    }
  } catch {}
  return { player: DEFAULT_PLAYER, tasks: STARTER_TASKS, sessions: [] };
}

interface GameContextValue {
  player: PlayerState;
  tasks: Task[];
  sessions: TimeSession[];
  addTask: (t: { title: string; difficulty: Difficulty; category: TaskCategory; isDaily?: boolean; description?: string }) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addTimeToTask: (id: string, seconds: number) => void;
  logSession: (s: Omit<TimeSession, "id">) => void;
  unlockSkill: (id: string, cost: number) => boolean;
  updatePlayer: (patch: Partial<PlayerState>) => void;
  resetAll: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SaveData>(() => load());

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  // streak update on mount
  useEffect(() => {
    const today = todayStr();
    const last = data.player.lastActiveDate;
    if (last !== today) {
      const yesterday = todayStr(new Date(Date.now() - 86400000));
      const newStreak = last === yesterday ? data.player.streak : last === "" ? 0 : 0;
      setData((d) => ({ ...d, player: { ...d.player, lastActiveDate: today, streak: newStreak } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTask: GameContextValue["addTask"] = useCallback((t) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title: t.title,
      description: t.description,
      difficulty: t.difficulty,
      category: t.category,
      xp: XP_BY_DIFFICULTY[t.difficulty],
      completed: false,
      createdAt: Date.now(),
      timeSpent: 0,
      isDaily: t.isDaily,
    };
    setData((d) => ({ ...d, tasks: [task, ...d.tasks] }));
    toast.success("New quest accepted!", { description: t.title });
  }, []);

  const toggleTask: GameContextValue["toggleTask"] = useCallback((id) => {
    setData((d) => {
      const task = d.tasks.find((x) => x.id === id);
      if (!task) return d;
      const willComplete = !task.completed;
      const tasks = d.tasks.map((x) => (x.id === id ? { ...x, completed: willComplete, completedAt: willComplete ? Date.now() : undefined } : x));
      let player = d.player;
      if (willComplete) {
        const before = levelFromXp(player.xp).level;
        const newXp = player.xp + task.xp;
        const after = levelFromXp(newXp).level;
        const today = todayStr();
        const yesterday = todayStr(new Date(Date.now() - 86400000));
        const newStreak = player.lastActiveDate === today ? player.streak : player.lastActiveDate === yesterday ? player.streak + 1 : 1;
        // small stat bumps based on category
        const stats = { ...player.stats };
        if (task.category === "fitness") stats.str += 1;
        if (task.category === "creative" || task.category === "study") stats.int += 1;
        if (task.category === "work" || task.category === "personal") stats.agi += 1;
        player = { ...player, xp: newXp, stats, streak: Math.max(player.streak, newStreak), lastActiveDate: today };
        toast.success(`+${task.xp} XP — ${task.title}`, { description: after > before ? `🎉 LEVEL UP! You are now level ${after}` : undefined });
      } else {
        player = { ...player, xp: Math.max(0, player.xp - task.xp) };
      }
      return { ...d, tasks, player };
    });
  }, []);

  const deleteTask: GameContextValue["deleteTask"] = useCallback((id) => {
    setData((d) => ({ ...d, tasks: d.tasks.filter((x) => x.id !== id) }));
  }, []);

  const addTimeToTask: GameContextValue["addTimeToTask"] = useCallback((id, seconds) => {
    setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, timeSpent: t.timeSpent + seconds } : t)) }));
  }, []);

  const logSession: GameContextValue["logSession"] = useCallback((s) => {
    setData((d) => ({ ...d, sessions: [{ ...s, id: crypto.randomUUID() }, ...d.sessions].slice(0, 500) }));
  }, []);

  const unlockSkill: GameContextValue["unlockSkill"] = useCallback((id, cost) => {
    let ok = false;
    setData((d) => {
      const available = d.player.xp - d.player.spentXp;
      if (available < cost || d.player.unlockedSkills.includes(id)) return d;
      ok = true;
      toast.success("Skill unlocked!", { description: `Spent ${cost} XP` });
      return { ...d, player: { ...d.player, spentXp: d.player.spentXp + cost, unlockedSkills: [...d.player.unlockedSkills, id] } };
    });
    return ok;
  }, []);

  const updatePlayer: GameContextValue["updatePlayer"] = useCallback((patch) => {
    setData((d) => ({ ...d, player: { ...d.player, ...patch } }));
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(KEY);
    setData({ player: DEFAULT_PLAYER, tasks: STARTER_TASKS, sessions: [] });
    toast("Game reset. New journey begins.");
  }, []);

  return (
    <GameContext.Provider value={{ ...data, addTask, toggleTask, deleteTask, addTimeToTask, logSession, unlockSkill, updatePlayer, resetAll }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
}
