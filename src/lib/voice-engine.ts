import type { ChannelKey } from "./canta-store";

export type VoiceStatus = "idle" | "listening" | "thinking" | "speaking" | "paused" | "interrupted" | "error";

export const STATUS_LABEL: Record<VoiceStatus, string> = {
  idle: "Ready — type or tap the mic",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking — speak or tap Interrupt",
  paused: "Paused",
  interrupted: "Interrupted — go ahead",
  error: "Something went wrong",
};

export type DemoAction = { type: "channel"; channel: ChannelKey };
export type DemoReply = { text: string; confirm?: string; action?: DemoAction };

/** Scripted demo responses. Not a cloud AI model. */
export const respond = (q: string): DemoReply => {
  const t = q.toLowerCase();
  if (t.includes("strategic")) return { text: "Switched to Strategic Intelligence.", action: { type: "channel", channel: "strategic" } };
  if (t.includes("personal")) return { text: "Switched to Personal.", action: { type: "channel", channel: "personal" } };
  if (t.includes("work signal") || t.includes("switch to work")) return { text: "Switched to Work Signal.", action: { type: "channel", channel: "work" } };
  if (t.includes("atlas ridge")) return { text: "Atlas Ridge phase 2 validation cleared 14 of 16 listings. Two are flagged for resurvey by May 16. No budget impact." };
  if (t.includes("crownline")) return { text: "The revised Crownline Legal contract has two flagged changes: payment terms moved to net-90, and the limitation of liability section was removed." };
  if (t.includes("meridian")) return { text: "Meridian Works Q2 budget tightened versus Q1. Marketing is down, Engineering is up. Risk: marketing underspend may affect the Q3 pipeline." };
  if (t.includes("northbridge")) return { text: "Northbridge Capital confirmed interest in a working session Thursday. They want updated burn, the 18-month plan and current pipeline by end of day Tuesday." };
  if (t.includes("unsubscribe") || t.includes("novaaxis")) return { text: "NovaAxis weekly digest has low engagement.", confirm: "Unsubscribe and clear backlog? (demo — nothing is sent)" };
  return { text: "In this demo I can brief you on a project, read a contract summary, manage a subscription, or switch channels. Try a suggestion." };
};

export interface Speaker {
  supported: boolean;
  speak(text: string, onEnd: () => void): void;
  cancel(): void;
  pause(): void;
  resume(): void;
}

/** Browser speechSynthesis wrapper (on-device voices where the browser provides them). */
export const browserSpeaker = (): Speaker => {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
  return {
    supported: !!synth && typeof SpeechSynthesisUtterance !== "undefined",
    speak(text, onEnd) {
      if (!synth) return onEnd();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.02;
      u.onend = onEnd;
      u.onerror = onEnd;
      synth.speak(u);
    },
    cancel: () => synth?.cancel(),
    pause: () => synth?.pause(),
    resume: () => synth?.resume(),
  };
};

export interface EngineDeps {
  onStatus: (s: VoiceStatus) => void;
  pausePlayer: () => void;
  speaker?: Speaker | null;
  thinkMs?: number;
  /** Simulated speaking duration when no speaker is used. */
  speakMs?: (text: string) => number;
}

/**
 * Owns Canta's response lifecycle. Every new response or interrupt bumps a
 * generation token so stale timers/callbacks from older responses are ignored.
 */
export class VoiceEngine {
  private gen = 0;
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private status: VoiceStatus = "idle";
  private remainingMs = 0;
  private speakStartedAt = 0;
  private usingSpeaker = false;
  private currentText = "";
  constructor(private deps: EngineDeps) {}

  get state() { return this.status; }
  get generation() { return this.gen; }
  get busy() { return this.status === "thinking" || this.status === "speaking" || this.status === "paused"; }

  setSpeaker(s: Speaker | null) { this.deps.speaker = s; }

  private set(s: VoiceStatus) { this.status = s; this.deps.onStatus(s); }

  private after(ms: number, gen: number, fn: () => void) {
    const t = setTimeout(() => {
      this.timers.delete(t);
      if (gen === this.gen) fn();
    }, ms);
    this.timers.add(t);
  }

  private clearAll() {
    this.timers.forEach(clearTimeout);
    this.timers.clear();
    this.deps.speaker?.cancel();
  }

  /** Start a reply. Cancels anything in flight and pauses the briefing player. */
  reply(text: string): number {
    this.clearAll();
    this.deps.pausePlayer();
    const gen = ++this.gen;
    this.currentText = text;
    this.set("thinking");
    this.after(this.deps.thinkMs ?? 500, gen, () => this.startSpeaking(gen, text));
    return gen;
  }

  private startSpeaking(gen: number, text: string) {
    this.set("speaking");
    const sp = this.deps.speaker;
    this.usingSpeaker = !!sp?.supported;
    if (this.usingSpeaker && sp) {
      sp.speak(text, () => { if (gen === this.gen && this.status !== "paused") this.set("idle"); });
    } else {
      this.remainingMs = (this.deps.speakMs ?? ((t) => Math.min(6000, 1200 + t.length * 30)))(text);
      this.speakStartedAt = Date.now();
      this.after(this.remainingMs, gen, () => this.set("idle"));
    }
  }

  pause() {
    if (this.status !== "speaking") return;
    if (this.usingSpeaker) this.deps.speaker?.pause();
    else {
      this.remainingMs = Math.max(0, this.remainingMs - (Date.now() - this.speakStartedAt));
      this.timers.forEach(clearTimeout);
      this.timers.clear();
    }
    this.set("paused");
  }

  resume() {
    if (this.status !== "paused") return;
    this.set("speaking");
    if (this.usingSpeaker) this.deps.speaker?.resume();
    else {
      this.speakStartedAt = Date.now();
      this.after(this.remainingMs, this.gen, () => this.set("idle"));
    }
  }

  /** Cancel current response immediately. Returns true if something was cancelled. */
  interrupt(): boolean {
    const wasBusy = this.busy;
    this.gen++;
    this.clearAll();
    this.deps.pausePlayer();
    if (wasBusy) {
      this.set("interrupted");
      const g = this.gen;
      this.after(900, g, () => this.set("idle"));
    }
    return wasBusy;
  }

  /** Stop silently (used when the player takes over output). */
  cancelOutput() {
    if (!this.busy) return;
    this.gen++;
    this.clearAll();
    this.set("idle");
  }

  setListening(on: boolean) {
    if (on) { if (!this.busy) this.set("listening"); }
    else if (this.status === "listening") this.set("idle");
  }

  fail() { this.gen++; this.clearAll(); this.set("error"); }

  dispose() {
    this.gen++;
    this.clearAll();
    this.status = "idle";
    void this.currentText;
  }
}
