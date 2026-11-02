import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useNavigate, useLocation } from "react-router-dom";
import { Mic, MicOff, Send, X, Hand, Pause, Play, Volume2, VolumeX, Check } from "lucide-react";
import { toast } from "sonner";
import { usePlayer, useVoice, useChannel, registerVoiceCanceller } from "@/lib/canta-store";
import { VoiceEngine, VoiceStatus, STATUS_LABEL, respond, browserSpeaker } from "@/lib/voice-engine";
import { SPLINE_SCENE_URL } from "@/lib/canta-config";
import { useReducedMotion, useDocumentHidden } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const SplineBackground = lazy(() => import("./SplineBackground"));

const SUGGESTIONS = [
  "Brief me on Atlas Ridge.",
  "Read the full Crownline Legal contract.",
  "What changed in the Meridian Works budget?",
  "Summarize the Northbridge investor thread.",
  "Unsubscribe from the NovaAxis weekly digest.",
  "Switch to Strategic Intelligence.",
];

type Msg = { id: number; role: "user" | "canta"; text: string; confirm?: string; resolved?: boolean };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRecognitionCtor = (): any =>
  typeof window === "undefined" ? null : (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;

export const VoiceOverlay = () => {
  const { open, setOpen } = useVoice();
  const setChannel = useChannel((s) => s.setChannel);
  const playerPlaying = usePlayer((s) => s.playing);
  const nav = useNavigate();
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const hidden = useDocumentHidden();

  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [muted, setMuted] = useState(false);
  const [micNote, setMicNote] = useState<string | null>(null);
  const [interim, setInterim] = useState("");
  const idRef = useRef(0);
  const recRef = useRef<any>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const engine = useMemo(
    () => new VoiceEngine({ onStatus: setStatus, pausePlayer: () => usePlayer.getState().pause() }),
    []
  );
  const speechSupported = useMemo(() => !!getRecognitionCtor(), []);
  const ttsSupported = useMemo(() => browserSpeaker().supported, []);

  useEffect(() => {
    engine.setSpeaker(!muted && ttsSupported ? browserSpeaker() : null);
  }, [engine, muted, ttsSupported]);

  // Player and voice never overlap: starting the player cancels Canta's output.
  useEffect(() => {
    registerVoiceCanceller(() => engine.cancelOutput());
    return () => registerVoiceCanceller(null);
  }, [engine]);

  const stopRecognition = useCallback(() => {
    const r = recRef.current;
    recRef.current = null;
    if (r) { r.onresult = r.onerror = r.onend = r.onspeechstart = null; try { r.abort(); } catch { /* noop */ } }
    setInterim("");
    engine.setListening(false);
  }, [engine]);

  // Cleanup on close/unmount.
  useEffect(() => {
    if (!open) { stopRecognition(); engine.dispose(); setStatus("idle"); }
  }, [open, engine, stopRecognition]);
  useEffect(() => () => { stopRecognition(); engine.dispose(); }, [engine, stopRecognition]);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [msgs, interim]);

  const push = (m: Omit<Msg, "id">) => setMsgs((prev) => [...prev, { ...m, id: ++idRef.current }]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    push({ role: "user", text: q });
    setInput("");
    const r = respond(q);
    if (r.action?.type === "channel") {
      setChannel(r.action.channel);
      if (pathname !== "/app") nav("/app");
    }
    push({ role: "canta", text: r.text, confirm: r.confirm });
    engine.reply(r.confirm ? `${r.text} ${r.confirm}` : r.text);
  };

  const interrupt = () => {
    const playerWas = usePlayer.getState().playing;
    const cancelled = engine.interrupt();
    if (!cancelled && playerWas) setStatus("interrupted");
  };

  const startListening = () => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) { setMicNote("Voice input isn't supported in this browser. Type your command instead."); return; }
    if (engine.busy || usePlayer.getState().playing) engine.interrupt();
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onspeechstart = () => { if (engine.busy) engine.interrupt(); };
    rec.onresult = (e: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript; else interimText += res[0].transcript;
      }
      if (engine.busy) engine.interrupt(); // speaking again cancels immediately
      setInterim(interimText);
      if (finalText) { stopRecognition(); send(finalText); }
    };
    rec.onerror = (e: any) => {
      const err = e?.error;
      stopRecognition();
      if (err === "not-allowed" || err === "service-not-allowed") setMicNote("Microphone access was denied. You can still type commands.");
      else if (err !== "no-speech" && err !== "aborted") setMicNote("Voice input stopped. You can type instead.");
    };
    rec.onend = () => { if (recRef.current === rec) stopRecognition(); };
    try {
      rec.start();
      recRef.current = rec;
      setMicNote(null);
      engine.setListening(true);
    } catch {
      setMicNote("Couldn't start voice input. Type instead.");
    }
  };

  const listening = status === "listening";
  const busy = status === "thinking" || status === "speaking" || status === "paused";
  const canInterrupt = busy || playerPlaying;

  const resolveConfirm = (id: number, yes: boolean) => {
    setMsgs((prev) => prev.map((m) => (m.id === id ? { ...m, resolved: true } : m)));
    if (yes) toast.success("Demo: unsubscribed from NovaAxis weekly digest", { description: "Simulated — no email was sent." });
    else toast("Cancelled. Nothing changed.");
  };

  const motion: AuroraMode = reduced || hidden ? "still"
    : status === "interrupted" ? "burst"
    : muted || status === "paused" ? "calm"
    : status === "speaking" ? "active"
    : status === "listening" || status === "thinking" ? "attentive" : "idle";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col text-foreground outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          aria-describedby="canta-voice-desc"
        >
          {SPLINE_SCENE_URL && !reduced ? (
            <div className="absolute inset-0" aria-hidden>
              <Suspense fallback={<NeuralAurora mode={motion} />}>
                <SplineBackground url={SPLINE_SCENE_URL} />
              </Suspense>
            </div>
          ) : (
            <NeuralAurora mode={motion} />
          )}

          <div className="relative z-10 flex flex-col h-full max-w-2xl w-full mx-auto px-4 sm:px-6 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <DialogPrimitive.Title className="font-display text-xl">Canta voice</DialogPrimitive.Title>
                <DialogPrimitive.Description id="canta-voice-desc" className="text-xs text-muted-foreground">
                  Demo · scripted responses, not a cloud AI model
                </DialogPrimitive.Description>
              </div>
              <DialogPrimitive.Close
                className="h-11 w-11 shrink-0 rounded-full bg-card/80 border border-border grid place-items-center hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close voice agent"
              >
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>

            <div className="mt-3 self-start rounded-full bg-card/85 border border-border px-3 py-1.5 text-sm font-medium flex items-center gap-2" role="status" aria-live="polite">
              <span className={cn("h-2 w-2 rounded-full", status === "error" ? "bg-destructive" : busy || listening ? "bg-canta-violet" : "bg-success")} aria-hidden />
              {playerPlaying && status === "idle" ? "Briefing playing — tap Interrupt to stop" : STATUS_LABEL[status]}
            </div>

            {/* Transcript panel — stable, readable surface over the motion */}
            <div ref={logRef} className="mt-4 flex-1 min-h-0 overflow-y-auto rounded-3xl bg-card/90 backdrop-blur-xl border border-border shadow-elevated p-4 space-y-3" aria-label="Conversation transcript">
              {msgs.length === 0 && (
                <div>
                  <p className="font-display text-2xl">Say “Canta…” or pick a command</p>
                  <p className="text-sm text-muted-foreground mt-1">High-impact actions always ask before they run.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => send(s)} className="min-h-11 px-4 rounded-full border border-border bg-background text-sm hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {msgs.map((m) => (
                <div key={m.id} className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm", m.role === "user" ? "ml-auto bg-primary text-primary-foreground rounded-tr-sm" : "bg-background border border-border rounded-tl-sm")}>
                  <p>{m.text}</p>
                  {m.confirm && (
                    <div className="mt-2">
                      <p className="font-medium">{m.confirm}</p>
                      {!m.resolved && (
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => resolveConfirm(m.id, true)} className="min-h-11 px-4 rounded-full bg-primary text-primary-foreground text-sm flex items-center gap-1"><Check className="h-4 w-4" /> Confirm</button>
                          <button onClick={() => resolveConfirm(m.id, false)} className="min-h-11 px-4 rounded-full border border-border text-sm">Cancel</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {interim && <p className="ml-auto max-w-[85%] text-sm italic text-muted-foreground text-right">{interim}</p>}
            </div>

            {micNote && <p className="mt-2 text-xs rounded-xl bg-card/90 border border-border px-3 py-2" role="alert">{micNote}</p>}
            {listening && (
              <p className="mt-2 text-xs text-muted-foreground">Voice input uses your browser's speech service, which may process audio with the browser vendor. Nothing is stored by Canta.</p>
            )}

            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex items-center gap-2 rounded-full bg-card/95 border border-border p-1.5 shadow-soft">
              <label htmlFor="canta-cmd" className="sr-only">Type a command for Canta</label>
              <input
                id="canta-cmd"
                value={input}
                onChange={(e) => { setInput(e.target.value); if (e.target.value && engine.busy) engine.interrupt(); }}
                placeholder="Type a command…"
                className="flex-1 min-w-0 bg-transparent px-3 h-11 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" disabled={!input.trim()} aria-label="Send command" className="h-11 w-11 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                onClick={() => setMuted((v) => !v)}
                aria-pressed={muted}
                aria-label={muted ? "Unmute Canta's voice" : "Mute Canta's voice"}
                className="h-12 w-12 rounded-full bg-card/90 border border-border grid place-items-center hover:bg-card"
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              {(status === "speaking" || status === "paused") && (
                <button
                  onClick={() => (status === "paused" ? engine.resume() : engine.pause())}
                  aria-label={status === "paused" ? "Resume response" : "Pause response"}
                  className="h-12 w-12 rounded-full bg-card/90 border border-border grid place-items-center hover:bg-card"
                >
                  {status === "paused" ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </button>
              )}
              {canInterrupt ? (
                <button onClick={interrupt} className="h-16 px-6 rounded-full bg-gradient-spectrum text-primary-foreground shadow-elevated flex items-center gap-2 font-medium">
                  <Hand className="h-5 w-5" /> Interrupt
                </button>
              ) : (
                <button
                  onClick={() => (listening ? stopRecognition() : startListening())}
                  aria-pressed={listening}
                  aria-label={listening ? "Stop listening" : speechSupported ? "Start voice input" : "Voice input unavailable"}
                  className={cn("h-16 w-16 rounded-full bg-primary text-primary-foreground hover:bg-primary focus-visible:bg-primary active:bg-primary grid place-items-center shadow-elevated", listening && !reduced && "animate-pulse-ring")}
                >
                  {listening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>
              )}
            </div>
            {!speechSupported && <p className="mt-2 text-center text-xs text-muted-foreground">Voice input isn't available in this browser — typing works everywhere.</p>}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export const VoiceFAB = () => {
  const { open, setOpen } = useVoice();
  if (open) return null;
  return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-[84px] right-4 lg:bottom-6 lg:right-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground hover:bg-primary focus-visible:bg-primary active:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-elevated grid place-items-center hover:scale-105 transition-transform"
      aria-label="Open Canta voice agent"
    >
      <Mic className="h-6 w-6" />
    </button>
  );
};

type AuroraMode = "still" | "idle" | "attentive" | "active" | "calm" | "burst";

// Fullscreen fluid spectrum: white, blue, green, gold, violet, yellow, pink. No black, no red.
const AURORA_BLOBS = [
  { color: "hsl(0 0% 100% / 0.85)", anim: "neural-1", size: "70vmax", top: "-20%", left: "-15%" },
  { color: "hsl(218 95% 62% / 0.65)", anim: "neural-2", size: "62vmax", top: "-10%", left: "35%" },
  { color: "hsl(152 65% 55% / 0.55)", anim: "neural-3", size: "60vmax", top: "30%", left: "-25%" },
  { color: "hsl(42 92% 60% / 0.60)", anim: "neural-4", size: "55vmax", top: "45%", left: "40%" },
  { color: "hsl(272 80% 68% / 0.60)", anim: "neural-5", size: "65vmax", top: "10%", left: "10%" },
  { color: "hsl(50 95% 65% / 0.55)", anim: "neural-6", size: "50vmax", top: "55%", left: "10%" },
  { color: "hsl(330 90% 75% / 0.55)", anim: "neural-7", size: "58vmax", top: "-5%", left: "55%" },
];

const MODE: Record<AuroraMode, { dur: number; op: number; scale: number }> = {
  still: { dur: 0, op: 0.7, scale: 1 },
  idle: { dur: 20, op: 0.75, scale: 1 },
  calm: { dur: 32, op: 0.55, scale: 0.95 },
  attentive: { dur: 13, op: 0.85, scale: 1.03 },
  active: { dur: 8, op: 0.95, scale: 1.06 },
  burst: { dur: 4, op: 1, scale: 1.15 },
};

const NeuralAurora = ({ mode }: { mode: AuroraMode }) => {
  const m = MODE[mode];
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
            animation: m.dur ? `${b.anim} ${m.dur + i * 1.6}s ease-in-out infinite` : "none",
            animationDelay: `${i * -2.3}s`,
            opacity: m.op,
            transform: `scale(${m.scale})`,
            transition: "opacity 500ms ease, transform 600ms ease",
          }}
        />
      ))}
    </div>
  );
};
