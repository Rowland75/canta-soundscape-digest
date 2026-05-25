import { useVoice, usePlayer } from "@/lib/canta-store";
import { Mic, MicOff, X, Send, Keyboard, Sparkles, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  "Brief me on Atlas Ridge.",
  "Read the Crownline contract.",
  "What changed in the Meridian budget?",
  "Summarize the Northbridge thread.",
  "Unsubscribe NovaAxis digest.",
  "Switch to Strategic Intelligence.",
];

const respond = (q: string): { text: string; confirm?: string } => {
  const t = q.toLowerCase();
  if (t.includes("atlas ridge")) return { text: "Atlas Ridge phase 2 validation cleared 14 of 16 listings. Two flagged for resurvey by May 16. No budget impact. Maya closes out Friday." };
  if (t.includes("crownline")) return { text: "The revised Crownline Legal contract has three changes: net-90 payment terms, liability cap removed, and tightened hem tolerance. I recommend pushing back on net-90 and reinstating the cap." };
  if (t.includes("meridian")) return { text: "Meridian Works Q2 budget tightened 6 percent versus Q1. Marketing down 22k, Engineering up 28k, Travel down 6k. Risk: marketing underspend may impact Q3 pipeline." };
  if (t.includes("northbridge")) return { text: "Northbridge Capital confirmed partner-level interest in leading the Series A. They want a working session Thursday and updated burn plus the 18-month plan by end of day Tuesday." };
  if (t.includes("unsubscribe") || t.includes("novaaxis")) return { text: "NovaAxis weekly digest: low engagement, last opened three weeks ago.", confirm: "Unsubscribe and clear backlog?" };
  if (t.includes("strategic")) return { text: "Switched to Strategic Intelligence channel. Four briefings queued." };
  if (t.includes("burn")) return { text: "Burn is 206k a month, up 12 percent month over month. Runway is 14.2 months. Main drivers: vector DB scaling and one new ML hire." };
  return { text: "I can brief you on any project, read documents aloud, manage subscriptions, or draft replies. Try one of the suggestions." };
};

type Turn = { q: string; a: string; confirm?: string; resolved?: boolean };

