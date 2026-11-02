import { useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { feedItems, FeedItem, channelMeta } from "@/lib/canta-data";
import { usePlayer, useVoice, useChannel, ChannelKey } from "@/lib/canta-store";
import { Play, Pause, Sparkles, ChevronRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const PRIORITY_STYLES: Record<string, string> = {
  critical: "bg-gold-soft text-gold-foreground border-gold/40",
  high: "bg-accent text-accent-foreground border-primary/20",
  medium: "bg-muted text-muted-foreground border-border",
  low: "bg-muted text-muted-foreground border-border",
};

const FeedCard = ({ item }: { item: FeedItem }) => {
  const { itemId, playing, play, toggle } = usePlayer();
  const { setOpen } = useVoice();
  const isCurrent = itemId === item.id;
  const [showSource, setShowSource] = useState(false);

  return (
    <motion.article
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-card rounded-3xl border shadow-card p-5 transition-all",
        isCurrent ? "border-primary/40 shadow-glow" : "border-border/60"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border", PRIORITY_STYLES[item.priority])}>
              {item.priority}
            </span>
            <span className="text-xs text-muted-foreground">{item.source}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{item.createdAt}</span>
          </div>
          <h3 className="font-display text-lg mt-2 leading-snug">{item.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{item.sender}{item.project && ` · ${item.project}`}</p>
        </div>
        <button
          onClick={() => (isCurrent ? toggle() : play(item.id))}
          className={cn("h-12 w-12 rounded-full grid place-items-center shrink-0 transition-all", isCurrent && playing ? "bg-gradient-hero text-primary-foreground shadow-glow" : "bg-accent text-primary hover:bg-gradient-hero hover:text-primary-foreground")}
          aria-label={isCurrent && playing ? "Pause" : "Play"}
        >
          {isCurrent && playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>
      </div>

      <p className="text-sm text-foreground/80 mt-4 leading-relaxed">{item.summary}</p>

      <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> {Math.round(item.confidence * 100)}%</span>
          <span>·</span>
          <span>L{item.trustLevel}</span>
          <span>·</span>
          <span>{item.duration}</span>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setOpen(true)} className="text-primary -mr-2">
          <Sparkles className="h-3.5 w-3.5 mr-1" /> Ask Canta
        </Button>
      </div>

      <div className="mt-3 rounded-xl bg-gradient-soft border border-border/60 px-3 py-2 flex items-center gap-2">
        <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0" />
        <p className="text-xs text-foreground/80 flex-1">{item.suggestedAction}</p>
      </div>
      <button onClick={() => setShowSource((v) => !v)} aria-expanded={showSource} className="mt-2 min-h-11 text-xs font-medium text-primary underline-offset-4 hover:underline">
        {showSource ? "Hide source excerpt" : "View source excerpt"}
      </button>
      {showSource && (
        <blockquote className="mt-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground/85">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Demo source excerpt (mock data)</p>
          {item.rawExcerpt}
        </blockquote>
      )}
    </motion.article>
  );
};

const Feed = () => {
  const { channel, setChannel } = useChannel();
  const keys = Object.keys(channelMeta) as ChannelKey[];
  const prevIdx = useRef(keys.indexOf(channel));
  const idx = keys.indexOf(channel);
  const dir = idx >= prevIdx.current ? 1 : -1;
  prevIdx.current = idx;
  const reduced = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (idx + d + keys.length) % keys.length;
    setChannel(keys[n]);
    tabRefs.current[n]?.focus();
  };
  const items = feedItems.filter((i) => i.channel === channel);

  return (
    <div>
      <header className="mb-5">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Today · 7 prioritized signals</p>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">Audio feed</h1>
      </header>

      {/* Channel switcher */}
      <div role="tablist" aria-label="Channels" onKeyDown={onKey} className="relative bg-card rounded-2xl border border-border/60 p-1 flex shadow-soft mb-5">
        {(Object.keys(channelMeta) as Array<keyof typeof channelMeta>).map((k) => {
          const m = channelMeta[k];
          const active = channel === k;
          return (
            <button
              key={k}
              ref={(el) => (tabRefs.current[keys.indexOf(k)] = el)}
              role="tab"
              id={`tab-${k}`}
              aria-selected={active}
              aria-controls="channel-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => setChannel(k)}
              className={cn("relative flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-medium transition-colors z-10", active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {active && (
                <motion.div layoutId="channel-pill" className="absolute inset-0 bg-gradient-hero rounded-xl shadow-glow -z-10" transition={reduced ? { duration: 0 } : { type: "spring", damping: 26, stiffness: 280 }} />
              )}
              <span className="hidden sm:inline">{m.label}</span>
              <span className="sm:hidden">{m.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={channel}
          id="channel-panel"
          role="tabpanel"
          aria-labelledby={`tab-${channel}`}
          initial={reduced ? false : { opacity: 0, x: 24 * dir }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: -24 * dir }}
          transition={{ duration: reduced ? 0 : 0.25 }}
          className="space-y-3"
        >
          {items.map((item) => <FeedCard key={item.id} item={item} />)}
          {items.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">No items in this channel today.</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Feed;
