import { usePlayer } from "@/lib/canta-store";
import { feedItems } from "@/lib/canta-data";
import { Play, Pause, SkipForward, SkipBack, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoice } from "@/lib/canta-store";
import { useEffect, useState } from "react";

export const AudioPlayerBar = () => {
  const { itemId, playing, toggle, stop, play } = usePlayer();
  const { setOpen } = useVoice();
  const [progress, setProgress] = useState(0);

  const item = feedItems.find((i) => i.id === itemId);
  const idx = item ? feedItems.findIndex((i) => i.id === item.id) : -1;

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 0.6)), 120);
    return () => clearInterval(t);
  }, [playing, itemId]);

  useEffect(() => setProgress(0), [itemId]);

  if (!item) return null;

  const next = () => idx < feedItems.length - 1 && play(feedItems[idx + 1].id);
  const prev = () => idx > 0 && play(feedItems[idx - 1].id);

  return (
    <div className="fixed bottom-[68px] lg:bottom-4 inset-x-0 z-40 px-3 lg:left-60 animate-fade-up">
      <div className="mx-auto max-w-3xl glass border border-border/60 rounded-2xl shadow-elevated overflow-hidden">
        <div className="h-1 bg-muted relative">
          <div className="absolute inset-y-0 left-0 bg-gradient-hero transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="p-3 flex items-center gap-3">
          <div className="relative h-11 w-11 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground shrink-0 shadow-glow">
            {playing ? (
              <span className="flex items-end h-5">
                <span className="audio-bar" style={{ animationDelay: "0s" }} />
                <span className="audio-bar" style={{ animationDelay: "0.15s" }} />
                <span className="audio-bar" style={{ animationDelay: "0.3s" }} />
              </span>
            ) : (
              <Play className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{item.sender} · {item.duration}</p>
            <p className="text-sm font-medium truncate">{item.title}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={prev} className="h-9 w-9"><SkipBack className="h-4 w-4" /></Button>
            <Button size="icon" onClick={toggle} className="h-10 w-10 rounded-full bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={next} className="h-9 w-9"><SkipForward className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => setOpen(true)} className="h-9 w-9 text-primary"><Sparkles className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={stop} className="h-9 w-9 hidden sm:inline-flex"><X className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="px-4 pb-3 -mt-1">
          <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
        </div>
      </div>
    </div>
  );
};
