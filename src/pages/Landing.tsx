import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, Mail, FileText, ChevronRight, Radio } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Landing = () => {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const connect = (provider: string) => {
    setOpen(false);
    toast.success(`Demo: ${provider} selected`, { description: "Simulated — no account was connected." });
    setTimeout(() => nav("/onboarding"), 600);
  };

  return (
    <div className="min-h-screen bg-gradient-warm relative overflow-hidden text-foreground">
      {/* Soft ambient light */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-accent/60 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-gold-soft/50 blur-3xl" />

      {/* Top bar */}
      <header className="relative z-20 px-5 sm:px-8 pt-5 sm:pt-7 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-display text-lg leading-none">C</div>
          <div className="leading-tight">
            <p className="font-display text-base">Canta</p>
            
          </div>
        </div>

        <Button asChild size="sm" className="rounded-full bg-card text-foreground hover:bg-card/80 border border-border shadow-soft h-10 pr-2 pl-4 gap-1">
          <Link to="/app">
            Enter <span className="ml-1 h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center"><ChevronRight className="h-3.5 w-3.5" /></span>
          </Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-5 sm:px-10 pt-16 sm:pt-24 pb-32">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div className="animate-fade-up">
            <p className="text-sm sm:text-base text-muted-foreground mb-6">Your audio-first intelligence OS.</p>
            <h1 className="font-display text-[3.25rem] sm:text-7xl lg:text-[6.5rem] leading-[0.95] tracking-tight">
              Hear what matters.<br /><span className="text-spectrum">Act by voice.</span>
            </h1>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="h-14 px-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base shadow-elevated">
                <Link to="/app"><Radio className="mr-2 h-4 w-4" /> Enter Demo</Link>
              </Button>
              <Button size="lg" variant="ghost" onClick={() => setOpen(true)} className="h-14 px-6 rounded-full text-base hover:bg-card/60">
                <Mail className="mr-2 h-4 w-4" /> Connect Inbox <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Connect Inbox — demo</DialogTitle>
            <DialogDescription>Demo provider selection only. No real account is connected and no data leaves this page.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {[
              { name: "Gmail", desc: "Personal & Workspace" },
              { name: "Outlook", desc: "Microsoft 365" },
              { name: "iCloud Mail", desc: "Apple ID" },
              { name: "IMAP", desc: "Any provider" },
            ].map((p) => (
              <button key={p.name} onClick={() => connect(p.name)} className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border hover:border-primary hover:bg-accent/60 transition-all text-left">
                <div className="h-10 w-10 rounded-xl bg-gradient-soft border border-border grid place-items-center"><Mail className="h-4 w-4 text-primary" /></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
            <button onClick={() => connect("PDF Library")} className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border hover:border-primary hover:bg-accent/60 transition-all text-left">
              <div className="h-10 w-10 rounded-xl bg-gradient-soft border border-border grid place-items-center"><FileText className="h-4 w-4 text-primary" /></div>
              <div className="flex-1">
                <p className="font-medium text-sm">Upload PDFs & contracts</p>
                <p className="text-xs text-muted-foreground">Forensic brief only · Hard-Pass</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
