import { Link, useLocation } from "react-router-dom";
import { Home, Radio, Filter, Shield, Mail, FileText, Sparkles, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app", label: "Feed", icon: Radio, exact: true },
  { to: "/app/triage", label: "Triage", icon: Filter },
  { to: "/app/trust", label: "Trust", icon: Shield },
  { to: "/app/subscriptions", label: "Subs", icon: Mail },
  { to: "/app/documents", label: "Docs", icon: FileText },
  { to: "/app/briefing", label: "Daily", icon: Sparkles },
  { to: "/app/settings", label: "Privacy", icon: SettingsIcon },
];

export const BottomNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 glass border-t border-border/60 lg:hidden">
      <div className="mx-auto max-w-md flex items-center justify-between px-2 py-1.5 pb-[calc(env(safe-area-inset-bottom)+6px)]">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-medium transition-colors min-w-[44px]",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_6px_hsl(var(--primary)/0.5)]")} strokeWidth={active ? 2.4 : 1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export const SideNav = () => {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-border/60 bg-card/40 px-4 py-6 sticky top-0 h-screen">
      <Link to="/" className="flex items-center gap-2 px-2 mb-8">
        <div className="h-8 w-8 rounded-xl bg-gradient-hero shadow-glow grid place-items-center text-primary-foreground font-display font-bold">C</div>
        <span className="font-display text-xl font-semibold">Canta</span>
      </Link>
      <div className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active ? "bg-accent text-accent-foreground shadow-soft" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={active ? 2.4 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-auto rounded-2xl bg-gradient-soft border border-border/60 p-4">
        <p className="text-xs font-medium text-muted-foreground">Today's signal load</p>
        <p className="font-display text-2xl mt-1">7 items</p>
        <p className="text-xs text-success mt-1">↓ 84% vs raw inbox</p>
      </div>
    </aside>
  );
};
