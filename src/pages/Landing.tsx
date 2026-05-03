import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, Mic, Radio, Shield, Sparkles, Mail, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Landing = () => {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const connect = (provider: string) => {
    setOpen(false);
    toast.success(`${provider} connected`, { description: "Your inbox is now cold storage. Canta will start the briefing." });
    setTimeout(() => nav("/onboarding"), 600);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 glass border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-hero shadow-glow grid place-items-center text-primary-foreground font-display font-bold">C</div>
            <span className="font-display text-xl font-semibold">Canta</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#pillars" className="hover:text-foreground">Architecture</a>
            <a href="#privacy" className="hover:text-foreground">Privacy</a>
          </nav>
          <Link to="/app"><Button size="sm" variant="ghost">Enter Demo</Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft pointer-events-none" />
        <div className="absolute top-20 -right-32 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 pt-12 sm:pt-24 pb-16 sm:pb-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium border border-primary/10 animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Audio-first intelligence OS · Private beta
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-semibold mt-6 leading-[0.95] tracking-tight animate-fade-up">
            Stop reading <span className="text-gradient italic">everything</span>.<br />
            Hear what matters.<br />
            <span className="text-muted-foreground/80">Act by voice.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed animate-fade-up">
            Canta turns your inbox, contracts, and newsletters into a flippable audio feed of prioritized briefings —
            so executives, founders, and high-output professionals can move at the speed of decisions, not documents.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 animate-fade-up">
            <Button asChild size="lg" className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-95 text-base h-14 px-7 rounded-2xl">
              <Link to="/app">Enter Demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setOpen(true)} className="text-base h-14 px-7 rounded-2xl">
              <Mail className="mr-2 h-4 w-4" /> Connect Inbox
            </Button>
          </div>

          {/* Floating preview */}
          <div className="mt-16 sm:mt-20 max-w-2xl mx-auto">
            <div className="bg-card rounded-3xl border border-border/60 shadow-elevated p-5 sm:p-6 animate-fade-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-hero grid place-items-center text-primary-foreground shadow-glow">
                  <span className="flex items-end h-5"><span className="audio-bar" /><span className="audio-bar" style={{ animationDelay: ".15s" }} /><span className="audio-bar" style={{ animationDelay: ".3s" }} /></span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Now playing · 1:42</p>
                  <p className="font-medium">Caldwell Capital signals interest in Series A lead</p>
                </div>
                <span className="text-[10px] uppercase font-semibold tracking-widest px-2 py-1 rounded-full bg-gold-soft text-gold-foreground">Critical</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "James confirms partner-level interest. Wants a deep dive Thursday. Asks for updated burn and 18-month plan before the call."
              </p>
              <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Confidence 96%</span>
                <span>Suggested: Reply · Confirm Thursday 2pm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section id="pillars" className="max-w-6xl mx-auto px-4 sm:px-8 py-20">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">The architecture</p>
        <h2 className="font-display text-3xl sm:text-5xl mt-3 max-w-3xl">Your inbox becomes cold storage. Canta becomes the intelligence layer.</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {[
            { icon: Radio, title: "Audio-first feed", body: "Three TV-style channels — Work Signal, Strategic Intelligence, Personal. Flip through prioritized briefings the way you flip through music." },
            { icon: Sparkles, title: "Semantic triage", body: "Every item is classified into Signal, Context, or Noise — with a transparent explanation for every decision Canta makes." },
            { icon: Mic, title: "Command by voice", body: "\"Brief me on SendUs.\" \"Read the contract.\" \"Reply we accept but insist on the 2-inch hem.\" Canta confirms before high-impact actions." },
          ].map((p) => (
            <div key={p.title} className="bg-card border border-border/60 rounded-3xl p-6 shadow-card hover:shadow-elevated transition-shadow">
              <div className="h-11 w-11 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground shadow-glow"><p.icon className="h-5 w-5" /></div>
              <h3 className="font-display text-xl mt-5">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="max-w-6xl mx-auto px-4 sm:px-8 py-20 border-t border-border/60">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold">Trust gradient</p>
            <h2 className="font-display text-3xl sm:text-5xl mt-3">You decide what gets summarized — and what stays raw.</h2>
            <p className="text-muted-foreground mt-5 leading-relaxed">
              Investor emails always come through verbatim. Project updates get concise. Newsletters become strategic synthesis. Legal contracts can be flagged Hard-Pass — never summarized.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { tag: "Level 1 · Raw", color: "bg-primary text-primary-foreground", name: "Investor Emails", desc: "Always full text. Confidence 100%." },
              { tag: "Level 2 · Concise", color: "bg-accent text-accent-foreground", name: "SendUs Project", desc: "5-sentence executive summary." },
              { tag: "Level 3 · Strategic", color: "bg-gold-soft text-gold-foreground", name: "Newsletters", desc: "Cross-source synthesis. No raw consumption needed." },
              { tag: "Hard-Pass", color: "bg-foreground text-background", name: "Legal Contracts", desc: "Never auto-summarized. Forensic brief only." },
            ].map((r) => (
              <div key={r.name} className="bg-card rounded-2xl border border-border/60 p-4 shadow-soft flex items-center gap-4">
                <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${r.color}`}>{r.tag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="max-w-6xl mx-auto px-4 sm:px-8 py-20 border-t border-border/60">
        <div className="rounded-3xl bg-gradient-hero text-primary-foreground p-10 sm:p-16 shadow-elevated relative overflow-hidden">
          <Shield className="absolute -right-8 -bottom-8 h-64 w-64 opacity-10" />
          <p className="text-xs uppercase tracking-widest opacity-80 font-semibold">Privacy-first by architecture</p>
          <h2 className="font-display text-3xl sm:text-5xl mt-3 max-w-3xl">On-device where possible. Encrypted always. Never trained on your data.</h2>
          <p className="mt-5 max-w-2xl opacity-90 leading-relaxed">Canta runs in a private model instance. Raw source is always one tap away. We surface what was filtered — we never hide it.</p>
          <Button asChild size="lg" variant="secondary" className="mt-8 rounded-2xl h-12">
            <Link to="/app">Enter the Demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 text-center text-xs text-muted-foreground">
        © Canta · Audio-first intelligence OS · Mocked demo data
      </footer>

      {/* Connect inbox modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Connect your inbox</DialogTitle>
            <DialogDescription>Canta moves your inbox to cold storage and becomes the intelligence layer on top.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {[
              { name: "Gmail", desc: "Personal & Workspace" },
              { name: "Outlook", desc: "Microsoft 365" },
              { name: "iCloud Mail", desc: "Apple ID" },
              { name: "IMAP", desc: "Any provider" },
            ].map((p) => (
              <button key={p.name} onClick={() => connect(p.name)} className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border hover:border-primary hover:bg-accent/50 transition-all text-left">
                <div className="h-10 w-10 rounded-xl bg-gradient-soft border border-border grid place-items-center"><Mail className="h-4 w-4 text-primary" /></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
            <button onClick={() => connect("PDF Library")} className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border hover:border-primary hover:bg-accent/50 transition-all text-left">
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
