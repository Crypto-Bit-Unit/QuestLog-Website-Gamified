export type Difficulty = "easy" | "medium" | "hard" | "boss";
export type TaskCategory = "work" | "study" | "fitness" | "creative" | "personal";

export interface Task {
  id: string;
  title: string;
  description?: string;
  difficulty: Difficulty;
  category: TaskCategory;
  xp: number;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  timeSpent: number; // seconds
  isDaily?: boolean;
}

export interface TimeSession {
  id: string;
  taskId?: string;
  taskTitle: string;
  category: TaskCategory;
  startedAt: number;
  endedAt: number;
  duration: number; // seconds
}

export type SkillBranch = "focus" | "discipline" | "efficiency" | "creativity" | "leadership";

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  branch: SkillBranch;
  tier: number; // 1-4
  cost: number; // XP
  bonus: string;
  requires: string[]; // ids
}

export interface PlayerState {
  name: string;
  avatar: string;
  xp: number; // total xp earned
  spentXp: number; // xp spent on skills
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  stats: { str: number; agi: number; int: number };
  unlockedSkills: string[];
  achievements: string[];
  difficulty: "casual" | "normal" | "hardcore";
  notifications: { daily: boolean; achievements: boolean; streak: boolean };
}

export const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 60,
  boss: 150,
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  boss: "BOSS",
};

// Level curve: level n requires n*100 + (n-1)*50 cumulative XP
export function levelFromXp(xp: number): { level: number; current: number; needed: number; progress: number } {
  let level = 1;
  let remaining = xp;
  let needed = 100;
  while (remaining >= needed) {
    remaining -= needed;
    level += 1;
    needed = 100 + (level - 1) * 50;
  }
  return { level, current: remaining, needed, progress: needed > 0 ? remaining / needed : 0 };
}

export function rankFromLevel(level: number): string {
  if (level >= 50) return "Mythic";
  if (level >= 30) return "Legendary";
  if (level >= 20) return "Master";
  if (level >= 10) return "Veteran";
  if (level >= 5) return "Adept";
  return "Novice";
}

export function todayStr(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
