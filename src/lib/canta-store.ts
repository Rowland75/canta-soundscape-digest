import { create } from "zustand";
import { feedItems } from "./canta-data";

export type ChannelKey = "work" | "strategic" | "personal";

/** "1:42" -> 102 seconds. Invalid input -> 0. */
export const parseDuration = (d: string): number => {
  const parts = d.split(":").map((n) => Number(n));
  if (parts.some((n) => !Number.isFinite(n) || n < 0)) return 0;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
};

export const formatTime = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** Single audio arbiter: only one of player / voice narration may produce output. */
let voiceCanceller: (() => void) | null = null;
export const registerVoiceCanceller = (fn: (() => void) | null) => {
  voiceCanceller = fn;
};

interface PlayerState {
  itemId: string | null;
  playing: boolean;
  /** Simulated playback position in seconds, derived from the item's duration. */
  elapsed: number;
  duration: number;
  ended: boolean;
  play: (id: string) => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  stop: () => void;
  /** Advance simulated playback by dt seconds. Stops at the end; never loops. */
  tick: (dt: number) => void;
  next: () => void;
  prev: () => void;
}

const indexOf = (id: string | null) => feedItems.findIndex((i) => i.id === id);

export const usePlayer = create<PlayerState>((set, get) => ({
  itemId: null,
  playing: false,
  elapsed: 0,
  duration: 0,
  ended: false,
  play: (id) => {
    const item = feedItems.find((i) => i.id === id);
    if (!item) return;
    voiceCanceller?.();
    set({ itemId: id, playing: true, elapsed: 0, duration: parseDuration(item.duration), ended: false });
  },
  pause: () => set({ playing: false }),
  resume: () => {
    const s = get();
    if (!s.itemId) return;
    voiceCanceller?.();
    if (s.ended) set({ elapsed: 0, ended: false, playing: true });
    else set({ playing: true });
  },
  toggle: () => (get().playing ? get().pause() : get().resume()),
  stop: () => set({ itemId: null, playing: false, elapsed: 0, duration: 0, ended: false }),
  tick: (dt) => {
    const s = get();
    if (!s.playing || dt <= 0) return;
    const elapsed = Math.min(s.duration, s.elapsed + dt);
    if (elapsed >= s.duration) set({ elapsed: s.duration, playing: false, ended: true });
    else set({ elapsed });
  },
  next: () => {
    const i = indexOf(get().itemId);
    if (i >= 0 && i < feedItems.length - 1) get().play(feedItems[i + 1].id);
  },
  prev: () => {
    const i = indexOf(get().itemId);
    if (i > 0) get().play(feedItems[i - 1].id);
  },
}));

interface VoiceState {
  open: boolean;
  setOpen: (v: boolean) => void;
}
export const useVoice = create<VoiceState>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
}));

interface ChannelState {
  channel: ChannelKey;
  setChannel: (c: ChannelKey) => void;
}
export const useChannel = create<ChannelState>((set) => ({
  channel: "work",
  setChannel: (channel) => set({ channel }),
}));

/** Player swipe-dismiss rules. */
export const HOLD_MS = 450;
export const AXIS_LOCK_PX = 8;
export const DISMISS_PX = 140;
export const lockAxis = (dx: number, dy: number): "x" | "v" | null => {
  if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return null;
  return Math.abs(dy) > Math.abs(dx) ? "v" : "x";
};
export const shouldDismiss = (armed: boolean, axis: "x" | "v" | null, dx: number) =>
  armed && axis === "x" && Math.abs(dx) > DISMISS_PX;
