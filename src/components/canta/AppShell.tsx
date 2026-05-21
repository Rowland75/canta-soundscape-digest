import { Outlet } from "react-router-dom";
import { BottomNav, SideNav } from "./Nav";
import { AudioPlayerBar } from "./AudioPlayerBar";
import { VoiceFAB, VoiceOverlay } from "./VoiceOverlay";

export const AppShell = () => {
  return (
    <div className="min-h-screen bg-canta-canvas flex relative">
      {/* Ambient vibrant accents — Canta palette permeating the whole OS */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-40" style={{ background: "hsl(var(--canta-blue) / 0.55)" }} />
        <div className="absolute top-1/3 -right-24 h-[26rem] w-[26rem] rounded-full blur-3xl opacity-35" style={{ background: "hsl(var(--canta-violet) / 0.55)" }} />
        <div className="absolute -bottom-32 left-1/3 h-[24rem] w-[24rem] rounded-full blur-3xl opacity-30" style={{ background: "hsl(var(--canta-gold) / 0.55)" }} />
        <div className="absolute bottom-10 -left-20 h-[22rem] w-[22rem] rounded-full blur-3xl opacity-25" style={{ background: "hsl(var(--canta-green) / 0.5)" }} />
        <div className="absolute top-10 left-1/2 h-[18rem] w-[18rem] rounded-full blur-3xl opacity-25" style={{ background: "hsl(var(--canta-pink) / 0.45)" }} />
      </div>
      <SideNav />
      <main className="flex-1 pb-32 lg:pb-24 max-w-3xl mx-auto w-full px-4 sm:px-6 pt-4 sm:pt-8 relative">
        <Outlet />
      </main>
      <BottomNav />
      <VoiceFAB />
      <VoiceOverlay />
      <AudioPlayerBar />
    </div>
  );
};
