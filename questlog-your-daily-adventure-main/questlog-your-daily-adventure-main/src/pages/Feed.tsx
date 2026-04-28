import { useMemo, useState } from "react";
import { FEED_ITEMS, type FeedItem } from "@/game/courses";
import { useGame } from "@/game/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Sparkles, Clock, Play } from "lucide-react";
import { toast } from "sonner";

const CATS = ["All", "Mind", "Money", "Logic", "Code", "Writing"] as const;
const KEY = "questlog.feed.v1";

interface FeedState { liked: string[]; saved: string[]; read: string[] }

function loadState(): FeedState {
  try { return { liked: [], saved: [], read: [], ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { return { liked: [], saved: [], read: [] }; }
}

export default function Feed() {
  const { player, updatePlayer } = useGame();
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [state, setState] = useState<FeedState>(() => loadState());

  const persist = (s: FeedState) => { setState(s); localStorage.setItem(KEY, JSON.stringify(s)); };

  const items = useMemo(() => FEED_ITEMS.filter((i) => cat === "All" || i.category === cat), [cat]);
  const featured = items[0];
  const rest = items.slice(1);

  const toggleLike = (id: string) => {
    const liked = state.liked.includes(id) ? state.liked.filter((x) => x !== id) : [...state.liked, id];
    persist({ ...state, liked });
  };
  const toggleSave = (id: string) => {
    const saved = state.saved.includes(id) ? state.saved.filter((x) => x !== id) : [...state.saved, id];
    persist({ ...state, saved });
    toast(saved.includes(id) ? "Saved to reading list" : "Removed from list");
  };
  const markRead = (item: FeedItem) => {
    if (state.read.includes(item.id)) return;
    persist({ ...state, read: [...state.read, item.id] });
    updatePlayer({ xp: player.xp + item.xp });
    toast.success(`+${item.xp} XP — knowledge gained`);
  };

  const Card = ({ item, hero = false }: { item: FeedItem; hero?: boolean }) => {
    const liked = state.liked.includes(item.id);
    const saved = state.saved.includes(item.id);
    const read = state.read.includes(item.id);
    return (
      <article className={`panel overflow-hidden flex flex-col ${hero ? "lg:col-span-2" : ""}`}>
        <div className={`relative bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 flex items-center justify-center ${hero ? "h-64" : "h-32"}`}>
          <span className={hero ? "text-8xl" : "text-5xl"}>{item.cover}</span>
          <Badge className="absolute top-3 left-3 text-[10px]" variant="secondary">{item.type}</Badge>
          {item.type === "Video" && <div className="absolute inset-0 flex items-center justify-center"><Play className="size-12 text-foreground/80" /></div>}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
            <span>{item.author}</span>·<span className="flex items-center gap-1"><Clock className="size-3" /> {item.minutes} min</span>·<span>{item.category}</span>
          </div>
          <h3 className={`font-bold leading-tight mb-2 ${hero ? "text-2xl" : "text-base"}`}>{item.title}</h3>
          <p className="text-sm text-muted-foreground flex-1">{item.excerpt}</p>
          <div className="flex items-center gap-2 mt-4">
            <Button size="sm" variant={read ? "secondary" : "default"} onClick={() => markRead(item)} disabled={read}>
              {read ? "✓ Read" : <>Read <Sparkles className="size-3 ml-1" /> +{item.xp}</>}
            </Button>
            <button onClick={() => toggleLike(item.id)} className={`size-9 rounded-md border border-border flex items-center justify-center transition-colors ${liked ? "text-destructive border-destructive/50" : "text-muted-foreground hover:text-foreground"}`}>
              <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
            </button>
            <button onClick={() => toggleSave(item.id)} className={`size-9 rounded-md border border-border flex items-center justify-center transition-colors ${saved ? "text-primary border-primary/50" : "text-muted-foreground hover:text-foreground"}`}>
              <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="pixel-text text-[10px] text-primary text-glow mb-1">CONTENT FEED</div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Knowledge Drops</h1>
        <p className="text-muted-foreground text-sm">Curated articles, videos, podcasts. Earn XP for every read.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${cat === c ? "bg-primary text-primary-foreground border-primary shadow-glow-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"}`}>
            {c}
          </button>
        ))}
      </div>

      <section className="grid lg:grid-cols-3 gap-4">
        {featured && <Card item={featured} hero />}
        {rest.map((i) => <Card key={i.id} item={i} />)}
      </section>
    </div>
  );
}
