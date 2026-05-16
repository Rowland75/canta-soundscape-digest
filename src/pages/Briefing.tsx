import { feedItems } from "@/lib/canta-data";
import { usePlayer } from "@/lib/canta-store";
import { Button } from "@/components/ui/button";
import { Play, AlertTriangle, Calendar, Sparkles, Eye, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

const Section = ({ icon: Icon, label, color, children }: any) => (
  <div className="bg-card rounded-3xl border border-border/60 p-5 shadow-soft">
    <div className="flex items-center gap-2 mb-3">
      <div className={cn("h-7 w-7 rounded-lg grid place-items-center", color)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <h2 className="font-display text-lg">{label}</h2>
    </div>
    {children}
  </div>
);

const Briefing = () => {
  const { play } = usePlayer();
  const top3 = feedItems.filter((i) => i.priority === "critical" || i.priority === "high").slice(0, 3);
  const filtered = feedItems.filter((i) => i.classification === "noise");

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Daily executive briefing</p>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">Monday, May 5</h1>
        <p className="text-muted-foreground mt-2 text-sm">7 prioritized signals · 3 require decision · 84% of inbox filtered</p>

        <Button
          onClick={() => play(top3[0]?.id)}
          size="lg"
          className="mt-5 w-full bg-gradient-hero text-primary-foreground shadow-glow rounded-2xl h-14"
        >
          <Play className="h-5 w-5 mr-2" /> Play full briefing · 8 min 42 sec
        </Button>
      </header>

      <div className="space-y-4">
        <Section icon={Sparkles} label="Top 3 signals" color="bg-gradient-hero text-primary-foreground">
          <div className="space-y-3">
            {top3.map((item, i) => (
              <button
                key={item.id}
                onClick={() => play(item.id)}
                className="w-full text-left flex items-start gap-3 p-3 rounded-2xl hover:bg-accent/40 transition-colors"
              >
                <span className="font-display text-2xl text-primary shrink-0 w-7">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.sender} · {item.duration} · {Math.round(item.confidence * 100)}%</p>
                </div>
                <Play className="h-4 w-4 text-primary mt-1 shrink-0" />
              </button>
            ))}
          </div>
        </Section>

        <Section icon={AlertTriangle} label="Decisions required today" color="bg-gold-soft text-gold-foreground">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between gap-3"><span>Confirm Thursday 2pm with Northbridge Capital</span><span className="text-muted-foreground text-xs shrink-0">Today EOD</span></li>
            <li className="flex justify-between gap-3"><span>Counter Crownline Legal contract (net-30, liability cap)</span><span className="text-muted-foreground text-xs shrink-0">By May 9</span></li>
            <li className="flex justify-between gap-3"><span>Approve Meridian Works infra commit</span><span className="text-muted-foreground text-xs shrink-0">This week</span></li>
          </ul>
        </Section>

        <Section icon={Calendar} label="Deadlines this week" color="bg-accent text-accent-foreground">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Updated burn deck → Northbridge</span><span className="text-muted-foreground text-xs">Tue</span></li>
            <li className="flex justify-between"><span>Crownline Legal counter-signature</span><span className="text-muted-foreground text-xs">May 9</span></li>
            <li className="flex justify-between"><span>Atlas Ridge phase-2 close-out</span><span className="text-muted-foreground text-xs">Fri</span></li>
            <li className="flex justify-between"><span>Resurvey 18 Hoxton (zoning)</span><span className="text-muted-foreground text-xs">May 16</span></li>
          </ul>
        </Section>

        <Section icon={AlertTriangle} label="Risks on the radar" color="bg-destructive/10 text-destructive">
          <ul className="space-y-2 text-sm">
            <li>• Net-90 terms could stretch cash by ~22 days vs runway model.</li>
            <li>• Liability cap removed on Crownline Legal — uncapped damages exposure.</li>
            <li>• Meridian Works burn up 12% MoM, runway down to 14.2 months.</li>
          </ul>
        </Section>

        <Section icon={Eye} label="Strategic context" color="bg-gold-soft text-gold-foreground">
          <p className="text-sm text-foreground/85">EU AI Act enforcement begins August 2. Compliance is becoming a B2B wedge — worth raising on Thursday's Northbridge call as a potential moat narrative.</p>
        </Section>

        <Section icon={Scissors} label="Cutting room floor" color="bg-muted text-muted-foreground">
          <p className="text-xs text-muted-foreground mb-3">Items Canta filtered. Tap any to promote back into the feed.</p>
          <div className="space-y-2">
            {filtered.map((i) => (
              <div key={i.id} className="flex items-center justify-between gap-3 text-sm py-2 border-t border-border/60 first:border-0">
                <div className="min-w-0">
                  <p className="truncate">{i.title}</p>
                  <p className="text-xs text-muted-foreground">{i.sender} · {i.reasoning}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-xs shrink-0">View raw</Button>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Briefing;
