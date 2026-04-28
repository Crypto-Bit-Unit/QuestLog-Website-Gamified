import type { SkillNode } from "./types";

export const SKILLS: SkillNode[] = [
  // FOCUS branch
  { id: "f1", name: "Deep Breath", branch: "focus", tier: 1, cost: 50, bonus: "+5% XP from Easy quests", description: "The first step to mastery — calm the mind.", requires: [] },
  { id: "f2", name: "Tunnel Vision", branch: "focus", tier: 2, cost: 120, bonus: "+10% XP after 25min sessions", description: "Lock in. Distractions fade.", requires: ["f1"] },
  { id: "f3", name: "Flow State", branch: "focus", tier: 3, cost: 250, bonus: "+1 INT permanently", description: "Time bends around you.", requires: ["f2"] },
  { id: "f4", name: "Mind Palace", branch: "focus", tier: 4, cost: 500, bonus: "Double XP on first daily quest", description: "Memory becomes architecture.", requires: ["f3"] },

  // DISCIPLINE branch
  { id: "d1", name: "Iron Will", branch: "discipline", tier: 1, cost: 50, bonus: "+1 STR permanently", description: "Refuse to break.", requires: [] },
  { id: "d2", name: "Streak Saver", branch: "discipline", tier: 2, cost: 120, bonus: "1-day streak shield per week", description: "Even gods need rest days.", requires: ["d1"] },
  { id: "d3", name: "Habit Forged", branch: "discipline", tier: 3, cost: 250, bonus: "+15% XP on streaks ≥ 7", description: "Repetition becomes ritual.", requires: ["d2"] },
  { id: "d4", name: "Unbreakable", branch: "discipline", tier: 4, cost: 500, bonus: "+2 STR, +20% Boss XP", description: "Forged in fire.", requires: ["d3"] },

  // EFFICIENCY branch
  { id: "e1", name: "Quick Hands", branch: "efficiency", tier: 1, cost: 50, bonus: "+1 AGI permanently", description: "Speed is a skill.", requires: [] },
  { id: "e2", name: "Time Shaver", branch: "efficiency", tier: 2, cost: 120, bonus: "-10% est. time on tasks", description: "Trim the fat from every minute.", requires: ["e1"] },
  { id: "e3", name: "Multi-Thread", branch: "efficiency", tier: 3, cost: 250, bonus: "Track 2 timers simultaneously", description: "Parallelize your life.", requires: ["e2"] },
  { id: "e4", name: "Optimizer", branch: "efficiency", tier: 4, cost: 500, bonus: "+25% XP on Hard quests", description: "Maximum output, minimum waste.", requires: ["e3"] },

  // CREATIVITY branch
  { id: "c1", name: "Spark", branch: "creativity", tier: 1, cost: 50, bonus: "+5% XP on creative tasks", description: "Every flame starts here.", requires: [] },
  { id: "c2", name: "Wild Idea", branch: "creativity", tier: 2, cost: 120, bonus: "+1 INT permanently", description: "Strange thoughts welcome.", requires: ["c1"] },
  { id: "c3", name: "Maker", branch: "creativity", tier: 3, cost: 250, bonus: "+15% XP on creative tasks", description: "Bring it into the world.", requires: ["c2"] },
  { id: "c4", name: "Visionary", branch: "creativity", tier: 4, cost: 500, bonus: "Unlock prismatic quest cards", description: "See what others can't.", requires: ["c3"] },

  // LEADERSHIP branch
  { id: "l1", name: "Voice", branch: "leadership", tier: 1, cost: 50, bonus: "+5% XP daily", description: "Speak with intent.", requires: [] },
  { id: "l2", name: "Standard Bearer", branch: "leadership", tier: 2, cost: 120, bonus: "+1 STR, +1 AGI", description: "Carry the flag.", requires: ["l1"] },
  { id: "l3", name: "Commander", branch: "leadership", tier: 3, cost: 250, bonus: "Daily quest reward +30%", description: "Lead from the front.", requires: ["l2"] },
  { id: "l4", name: "Sovereign", branch: "leadership", tier: 4, cost: 500, bonus: "All stats +2", description: "The throne is yours.", requires: ["l3"] },
];

export const BRANCH_META: Record<string, { label: string; color: string; icon: string }> = {
  focus: { label: "Focus", color: "hsl(180 95% 55%)", icon: "🎯" },
  discipline: { label: "Discipline", color: "hsl(0 85% 60%)", icon: "🛡️" },
  efficiency: { label: "Efficiency", color: "hsl(45 100% 60%)", icon: "⚡" },
  creativity: { label: "Creativity", color: "hsl(280 80% 65%)", icon: "✨" },
  leadership: { label: "Leadership", color: "hsl(142 76% 50%)", icon: "👑" },
};
