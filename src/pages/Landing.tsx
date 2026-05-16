import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, Mail, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Landing = () => {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const connect = (provider: string) => {
    setOpen(false);
    toast.success(`${provider} connected`);
    setTimeout(() => nav("/onboarding"), 600);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-soft pointer-events-none" />
      <div className="absolute top-20 -right-32 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <header className="relative z-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-hero shadow-glow grid place-items-center text-primary-foreground font-display font-bold">C</div>
            <span className="font-display text-xl font-semibold">Canta</span>
          </div>
        </div>
      </header>

      <section className="relative min-h-[calc(100vh-96px)] flex items-center justify-center px-6 sm:px-8 pb-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-display text-6xl sm:text-8xl font-semibold tracking-tight animate-fade-up">
            Canta
          </h1>
          <p className="mt-8 text-xl sm:text-2xl font-display animate-fade-up">
            Your audio-first intelligence OS.
          </p>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground animate-fade-up">
            Hear what matters. Act by voice.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up">
            <Button asChild size="lg" className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-95 text-base h-14 px-8 rounded-2xl">
              <Link to="/app">Enter Demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setOpen(true)} className="text-base h-14 px-8 rounded-2xl">
              <Mail className="mr-2 h-4 w-4" /> Connect Inbox
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Connect your inbox</DialogTitle>
            <DialogDescription>Canta becomes the intelligence layer on top of your inbox.</DialogDescription>
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
