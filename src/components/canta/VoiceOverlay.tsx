import { useVoice } from "@/lib/canta-store";
import { Mic, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  "Brief me on SendUs",
  "Read full Villacraft contract",
  "Unsubscribe from VendorPro",
  "What is my burn rate?",
  "Reply: we accept but insist on 2-inch hem",
];

const respond = (q: string): { text: string; confirm?: string } => {
  const t = q.toLowerCase();
  if (t.includes("burn")) return { text: "Burn is $206k/month, up 12% MoM. Runway is 14.2 months. Main drivers: vector DB scaling (+$11k) and one new ML hire (+$9k)." };
  if (t.includes("sendus")) return { text: "SendUs phase 2 validation cleared 14 of 16 listings. Two flagged for resurvey by May 16. No budget impact. Maya closes out Friday." };
  if (t.includes("villacraft")) return { text: "The revised contract has three changes: net-90 payment terms (was net-30), liability cap removed, and tightened hem tolerance. I recommend pushing back on net-90 and reinstating the cap." };
  if (t.includes("unsubscribe")) return { text: "VendorPro: 87 unread, 2/100 engagement, last opened 8 months ago.", confirm: "Unsubscribe and clear backlog?" };
  if (t.includes("reply")) return { text: "Drafted reply to Villacraft Legal: 'We accept the revised hem tolerance. We need to retain net-30 terms and the existing liability cap before we can countersign.'", confirm: "Send this reply?" };
  return { text: "I can brief you on any project, read documents aloud, manage subscriptions, or draft replies. Try one of the suggestions below." };
};

export const VoiceOverlay = () => {
  const { open, setOpen } = useVoice();
  const [input, setInput] = useState("");
  const [log, setLog] = useState<{ q: string; a: string; confirm?: string; resolved?: boolean }[]>([]);

  const send = (q: string) => {
    if (!q.trim()) return;
    const r = respond(q);
    setLog((l) => [...l, { q, a: r.text, confirm: r.confirm }]);
    setInput("");
  };

  const resolve = (i: number, ok: boolean) => {
    setLog((l) => l.map((m, idx) => idx === i ? { ...m, resolved: true, a: m.a + (ok ? " — Done." : " — Cancelled.") } : m));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-end sm:place-items-center p-0 sm:p-6"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-3xl shadow-elevated border border-border/60 overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="bg-gradient-hero p-6 text-primary-foreground relative">
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)} className="absolute top-3 right-3 h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"><X className="h-4 w-4" /></Button>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white/20 grid place-items-center animate-pulse-ring">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-80">Listening</p>
                  <p className="font-display text-2xl">Say "Canta…"</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {log.length === 0 && (
                <div className="text-center py-6 space-y-3">
                  <Sparkles className="h-6 w-6 mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground">Try a command</p>
                </div>
              )}
              {log.map((m, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-end"><div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 text-sm max-w-[85%]">{m.q}</div></div>
                  <div className="flex justify-start"><div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2 text-sm max-w-[85%]">{m.a}</div></div>
                  {m.confirm && !m.resolved && (
                    <div className="flex gap-2 ml-2">
                      <p className="text-xs text-muted-foreground self-center">{m.confirm}</p>
                      <Button size="sm" variant="outline" onClick={() => resolve(i, false)}>Cancel</Button>
                      <Button size="sm" onClick={() => resolve(i, true)} className="bg-gradient-hero">Confirm</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-border/60">
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-accent/70 transition-colors">{s}</button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a command…" className="rounded-xl" />
                <Button type="submit" size="icon" className="bg-gradient-hero shadow-glow shrink-0 rounded-xl"><Send className="h-4 w-4" /></Button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const VoiceFAB = () => {
  const { open, setOpen } = useVoice();
  if (open) return null;
  return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-[84px] right-4 lg:bottom-6 lg:right-6 z-40 h-14 w-14 rounded-full bg-gradient-hero text-primary-foreground shadow-glow grid place-items-center animate-pulse-ring hover:scale-105 transition-transform"
      aria-label="Open Canta voice agent"
    >
      <Mic className="h-6 w-6" />
    </button>
  );
};
