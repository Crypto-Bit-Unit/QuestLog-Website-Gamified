import { Difficulty } from "@/game/types";

const styles: Record<Difficulty, { label: string; cls: string }> = {
  easy: { label: "EASY", cls: "bg-diff-easy/15 text-diff-easy border-diff-easy/40" },
  medium: { label: "MEDIUM", cls: "bg-diff-medium/15 text-diff-medium border-diff-medium/40" },
  hard: { label: "HARD", cls: "bg-diff-hard/15 text-diff-hard border-diff-hard/40" },
  boss: { label: "BOSS", cls: "bg-diff-boss/15 text-diff-boss border-diff-boss/50 shadow-glow-secondary" },
};

export function DifficultyBadge({ d }: { d: Difficulty }) {
  const s = styles[d];
  return (
    <span className={`pixel-text text-[8px] px-2 py-1 rounded border ${s.cls} tracking-wider`}>
      {s.label}
    </span>
  );
}
