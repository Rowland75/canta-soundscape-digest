import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Shield, Lock, Server, Database, Eye, Sparkles } from "lucide-react";

const Setting = ({ icon: Icon, title, desc, value, onChange }: any) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-soft">
    <div className="h-10 w-10 rounded-xl bg-gradient-soft border border-border grid place-items-center text-primary shrink-0">
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
    </div>
    <Switch checked={value} onCheckedChange={onChange} />
  </div>
);

const Settings = () => {
  const [s, setS] = useState({ device: true, encrypt: true, privateLLM: false, noTrain: true, rawFallback: true });
  const [confidence, setConfidence] = useState([72]);

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Privacy & architecture</p>
        <h1 className="font-display text-3xl sm:text-4xl mt-1">Your data, your terms.</h1>
        <p className="text-muted-foreground mt-2 text-sm">Canta is built privacy-first by architecture — not policy.</p>
      </header>

      <div className="rounded-3xl bg-gradient-hero p-6 text-primary-foreground mb-5 shadow-elevated relative overflow-hidden">
        <Shield className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10" />
        <p className="text-xs uppercase tracking-widest opacity-80 font-semibold">Current posture</p>
        <p className="font-display text-2xl mt-1">Enterprise-grade · End-to-end encrypted</p>
        <p className="text-sm opacity-90 mt-2">Raw source is always one tap away. We surface what's filtered. We never hide it.</p>
      </div>

      <div className="space-y-3">
        <Setting icon={Server} title="On-device processing where possible" desc="Light classification and summarization run locally. Only encrypted embeddings sync." value={s.device} onChange={(v: boolean) => setS({ ...s, device: v })} />
        <Setting icon={Lock} title="Encrypted cloud sync" desc="AES-256 at rest. TLS 1.3 in transit. Keys derived from your device passphrase." value={s.encrypt} onChange={(v: boolean) => setS({ ...s, encrypt: v })} />
        <Setting icon={Database} title="Private LLM instance" desc="Dedicated isolated model deployment. No shared inference. Available on Pro plans." value={s.privateLLM} onChange={(v: boolean) => setS({ ...s, privateLLM: v })} />
        <Setting icon={Sparkles} title="Never train on user data" desc="Your emails, contracts, and voice commands are never used for model training." value={s.noTrain} onChange={(v: boolean) => setS({ ...s, noTrain: v })} />
        <Setting icon={Eye} title="Raw source fallback enabled" desc="Every summary links to the original source. One tap to verify." value={s.rawFallback} onChange={(v: boolean) => setS({ ...s, rawFallback: v })} />

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-soft">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-sm">Confidence threshold</p>
            <span className="font-display text-2xl text-primary">{confidence[0]}%</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Below this, items are surfaced as raw rather than summarized. Lower = more raw, higher = more synthesis.</p>
          <Slider value={confidence} onValueChange={setConfidence} min={40} max={95} step={1} />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">
            <span>Conservative</span><span>Balanced</span><span>Aggressive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