export const VoiceOverlay = () => {
  const { open, setOpen } = useVoice();
  const player = usePlayer();
  const [input, setInput] = useState("");
  const [keyboard, setKeyboard] = useState(false);
  const [muted, setMuted] = useState(false);
  const [log, setLog] = useState<Turn[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [interrupted, setInterrupted] = useState(false);
  const speakTimer = useRef<number | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const clearSpeakTimer = () => {
    if (speakTimer.current) {
      window.clearTimeout(speakTimer.current);
      speakTimer.current = null;
    }
  };

  // Cancel any ongoing Canta response immediately (and pause any briefing playback).
  const interrupt = () => {
    let didInterrupt = false;
    if (speaking) {
      clearSpeakTimer();
      setSpeaking(false);
      setLog((l) => l.map((m, i) => i === l.length - 1 ? { ...m, a: m.a.replace(/ — interrupted\.$/, "") + " — interrupted." } : m));
      didInterrupt = true;
    }
    if (player.playing) {
      player.pause();
      didInterrupt = true;
    }
    if (didInterrupt) {
      setInterrupted(true);
      window.setTimeout(() => setInterrupted(false), 700);
      if (navigator.vibrate) navigator.vibrate(12);
    }
  };

  useEffect(() => {
    if (!open) {
      clearSpeakTimer();
      setTimeout(() => { setLog([]); setKeyboard(false); setMuted(false); setSpeaking(false); setInterrupted(false); }, 300);
    }
  }, [open]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [log, speaking]);

  const send = (q: string) => {
    if (!q.trim()) return;
    // Speaking again interrupts the current response / any playing briefing
    interrupt();
    const r = respond(q);
    setLog((l) => [...l, { q, a: r.text, confirm: r.confirm }]);
    setInput("");
    setSpeaking(true);
    speakTimer.current = window.setTimeout(() => setSpeaking(false), Math.min(6000, 1500 + r.text.length * 28));
  };

  const resolve = (i: number, ok: boolean) => {
    setLog((l) => l.map((m, idx) => idx === i ? { ...m, resolved: true, a: m.a + (ok ? " — Done." : " — Cancelled.") } : m));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 overflow-hidden text-foreground"
        >
          {/* Neural Expressive aurora — fullscreen, palette: white/blue/green/gold/violet/yellow/pink */}
          <NeuralAurora speaking={speaking} muted={muted} interrupted={interrupted} />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-7">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${interrupted ? "bg-canta-pink" : "bg-success"} animate-pulse`} />
              <p className="text-[11px] tracking-[0.25em] uppercase text-foreground/70">
                {interrupted ? "Canta · interrupted" : speaking ? "Canta · speaking — tap to interrupt" : muted ? "Canta · muted" : "Canta · listening"}
              </p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)} className="rounded-full h-10 w-10 text-foreground hover:bg-card/60">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Center stage — minimal, the whole screen is the orb. Tap to interrupt when speaking. */}
          <button
            type="button"
            onClick={() => { if (speaking || player.playing) interrupt(); }}
            className="relative z-10 grid place-items-center mt-10 sm:mt-16 w-full focus:outline-none"
            aria-label={speaking ? "Interrupt Canta" : "Canta status"}
          >
            <div className="h-8 flex items-end justify-center gap-1 text-primary">
              {speaking && Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-current"
                  style={{
                    height: `${10 + Math.abs(Math.sin((i + 1) * 0.7)) * 22}px`,
                    animation: `wave ${0.55 + (i % 5) * 0.11}s ease-in-out infinite`,
                    animationDelay: `${i * 0.035}s`,
                  }}
                />
              ))}
            </div>

            <p className="serif-italic text-2xl sm:text-3xl mt-5 text-center px-6 text-foreground">
              {interrupted ? "Okay — go ahead." : log.length === 0 ? "Say “Canta…”" : speaking ? "…" : "I'm here."}
            </p>
            {(speaking || player.playing) && !interrupted && (
              <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
                <Hand className="h-3 w-3" /> tap or speak to interrupt
              </span>
            )}
          </button>


          {/* Transcript */}
          <div
            ref={transcriptRef}
            className="relative z-10 max-w-xl mx-auto mt-6 px-5 sm:px-0 max-h-[28vh] overflow-y-auto space-y-3"
          >
            {log.length === 0 && (
              <div className="text-center text-xs tracking-widest uppercase text-muted-foreground flex items-center justify-center gap-2">
                <Sparkles className="h-3.5 w-3.5" /> try a command below
              </div>
            )}
            {log.map((m, i) => (
              <div key={i} className="space-y-1.5 animate-fade-up">
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground text-right">you</p>
                <div className="ml-auto max-w-[85%] bg-card/70 backdrop-blur rounded-2xl rounded-tr-sm px-4 py-2 text-sm text-right border border-border/60">{m.q}</div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">canta</p>
                <div className="mr-auto max-w-[90%] serif-italic text-[17px] leading-snug text-foreground">{m.a}</div>
                {m.confirm && !m.resolved && (
                  <div className="flex items-center gap-2 pt-1">
                    <p className="text-xs text-muted-foreground">{m.confirm}</p>
                    <Button size="sm" variant="outline" onClick={() => resolve(i, false)} className="rounded-full h-8">Cancel</Button>
                    <Button size="sm" onClick={() => resolve(i, true)} className="rounded-full h-8 bg-primary text-primary-foreground">Confirm</Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom control dock */}
          <div className="absolute bottom-0 inset-x-0 z-10 px-4 pb-[calc(env(safe-area-inset-bottom)+18px)] pt-4">
            <div className="max-w-xl mx-auto">
              {/* Suggestions */}
              <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none -mx-1 px-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-card/70 backdrop-blur border border-border/60 text-foreground hover:bg-card transition-colors">{s}</button>
                ))}
              </div>

              {keyboard ? (
                <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 items-center rounded-full glass-dark p-1.5 pl-4 shadow-elevated">
                  <Input
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a command…"
                    className="border-0 bg-transparent text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-0 h-10"
                  />
                  <Button type="submit" size="icon" className="rounded-full h-10 w-10 bg-card text-foreground hover:bg-card/80 shrink-0"><Send className="h-4 w-4" /></Button>
                  <Button type="button" size="icon" variant="ghost" onClick={() => setKeyboard(false)} className="rounded-full h-10 w-10 text-primary-foreground hover:bg-white/10 shrink-0"><X className="h-4 w-4" /></Button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setKeyboard(true)}
                    className="h-14 w-14 rounded-full glass border border-border/60 grid place-items-center text-foreground hover:bg-card transition-colors"
                    aria-label="Type"
                  >
                    <Keyboard className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (speaking || player.playing) { interrupt(); return; }
                      setMuted(!muted);
                    }}
                    className={`h-16 w-16 rounded-full grid place-items-center shadow-elevated hover:scale-105 transition-all ${
                      speaking || player.playing
                        ? "bg-gradient-spectrum text-primary-foreground scale-105"
                        : "bg-primary text-primary-foreground animate-pulse-ring"
                    }`}
                    aria-label={speaking || player.playing ? "Interrupt" : muted ? "Unmute" : "Mute"}
                  >
                    {speaking || player.playing ? <Hand className="h-6 w-6" /> : muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="h-14 w-14 rounded-full glass border border-border/60 grid place-items-center text-foreground hover:bg-card transition-colors"
                    aria-label="End"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
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
      className="fixed bottom-[84px] right-4 lg:bottom-6 lg:right-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-elevated grid place-items-center animate-pulse-ring hover:scale-105 transition-transform"
      aria-label="Open Canta voice agent"
    >
      <Mic className="h-6 w-6" />
    </button>
  );
};

