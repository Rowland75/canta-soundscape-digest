import { Outlet } from "react-router-dom";
import { BottomNav, SideNav } from "./Nav";
import { AudioPlayerBar } from "./AudioPlayerBar";
import { VoiceFAB, VoiceOverlay } from "./VoiceOverlay";

export const AppShell = () => {
  return (
    <div className="min-h-screen bg-gradient-soft flex">
      <SideNav />
      <main className="flex-1 pb-32 lg:pb-24 max-w-3xl mx-auto w-full px-4 sm:px-6 pt-4 sm:pt-8">
        <Outlet />
      </main>
      <BottomNav />
      <VoiceFAB />
      <VoiceOverlay />
      <AudioPlayerBar />
    </div>
  );
};
