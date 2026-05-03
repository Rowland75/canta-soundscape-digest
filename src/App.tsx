import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import { AppShell } from "./components/canta/AppShell";
import Feed from "./pages/Feed";
import Triage from "./pages/Triage";
import Trust from "./pages/Trust";
import Subscriptions from "./pages/Subscriptions";
import Documents from "./pages/Documents";
import Briefing from "./pages/Briefing";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Feed />} />
            <Route path="triage" element={<Triage />} />
            <Route path="trust" element={<Trust />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="documents" element={<Documents />} />
            <Route path="briefing" element={<Briefing />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
