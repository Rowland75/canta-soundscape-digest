import { useState } from "react";
import { subscriptions, Subscription } from "@/lib/canta-data";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Check, Layers, X } from "lucide-react";

const REC_META: Record<Subscription["recommendation"], { label: string; color: string }> = {
  keep: { label: "Keep", color: "bg-success-soft text-success" },
  summarize: { label: "Summarize Weekly", color: "bg-accent text-accent-foreground" },
  unsubscribe: { label: "Unsubscribe", color: "bg-gold-soft text-gold-foreground" },
};

const Subscriptions = () => {
  const [subs, setSubs] = useState(subscriptions);
  const [confirm, setConfirm] = useState<{ id: string; action: "unsubscribe" | "clear" } | null>(null);

  const apply = (id: string, action: "keep" | "summarize" | "unsubscribe" | "clear") => {
    if (action === "unsubscribe" || action === "clear") {
      setConfirm({ id, action });
      return;
    }
    setSubs((s) => s.map((x) => x.id === id ? { ...x, recommendation: action } : x));
    toast.success(action === "keep" ? "Kept in feed" : "Will be summarized weekly");
  };

  const doConfirm = () => {
    if (!confirm) return;
    const sub = subs.find((s) => s.id === confirm.id);
    if (confirm.action === "unsubscribe") {
      setSubs((s) => s.filter((x) => x.id !== confirm.id));
      toast.success(`Unsubscribed from ${sub?.name}`, { description: `${sub?.backlog} backlog items archived.` });
    } else {
      setSubs((s) => s.map((x) => x.id === confirm.id ? { ...x, backlog: 0 } : x));
      toast.success(`Backlog cleared for ${sub?.name}`);
    }
    setConfirm(null);
  };

  const totalBacklog = subs.reduce((a, s) => a + s.backlog, 0);

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Subscription surgeon</p>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">Newsletters & lists</h1>
        <p className="text-muted-foreground mt-2 text-sm">{subs.length} active subscriptions · {totalBacklog} unread items in backlog</p>
      </header>

      <div className="space-y-3">
        {subs.map((sub) => {
          const rec = REC_META[sub.recommendation];
          return (
            <div key={sub.id} className="bg-card rounded-2xl border border-border/60 p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{sub.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sub.category} · {sub.frequency} · last opened {sub.lastOpened}</p>
                </div>
                <span className={cn("text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full shrink-0", rec.color)}>{rec.label}</span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Engagement</span>
                    <span className="font-semibold">{sub.engagement}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full",
                        sub.engagement >= 60 ? "bg-success" : sub.engagement >= 30 ? "bg-gradient-gold" : "bg-destructive/70"
                      )}
                      style={{ width: `${sub.engagement}%` }}
                    />
                  </div>
                </div>
                {sub.backlog > 0 && (
                  <span className="text-xs text-gold-foreground bg-gold-soft px-2 py-1 rounded-full font-semibold">{sub.backlog} backlog</span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <Button size="sm" variant="outline" onClick={() => apply(sub.id, "keep")} className="rounded-xl text-xs"><Check className="h-3 w-3 mr-1" />Keep</Button>
                <Button size="sm" variant="outline" onClick={() => apply(sub.id, "summarize")} className="rounded-xl text-xs"><Layers className="h-3 w-3 mr-1" />Summarize</Button>
                <Button size="sm" variant="outline" onClick={() => apply(sub.id, "clear")} className="rounded-xl text-xs">Clear backlog</Button>
                <Button size="sm" variant="outline" onClick={() => apply(sub.id, "unsubscribe")} className="rounded-xl text-xs text-destructive hover:text-destructive"><X className="h-3 w-3 mr-1" />Unsub</Button>
              </div>
            </div>
          );
        })}
      </div>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">{confirm?.action === "unsubscribe" ? "Unsubscribe?" : "Clear backlog?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.action === "unsubscribe"
                ? "Canta will unsubscribe and archive all backlog items. This cannot be undone in the demo."
                : "All backlog items will be archived. The subscription remains active."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doConfirm} className="rounded-xl bg-gradient-hero">Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subscriptions;
