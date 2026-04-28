import { useState, useMemo } from "react";
import { SKILLS, BRANCH_META } from "@/game/skills";
import { useGame } from "@/game/store";
import { Lock, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillBranch, SkillNode } from "@/game/types";

const BRANCH_ORDER: SkillBranch[] = ["focus", "discipline", "efficiency", "creativity", "leadership"];

export default function Skills() {
  const { player, unlockSkill } = useGame();
  const [selected, setSelected] = useState<SkillNode | null>(null);

  const available = player.xp - player.spentXp;
  const unlocked = new Set(player.unlockedSkills);

  // Position skills on a grid: branches (cols) x tiers (rows)
  // grid is 5 cols x 4 rows
  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    BRANCH_ORDER.forEach((b, ci) => {
      const branchSkills = SKILLS.filter((s) => s.branch === b).sort((a, b) => a.tier - b.tier);
      branchSkills.forEach((s, ri) => {
        map.set(s.id, { x: 10 + ci * 18, y: 12 + ri * 22 });
      });
    });
    return map;
  }, []);

  function canUnlock(s: SkillNode) {
    if (unlocked.has(s.id)) return false;
    if (available < s.cost) return false;
    return s.requires.every((r) => unlocked.has(r));
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="pixel-text text-[10px] text-primary mb-1">🌳 SKILL TREE</div>
          <h1 className="text-3xl md:text-4xl font-bold">Ascension Matrix</h1>
          <p className="text-muted-foreground text-sm mt-1">Spend XP to unlock permanent bonuses across 5 branches.</p>
        </div>
        <div className="panel p-3 px-5">
          <div className="pixel-text text-[9px] text-accent">AVAILABLE XP</div>
          <div className="text-2xl font-bold gold-text font-mono">{available.toLocaleString()}</div>
        </div>
      </div>

      {/* Branch legend */}
      <div className="flex gap-3 flex-wrap">
        {BRANCH_ORDER.map((b) => (
          <div key={b} className="panel px-3 py-2 flex items-center gap-2">
            <span className="text-lg">{BRANCH_META[b].icon}</span>
            <span className="text-xs font-semibold capitalize" style={{ color: BRANCH_META[b].color }}>{BRANCH_META[b].label}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* TREE */}
        <div className="panel p-4 md:p-6 relative overflow-x-auto">
          <div className="relative min-w-[700px]" style={{ height: 460 }}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {SKILLS.flatMap((s) =>
                s.requires.map((r) => {
                  const p1 = positions.get(r);
                  const p2 = positions.get(s.id);
                  if (!p1 || !p2) return null;
                  const active = unlocked.has(s.id) || (unlocked.has(r) && canUnlock(s));
                  return (
                    <line
                      key={`${r}-${s.id}`}
                      x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                      stroke={active ? BRANCH_META[s.branch].color : "hsl(var(--border))"}
                      strokeWidth="0.4"
                      strokeDasharray={active ? "0" : "1 1"}
                      opacity={active ? 0.8 : 0.4}
                    />
                  );
                })
              )}
            </svg>
            {SKILLS.map((s) => {
              const pos = positions.get(s.id)!;
              const isUnlocked = unlocked.has(s.id);
              const can = canUnlock(s);
              const color = BRANCH_META[s.branch].color;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 size-14 md:size-16 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all hover:scale-110 hover:z-10 ${
                    isUnlocked
                      ? "bg-card shadow-glow-primary"
                      : can
                      ? "bg-card animate-pulse-glow"
                      : "bg-muted/50 opacity-60"
                  } ${selected?.id === s.id ? "ring-2 ring-primary" : ""}`}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    borderColor: isUnlocked || can ? color : "hsl(var(--border))",
                  }}
                >
                  {isUnlocked ? (
                    <Check className="size-5" style={{ color }} />
                  ) : can ? (
                    <Sparkles className="size-5" style={{ color }} />
                  ) : (
                    <Lock className="size-4 text-muted-foreground" />
                  )}
                  <span className="text-[8px] font-mono mt-0.5 leading-none">{s.cost}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DETAIL PANEL */}
        <div className="panel p-5 h-fit lg:sticky lg:top-20">
          {selected ? (
            <div className="space-y-4 animate-scale-in">
              <div>
                <div className="pixel-text text-[9px] mb-1" style={{ color: BRANCH_META[selected.branch].color }}>
                  {BRANCH_META[selected.branch].icon} {BRANCH_META[selected.branch].label.toUpperCase()} · TIER {selected.tier}
                </div>
                <h3 className="text-2xl font-bold">{selected.name}</h3>
                <p className="text-sm text-muted-foreground italic mt-1">{selected.description}</p>
              </div>
              <div className="panel p-3 bg-muted/30">
                <div className="pixel-text text-[9px] text-accent mb-1">BONUS</div>
                <p className="text-sm font-semibold">{selected.bonus}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cost</span>
                <span className="font-mono font-bold gold-text">{selected.cost} XP</span>
              </div>
              {selected.requires.length > 0 && (
                <div className="text-xs">
                  <div className="text-muted-foreground mb-1">Requires:</div>
                  <div className="flex gap-1 flex-wrap">
                    {selected.requires.map((r) => {
                      const req = SKILLS.find((x) => x.id === r);
                      return (
                        <span key={r} className={`px-2 py-0.5 rounded border ${unlocked.has(r) ? "border-success text-success" : "border-destructive text-destructive"}`}>
                          {req?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {unlocked.has(selected.id) ? (
                <div className="text-center py-2 text-success font-bold pixel-text text-[10px]">✓ UNLOCKED</div>
              ) : (
                <Button
                  className="w-full bg-gradient-xp text-primary-foreground font-bold disabled:opacity-40"
                  disabled={!canUnlock(selected)}
                  onClick={() => unlockSkill(selected.id, selected.cost)}
                >
                  {available < selected.cost ? "Not enough XP" : !selected.requires.every((r) => unlocked.has(r)) ? "Locked" : "Unlock Skill"}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a skill node to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
