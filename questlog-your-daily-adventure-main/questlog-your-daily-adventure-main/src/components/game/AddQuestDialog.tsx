import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useGame } from "@/game/store";
import { Difficulty, TaskCategory, XP_BY_DIFFICULTY } from "@/game/types";

export function AddQuestDialog() {
  const { addTask } = useGame();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [category, setCategory] = useState<TaskCategory>("work");
  const [isDaily, setIsDaily] = useState(false);

  function submit() {
    if (!title.trim()) return;
    addTask({ title: title.trim(), description: description.trim() || undefined, difficulty, category, isDaily });
    setTitle(""); setDescription(""); setDifficulty("medium"); setCategory("work"); setIsDaily(false);
    setOpen(false);
  }

  const diffs: { v: Difficulty; cls: string }[] = [
    { v: "easy", cls: "border-diff-easy/40 data-[on=true]:bg-diff-easy/20 data-[on=true]:border-diff-easy data-[on=true]:text-diff-easy" },
    { v: "medium", cls: "border-diff-medium/40 data-[on=true]:bg-diff-medium/20 data-[on=true]:border-diff-medium data-[on=true]:text-diff-medium" },
    { v: "hard", cls: "border-diff-hard/40 data-[on=true]:bg-diff-hard/20 data-[on=true]:border-diff-hard data-[on=true]:text-diff-hard" },
    { v: "boss", cls: "border-diff-boss/40 data-[on=true]:bg-diff-boss/20 data-[on=true]:border-diff-boss data-[on=true]:text-diff-boss" },
  ];
  const cats: TaskCategory[] = ["work", "study", "fitness", "creative", "personal"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-xp text-primary-foreground font-bold shadow-glow-primary hover:opacity-90">
          <Plus className="size-4 mr-1" /> Add Quest
        </Button>
      </DialogTrigger>
      <DialogContent className="panel border-primary/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="pixel-text text-xs text-primary">⚔ NEW QUEST</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Defeat the inbox..." className="bg-input border-border" />
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional lore..." className="bg-input border-border min-h-[60px]" />
          </div>
          <div>
            <Label className="text-xs mb-2 block">Difficulty (XP reward)</Label>
            <div className="grid grid-cols-4 gap-2">
              {diffs.map((d) => (
                <button
                  key={d.v}
                  data-on={difficulty === d.v}
                  onClick={() => setDifficulty(d.v)}
                  className={`pixel-text text-[8px] py-2 rounded border-2 transition-all ${d.cls}`}
                >
                  {d.v.toUpperCase()}<br /><span className="text-[7px] opacity-70">+{XP_BY_DIFFICULTY[d.v]}xp</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs mb-2 block">Category</Label>
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-xs px-3 py-1.5 rounded border transition-all ${category === c ? "bg-primary/20 border-primary text-primary" : "border-border hover:border-primary/50"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={isDaily} onChange={(e) => setIsDaily(e.target.checked)} className="accent-primary" />
            <span>Mark as daily quest</span>
          </label>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-gradient-xp text-primary-foreground">Accept Quest</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
