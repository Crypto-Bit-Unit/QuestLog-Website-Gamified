import { useState } from "react";
import { useGame } from "@/game/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

const AVATARS = ["🧙", "🧝", "⚔️", "🛡️", "🦸", "🥷", "🤖", "🧑‍🚀", "🐉", "🦊"];
const DIFFS = [
  { v: "casual", label: "Casual", desc: "+50% XP, gentle pace" },
  { v: "normal", label: "Normal", desc: "Balanced grind" },
  { v: "hardcore", label: "Hardcore", desc: "-25% XP, streak resets break stuff" },
] as const;

export default function Settings() {
  const { player, updatePlayer, resetAll } = useGame();
  const [name, setName] = useState(player.name);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-3xl animate-fade-in">
      <div>
        <div className="pixel-text text-[10px] text-primary mb-1">⚙ SETTINGS</div>
        <h1 className="text-3xl md:text-4xl font-bold">Player Configuration</h1>
      </div>

      <section className="panel p-6 space-y-4">
        <h2 className="font-bold pixel-text text-[10px] text-primary">PROFILE</h2>
        <div>
          <Label className="text-xs">Hero Name</Label>
          <div className="flex gap-2 mt-1">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-input border-border" />
            <Button onClick={() => updatePlayer({ name: name.trim() || "Wanderer" })}>Save</Button>
          </div>
        </div>
        <div>
          <Label className="text-xs mb-2 block">Avatar</Label>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => updatePlayer({ avatar: a })}
                className={`size-12 rounded-lg text-2xl border-2 transition-all hover:scale-110 ${
                  player.avatar === a ? "border-primary bg-primary/10 shadow-glow-primary" : "border-border bg-muted/30"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="panel p-6 space-y-4">
        <h2 className="font-bold pixel-text text-[10px] text-primary">NOTIFICATIONS</h2>
        {(["daily", "achievements", "streak"] as const).map((k) => (
          <div key={k} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold capitalize">{k} alerts</div>
              <div className="text-xs text-muted-foreground">
                {k === "daily" ? "Reminder to clear daily quests" : k === "achievements" ? "Notify when you unlock achievements" : "Warn before streak break"}
              </div>
            </div>
            <Switch
              checked={player.notifications[k]}
              onCheckedChange={(v) => updatePlayer({ notifications: { ...player.notifications, [k]: v } })}
            />
          </div>
        ))}
      </section>

      <section className="panel p-6 space-y-4">
        <h2 className="font-bold pixel-text text-[10px] text-primary">DIFFICULTY</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {DIFFS.map((d) => (
            <button
              key={d.v}
              onClick={() => updatePlayer({ difficulty: d.v })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                player.difficulty === d.v ? "border-primary bg-primary/10 shadow-glow-primary" : "border-border hover:border-primary/40"
              }`}
            >
              <div className="font-bold">{d.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{d.desc}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="panel p-6 border-destructive/40">
        <h2 className="font-bold pixel-text text-[10px] text-destructive mb-3">DANGER ZONE</h2>
        <p className="text-sm text-muted-foreground mb-4">Wipe all progress, tasks, and unlocked skills. Cannot be undone.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive"><Trash2 className="size-4 mr-2" /> Reset All Data</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="panel border-destructive/40">
            <AlertDialogHeader>
              <AlertDialogTitle>Wipe everything?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your character, XP, quests, sessions, and unlocked skills.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetAll} className="bg-destructive text-destructive-foreground">Yes, reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
