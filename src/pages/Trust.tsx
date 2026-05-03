import { useState } from "react";
import { trustRules, TrustLevel } from "@/lib/canta-data";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const LEVEL_META: Record<TrustLevel, { label: string; desc: string; color: string }> = {
  1: { label: "Raw", desc: "Always full text. No summarization.", color: "bg-primary text-primary-foreground" },
  2: { label: "Concise", desc: "5-sentence executive summary.", color: "bg-accent text-accent-foreground" },
  3: { label: "Strategic", desc: "Cross-source synthesis. No raw read.", color: "bg-gold-soft text-gold-foreground" },
};

const Trust = () => {
  const [rules, setRules] = useState(trustRules);

  const setLevel = (id: string, level: TrustLevel) => {
    setRules((r) => r.map((x) => x.id === id ? { ...x, level } : x));
    toast.success("Trust level updated");
  };
  const toggleHardPass = (id: string) => {
    setRules((r) => r.map((x) => x.id === id ? { ...x, hardPass: !x.hardPass } : x));
  };
  const toggleActive = (id: string) => {
    setRules((r) => r.map((x) => x.id === id ? { ...x, active: !x.active } : x));
  };

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Trust gradient</p>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">You decide what gets summarized.</h1>
        <p className="text-muted-foreground mt-2 text-sm">Rules apply by sender, project, or type. Hard-Pass means Canta will never summarize — only flag.</p>
      </header>

      <div className="space-y-3">
        {rules.map((rule) => {
          const meta = LEVEL_META[rule.level];
          return (
            <div key={rule.id} className={cn("bg-card rounded-2xl border p-5 shadow-soft transition-opacity", !rule.active && "opacity-50", rule.hardPass ? "border-foreground/40" : "border-border/60")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{rule.name}</p>
                    {rule.hardPass && (
                      <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-foreground text-background flex items-center gap-1">
                        <Lock className="h-2.5 w-2.5" /> Hard-pass
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{rule.scope}</p>
                </div>
                <Switch checked={rule.active} onCheckedChange={() => toggleActive(rule.id)} />
              </div>

              <div className="mt-4 flex items-center gap-1.5 flex-wrap">
                {([1, 2, 3] as TrustLevel[]).map((lvl) => {
                  const m = LEVEL_META[lvl];
                  const active = rule.level === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setLevel(rule.id, lvl)}
                      className={cn("text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all",
                        active ? m.color + " border-transparent shadow-soft" : "border-border bg-background text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      L{lvl} {m.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {meta.desc}
              </p>

              <Button variant="ghost" size="sm" onClick={() => toggleHardPass(rule.id)} className="mt-2 -ml-2 text-xs text-muted-foreground hover:text-foreground">
                <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                {rule.hardPass ? "Remove Hard-Pass" : "Mark as Hard-Pass"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Trust;
