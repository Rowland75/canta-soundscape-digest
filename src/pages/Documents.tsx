import { useState } from "react";
import { documents, DocItem } from "@/lib/canta-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Send, Sparkles, AlertTriangle, Calendar, Hash, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MOCK_ANSWERS = [
  "The biggest risk is net-90 payment terms — that strains cash by ~22 days vs your runway model. I recommend pushing back to net-30.",
  "Three deadlines: counter-signature by May 9, first shipment June 15, and quality audit every 6 months thereafter.",
  "Total annual commitment is $842,000 across 5,000 units per quarter at $42.10 each.",
  "Yes — section 7.1 was removed entirely. That removes your liability cap and exposes you to uncapped damages. Reinstate it before signing.",
];

const Section = ({ icon: Icon, label, items, accent }: { icon: any; label: string; items: string[]; accent?: string }) => (
  items.length > 0 ? (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("h-3.5 w-3.5", accent || "text-primary")} />
        <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">{label}</p>
      </div>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-foreground/85 flex gap-2">
            <span className="text-primary mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  ) : null
);

const Documents = () => {
  const [selected, setSelected] = useState<DocItem>(documents[0]);
  const [question, setQuestion] = useState("");
  const [qa, setQa] = useState<{ q: string; a: string }[]>([]);

  const ask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    const a = MOCK_ANSWERS[qa.length % MOCK_ANSWERS.length];
    setQa([...qa, { q: question, a }]);
    setQuestion("");
  };

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">PDF & file intelligence</p>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">Forensic briefs</h1>
        <p className="text-muted-foreground mt-2 text-sm">Contracts, budgets, reports — Canta extracts changes, deadlines, and risks. Hard-Pass by default.</p>
      </header>

      <button
        onClick={() => toast.success("Demo: file upload simulated", { description: "Canta would now extract a forensic brief in ~12 seconds." })}
        className="w-full mb-5 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-accent/30 transition-all p-6 grid place-items-center text-center"
      >
        <div className="h-12 w-12 rounded-2xl bg-gradient-hero grid place-items-center text-primary-foreground shadow-glow mb-3">
          <Upload className="h-5 w-5" />
        </div>
        <p className="font-semibold text-sm">Drop a PDF, contract, or spreadsheet</p>
        <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX up to 50MB · processed privately</p>
      </button>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-5">
        {documents.map((d) => (
          <button
            key={d.id}
            onClick={() => { setSelected(d); setQa([]); }}
            className={cn("text-left p-3 rounded-2xl border transition-all", selected.id === d.id ? "border-primary bg-accent shadow-soft" : "border-border/60 bg-card hover:border-primary/40")}
          >
            <FileText className="h-4 w-4 text-primary mb-2" />
            <p className="font-medium text-sm truncate">{d.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{d.type} · {d.size}</p>
          </button>
        ))}
      </div>

      {/* Forensic brief */}
      <div className="bg-card rounded-3xl border border-border/60 p-5 shadow-card space-y-5">
        <div>
          <p className="text-xs text-muted-foreground">{selected.type} · uploaded {selected.uploaded}</p>
          <h2 className="font-display text-2xl mt-1">{selected.name}</h2>
          <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{selected.brief}</p>
        </div>

        <Section icon={ScrollText} label="Material changes" items={selected.changes} accent="text-gold-foreground" />
        <Section icon={Calendar} label="Deadlines" items={selected.deadlines} />
        <Section icon={Hash} label="Key numbers" items={selected.numbers} />
        <Section icon={ScrollText} label="Obligations" items={selected.obligations} />
        <Section icon={AlertTriangle} label="Risks" items={selected.risks} accent="text-destructive" />
      </div>

      {/* Q&A */}
      <div className="mt-5 bg-gradient-soft rounded-3xl border border-border/60 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="font-semibold text-sm">Ask Canta about this document</p>
        </div>
        <div className="space-y-2 mb-3">
          {qa.map((m, i) => (
            <div key={i} className="space-y-2">
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 text-sm ml-auto max-w-[85%] w-fit">{m.q}</div>
              <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-2 text-sm border border-border/60 max-w-[85%]">{m.a}</div>
            </div>
          ))}
        </div>
        <form onSubmit={ask} className="flex gap-2">
          <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What's the biggest risk?" className="rounded-xl bg-card" />
          <Button type="submit" size="icon" className="bg-gradient-hero shadow-glow rounded-xl shrink-0"><Send className="h-4 w-4" /></Button>
        </form>
      </div>
    </div>
  );
};

export default Documents;
