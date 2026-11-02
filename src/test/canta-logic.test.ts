import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { usePlayer, useChannel, parseDuration, shouldDismiss, lockAxis, registerVoiceCanceller } from "@/lib/canta-store";
import { VoiceEngine, respond } from "@/lib/voice-engine";

describe("player", () => {
  beforeEach(() => usePlayer.getState().stop());
  it("progresses by duration and ends without looping", () => {
    usePlayer.getState().play("1"); // 1:42
    expect(usePlayer.getState().duration).toBe(102);
    usePlayer.getState().tick(50);
    expect(usePlayer.getState().elapsed).toBe(50);
    usePlayer.getState().tick(100);
    const s = usePlayer.getState();
    expect(s.elapsed).toBe(102);
    expect(s.playing).toBe(false);
    expect(s.ended).toBe(true);
    usePlayer.getState().tick(5);
    expect(usePlayer.getState().elapsed).toBe(102);
  });
  it("pause/resume is deterministic", () => {
    usePlayer.getState().play("1");
    usePlayer.getState().tick(10);
    usePlayer.getState().pause();
    usePlayer.getState().tick(10);
    expect(usePlayer.getState().elapsed).toBe(10);
  });
  it("starting playback cancels voice output", () => {
    const cancel = vi.fn();
    registerVoiceCanceller(cancel);
    usePlayer.getState().play("1");
    expect(cancel).toHaveBeenCalled();
    registerVoiceCanceller(null);
  });
  it("parses durations", () => expect(parseDuration("2:18")).toBe(138));
});

describe("dismissal thresholds", () => {
  it("requires hold + horizontal > 140px", () => {
    expect(shouldDismiss(true, "x", 141)).toBe(true);
    expect(shouldDismiss(true, "x", 139)).toBe(false);
    expect(shouldDismiss(false, "x", 300)).toBe(false);
    expect(shouldDismiss(true, "v", 300)).toBe(false);
  });
  it("vertical motion locks to scroll", () => {
    expect(lockAxis(3, 40)).toBe("v");
    expect(lockAxis(2, 2)).toBe(null);
  });
});

describe("voice engine", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  it("interrupt cancels the response and stale timers never fire", () => {
    const statuses: string[] = [];
    const pausePlayer = vi.fn();
    const e = new VoiceEngine({ onStatus: (s) => statuses.push(s), pausePlayer, thinkMs: 100, speakMs: () => 1000 });
    e.reply("hello");
    vi.advanceTimersByTime(150);
    expect(e.state).toBe("speaking");
    expect(e.interrupt()).toBe(true);
    expect(e.state).toBe("interrupted");
    expect(pausePlayer).toHaveBeenCalled();
    vi.advanceTimersByTime(5000);
    expect(e.state).toBe("idle");
    expect(statuses.filter((s) => s === "speaking").length).toBe(1);
  });
  it("a new reply supersedes the previous one", () => {
    const e = new VoiceEngine({ onStatus: () => {}, pausePlayer: () => {}, thinkMs: 100, speakMs: () => 1000 });
    const g1 = e.reply("one");
    const g2 = e.reply("two");
    expect(g2).toBeGreaterThan(g1);
    vi.advanceTimersByTime(1200);
    expect(e.state).toBe("idle");
  });
});

describe("channel switch command", () => {
  it("returns a strategic channel action", () => {
    const r = respond("Switch to Strategic Intelligence.");
    expect(r.action).toEqual({ type: "channel", channel: "strategic" });
    useChannel.getState().setChannel(r.action!.channel);
    expect(useChannel.getState().channel).toBe("strategic");
  });
  it("unsubscribe requires confirmation", () => expect(respond("Unsubscribe from the NovaAxis weekly digest.").confirm).toBeTruthy());
});