// Neural Expressive aurora — Gemini Live-inspired fullscreen reactive background.
// Seven blobs drifting in the Canta palette: white, blue, green, gold, violet, yellow, pink.
// Speed and opacity respond to speaking / muted state.
const AURORA_BLOBS = [
  { color: "hsl(0 0% 100% / 0.85)",    anim: "neural-1", size: "70vmax", top: "-20%", left: "-15%" },
  { color: "hsl(218 95% 62% / 0.65)",  anim: "neural-2", size: "62vmax", top: "-10%", left: "35%"  }, // blue
  { color: "hsl(152 65% 55% / 0.55)",  anim: "neural-3", size: "60vmax", top: "30%",  left: "-25%" }, // green
  { color: "hsl(42 92% 60% / 0.60)",   anim: "neural-4", size: "55vmax", top: "45%",  left: "40%"  }, // gold
  { color: "hsl(272 80% 68% / 0.60)",  anim: "neural-5", size: "65vmax", top: "10%",  left: "10%"  }, // violet
  { color: "hsl(50 95% 65% / 0.55)",   anim: "neural-6", size: "50vmax", top: "55%",  left: "10%"  }, // yellow
  { color: "hsl(330 90% 75% / 0.55)",  anim: "neural-7", size: "58vmax", top: "-5%",  left: "55%"  }, // pink
];

const NeuralAurora = ({ speaking, muted, interrupted }: { speaking: boolean; muted: boolean; interrupted: boolean }) => {
  const baseDur = interrupted ? 4 : muted ? 28 : speaking ? 9 : 18;
  const op = interrupted ? 1 : muted ? 0.55 : speaking ? 0.95 : 0.8;
  return (
    <div className="aurora-stage" aria-hidden>
      {AURORA_BLOBS.map((b, i) => (
        <div
          key={i}
          className="aurora-blob"
          style={{
            background: b.color,
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            animation: `${b.anim} ${baseDur + i * 1.6}s ease-in-out infinite`,
            animationDelay: `${i * -2.3}s`,
            opacity: op,
            transform: interrupted ? "scale(1.15)" : "scale(1)",
            transition: "opacity 500ms ease, transform 600ms ease",
          }}
        />
      ))}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background/70 to-transparent" />
    </div>
  );
};

