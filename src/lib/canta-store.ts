import { create } from "zustand";

interface PlayerState {
  itemId: string | null;
  playing: boolean;
  play: (id: string) => void;
  pause: () => void;
  toggle: () => void;
  stop: () => void;
}

export const usePlayer = create<PlayerState>((set, get) => ({
  itemId: null,
  playing: false,
  play: (id) => set({ itemId: id, playing: true }),
  pause: () => set({ playing: false }),
  toggle: () => set({ playing: !get().playing }),
  stop: () => set({ itemId: null, playing: false }),
}));

interface VoiceState {
  open: boolean;
  setOpen: (v: boolean) => void;
}
export const useVoice = create<VoiceState>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
}));
