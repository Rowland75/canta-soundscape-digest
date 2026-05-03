import { useState } from "react";
import { triageItems, Classification } from "@/lib/canta-data";
import { Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const TABS: { key: Classification; label: string; color: string }[] = [
  { key: "signal", label: "Signal", color: "bg-gradient-hero text-primary-foreground" },
  { key: "context", label: "Context", color: "bg-accent text-accent-foreground" },
  { key: "noise", label: "Noise", color: "bg-muted text-muted-foreground" },
];

const Triage = () => {
  const [items, setItems] = useState(triageItems);
  const [filter, setFilter] = useState<Classification | "all">("all");

  const reclassify = (id: string, to: Classification) => {
    setItems((arr) => arr.map((i) => i.id === id ? { ...i, classification: to } : i));
    toast.success("Canta will learn from this correction.", { description: "Your trust gradient is being updated." });
  };

  const counts = {
    signal: items.filter((i) => i.classification === "signal").length,
    context: items.filter((i) => i.classification === "context").length,
    noise: items.filter((i) => i.classification === "noise").length,
  };

  const visible = filter === "all" ? items : items.filter((i) => i.classification === filter);

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Semantic triage</p>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">What came in today</h1>
        <p className="text-muted-foreground mt-2 text-sm">Every item explains itself. Correct any classification and Canta learns.</p>
      </header>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {(["signal", "context", "noise"] as const).map((k, idx) => (
          <button
            key={k}
            onClick={() => setFilter(filter === k ? "all" : k)}
            className={cn("rounded-2xl p-4 text-left border transition-all",
              filter === k ? "border-primary shadow-glow" : "border-border/60 bg-card hover:border-primary/40"
            )}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{k}</p>
            <p className="font-display text-3xl mt-1">{counts[k]}</p>
            <p className={cn("text-[10px] mt-1 font-medium", idx === 0 ? "text-gold-foreground" : idx === 1 ? "text-primary" : "text-muted-foreground")}>
              {idx === 0 ? "Act today" : idx === 1 ? "Awareness" : "Auto-archived"}
            </p>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((item) => (
          <div key={item.id} className="bg-card rounded-2xl border border-border/60 p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{item.sender} · {item.source}</p>
                <p className="font-medium text-sm mt-1">{item.title}</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-xs text-primary flex items-center gap-1 shrink-0 hover:underline">
                    <Info className="h-3 w-3" /> Why?
                  </button>
                </PopoverTrigger>
                <PopoverContent className="rounded-2xl text-sm">
                  <p className="font-semibold mb-1">Why Canta classified this</p>
                  <p className="text-muted-foreground">{item.reasoning}</p>
                  <p className="text-xs mt-2 text-primary">Confidence: {Math.round(item.confidence * 100)}%</p>
                </PopoverContent>
              </Popover>
            </div>
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => reclassify(item.id, t.key)}
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all",
                    item.classification === t.key
                      ? t.color + " border-transparent shadow-soft"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {t.label}
                </button>
              ))}
              <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                {Math.round(item.confidence * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Triage;
