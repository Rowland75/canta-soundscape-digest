import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  key: string;
  title: string;
  subtitle: string;
  options: { value: string; label: string; desc?: string }[];
  multi?: boolean;
}

const STEPS: Step[] = [
  { key: "mode", title: "How do you operate?", subtitle: "Canta tunes its prioritization to your role.", options: [
    { value: "founder", label: "Founder", desc: "Fundraise, product, hiring." },
    { value: "executive", label: "Executive", desc: "Decisions across functions." },
    { value: "lead", label: "Project Lead", desc: "Deep on a few projects." },
    { value: "investor", label: "Investor", desc: "Portfolio signal & deal flow." },
    { value: "consultant", label: "Consultant", desc: "Multi-client context switching." },
  ]},
  { key: "priority", title: "What should Canta prioritize?", subtitle: "Pick what matters most. You can change this later.", multi: true, options: [
    { value: "work", label: "Work Signal", desc: "Direct asks, decisions, blockers." },
    { value: "contracts", label: "Contracts & PDFs", desc: "Legal, financial, strategic docs." },
    { value: "newsletters", label: "Newsletters", desc: "Cross-source strategic synthesis." },
    { value: "personal", label: "Personal", desc: "Family, health, schedule." },
    { value: "finance", label: "Finance / Budgets", desc: "Burn, runway, anomalies." },
  ]},
  { key: "briefing", title: "Preferred briefing mode", subtitle: "How do you want to consume the feed?", options: [
    { value: "focus", label: "Focus", desc: "Top 3 only. Under 5 minutes." },
    { value: "commute", label: "Commute", desc: "Full feed, hands-free, 15–25 min." },
    { value: "deep", label: "Deep Dive", desc: "Verbose with raw sources." },
  ]},
  { key: "risk", title: "Filtering risk preference", subtitle: "How aggressively should Canta filter noise?", options: [
    { value: "conservative", label: "Conservative", desc: "Show more raw items. Filter less." },
    { value: "balanced", label: "Balanced", desc: "Recommended for most users." },
    { value: "aggressive", label: "Aggressive", desc: "Filter heavily. Trust the model." },
  ]},
];

const Onboarding = () => {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({ priority: ["work", "contracts"] });

  const current = STEPS[step];
  const value = answers[current.key];
  const canNext = current.multi ? Array.isArray(value) && value.length > 0 : !!value;

  const select = (v: string) => {
    if (current.multi) {
      const arr = (answers[current.key] as string[]) || [];
      const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
      setAnswers({ ...answers, [current.key]: next });
    } else {
      setAnswers({ ...answers, [current.key]: v });
    }
  };

  const next = () => {
    if (step === STEPS.length - 1) nav("/app");
    else setStep(step + 1);
  };

  const isSelected = (v: string) => current.multi ? Array.isArray(value) && value.includes(v) : value === v;

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <div className="px-4 sm:px-8 pt-6">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          {STEPS.map((_, i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-all", i <= step ? "bg-gradient-hero" : "bg-muted")} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-8 py-10 max-w-2xl mx-auto w-full">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Step {step + 1} of {STEPS.length}</p>
        <h1 className="font-display text-3xl sm:text-5xl mt-3 leading-tight">{current.title}</h1>
        <p className="text-muted-foreground mt-3 text-base sm:text-lg">{current.subtitle}</p>

        <div className="mt-8 space-y-3 animate-fade-up">
          {current.options.map((o) => {
            const sel = isSelected(o.value);
            return (
              <button
                key={o.value}
                onClick={() => select(o.value)}
                className={cn(
                  "w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-4",
                  sel ? "border-primary bg-accent shadow-glow" : "border-border bg-card hover:border-primary/40"
                )}
              >
                <div className={cn("h-6 w-6 rounded-full grid place-items-center shrink-0 mt-0.5 border-2", sel ? "bg-gradient-hero border-transparent text-primary-foreground" : "border-border")}>
                  {sel && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </div>
                <div>
                  <p className="font-semibold">{o.label}</p>
                  {o.desc && <p className="text-sm text-muted-foreground mt-0.5">{o.desc}</p>}
                </div>
              </button>
            );
          })}
        </div>

        {current.key === "risk" && (
          <p className="mt-5 text-sm text-muted-foreground italic">
            Conservative shows more raw items so you can verify Canta. Aggressive filters more noise so you move faster. You can change this anytime.
          </p>
        )}
      </div>

      <div className="sticky bottom-0 bg-background/80 backdrop-blur border-t border-border/60 px-4 sm:px-8 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => step > 0 ? setStep(step - 1) : nav("/")}>Back</Button>
          <Button onClick={next} disabled={!canNext} size="lg" className="bg-gradient-hero text-primary-foreground shadow-glow rounded-2xl px-6">
            {step === STEPS.length - 1 ? "Enter Canta" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
