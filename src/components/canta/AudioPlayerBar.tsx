import { usePlayer, useVoice, formatTime, HOLD_MS, lockAxis, shouldDismiss } from "@/lib/canta-store";
import { feedItems } from "@/lib/canta-data";
import { Play, Pause, SkipForward, SkipBack, X, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export const AudioPlayerBar = () => {
  const { itemId, playing, elapsed, duration, ended, toggle, stop, next, prev, tick } = usePlayer();
  const { setOpen } = useVoice();
  const [drag, setDrag] = useState(0);
  const [dismissing, setDismissing] = useState(false);
  const [armed, setArmed] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const axisRef = useRef<"x" | "v" | null>(null);
  const armedRef = useRef(false);
  const dragRef = useRef(0);
  const holdTimer = useRef<number | null>(null);

  // Simulated playback clock: advances by real elapsed time, idles while tab hidden.
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const t = window.setInterval(() => {
      const now = performance.now();
      if (!document.hidden) tick((now - last) / 1000);
      last = now;
    }, 250);
    return () => window.clearInterval(t);
  }, [playing, tick]);

  const clearHold = () => {
    if (holdTimer.current) { window.clearTimeout(holdTimer.current); holdTimer.current = null; }
  };
  useEffect(() => clearHold, []);

  const item = feedItems.find((i) => i.id === itemId);
  if (!item) return null;
  const idx = feedItems.findIndex((i) => i.id === item.id);
  const progress = duration ? (elapsed / duration) * 100 : 0;

  const reset = () => {
    clearHold();
    startRef.current = null; axisRef.current = null; armedRef.current = false; dragRef.current = 0;
    setDrag(0); setArmed(false);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    axisRef.current = null; armedRef.current = false; setArmed(false); clearHold();
    holdTimer.current = window.setTimeout(() => {
      armedRef.current = true; setArmed(true);
      navigator.vibrate?.(15);
    }, HOLD_MS);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (!axisRef.current) {
      const axis = lockAxis(dx, dy);
      if (!axis) return;
      axisRef.current = axis;
      if (axis === "v" || !armedRef.current) { clearHold(); if (axis === "v") { armedRef.current = false; setArmed(false); } }
    }
    if (axisRef.current === "x" && armedRef.current) { dragRef.current = dx; setDrag(dx); }
  };
  const endDrag = () => {
    if (shouldDismiss(armedRef.current, axisRef.current, dragRef.current)) {
      const dir = dragRef.current > 0 ? 1 : -1;
      clearHold();
      setDismissing(true); setDrag(dir * 600);
      window.setTimeout(() => { stop(); setDismissing(false); reset(); }, 200);
      startRef.current = null;
    } else reset();
  };

  const opacity = Math.max(0, 1 - Math.abs(drag) / 260);

  return (
    <div className="fixed bottom-[68px] lg:bottom-4 inset-x-0 z-40 px-3 lg:left-60 animate-fade-up">
      <div
        role="region"
        aria-label="Briefing player"
        className={`mx-auto max-w-3xl surface-spectrum border rounded-2xl shadow-spectrum overflow-hidden touch-pan-y select-none ${armed ? "border-canta-violet/70 ring-2 ring-canta-violet/40" : "border-border/60"}`}
        style={{ transform: `translateX(${drag}px)`, opacity, transition: dismissing || drag === 0 ? "transform 0.2s ease, opacity 0.2s ease" : "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={reset}
      >
        <div className="h-1 bg-muted/60 relative" role="progressbar" aria-label="Playback progress" aria-valuemin={0} aria-valuemax={Math.round(duration)} aria-valuenow={Math.round(elapsed)}>
          <div className="absolute inset-y-0 left-0 bg-gradient-spectrum" style={{ width: `${progress}%` }} />
        </div>
        <div className="p-3 flex items-center gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{item.sender} · {formatTime(elapsed)} / {item.duration} · {ended ? "Finished" : "Simulated playback"}</p>
            <p className="text-sm font-medium truncate">{item.title}</p>
          </div>
          <div className="flex items-center gap-0.5">
            <Button size="icon" variant="ghost" onClick={prev} disabled={idx <= 0} aria-label="Previous briefing" className="h-11 w-11"><SkipBack className="h-4 w-4" /></Button>
            <Button size="icon" onClick={toggle} aria-label={playing ? "Pause" : ended ? "Replay" : "Play"} className="h-11 w-11 rounded-full bg-gradient-spectrum text-primary-foreground shadow-spectrum hover:opacity-90">
              {playing ? <Pause className="h-4 w-4" /> : ended ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={next} disabled={idx >= feedItems.length - 1} aria-label="Next briefing" className="h-11 w-11"><SkipForward className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => setOpen(true)} aria-label="Ask Canta" className="h-11 w-11 text-primary hidden sm:inline-flex"><Sparkles className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={stop} aria-label="Close player" className="h-11 w-11"><X className="h-4 w-4" /></Button>
          </div>
        </div>
        <p className="px-4 pb-3 -mt-1 text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
      </div>
    </div>
  );
};
