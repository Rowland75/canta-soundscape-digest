import { CheckCircle2, Mail, FileText, Newspaper, Wallet, Briefcase } from "lucide-react";

export type Classification = "signal" | "context" | "noise";
export type Priority = "critical" | "high" | "medium" | "low";
export type TrustLevel = 1 | 2 | 3;

export interface FeedItem {
  id: string;
  channel: "work" | "strategic" | "personal";
  title: string;
  source: string;
  sender: string;
  project?: string;
  priority: Priority;
  classification: Classification;
  confidence: number;
  summary: string;
  rawExcerpt: string;
  suggestedAction: string;
  trustLevel: TrustLevel;
  duration: string;
  reasoning: string;
  createdAt: string;
}

export const feedItems: FeedItem[] = [
  {
    id: "1",
    channel: "work",
    title: "Northbridge Capital signals interest in Series A lead",
    source: "Email",
    sender: "James Northbridge",
    project: "Fundraise",
    priority: "critical",
    classification: "signal",
    confidence: 0.96,
    summary:
      "James confirms partner-level interest. Wants to schedule a deep dive Thursday. Asks for updated burn and 18-month plan before the call.",
    rawExcerpt:
      "Loved the deck. The team is aligned. We'd like a working session Thursday — please send updated burn, 18-month plan, and current pipeline by EOD Tuesday.",
    suggestedAction: "Reply: confirm Thursday 2pm and attach updated burn deck.",
    trustLevel: 1,
    duration: "1:42",
    reasoning: "Sender is on your investor allowlist. Asks for action with deadline. High urgency keywords detected.",
    createdAt: "08:14",
  },
  {
    id: "2",
    channel: "work",
    title: "Crownline Legal contract revision — 3 material changes",
    source: "Contract",
    sender: "Legal · Crownline",
    project: "Crownline Legal",
    priority: "high",
    classification: "signal",
    confidence: 0.92,
    summary:
      "Counterparty inserted a 90-day payment term (was 30), removed liability cap, and tightened delivery to 2-inch hem tolerance. Two clauses worth challenging.",
    rawExcerpt: "Section 4.2 — Payment terms revised to net-90. Section 7.1 — Limitation of liability removed.",
    suggestedAction: "Push back on net-90 and reinstate liability cap. Accept hem tolerance.",
    trustLevel: 1,
    duration: "2:18",
    reasoning: "Hard-pass document type (legal). Always read raw. Material delta vs prior version.",
    createdAt: "07:55",
  },
  {
    id: "3",
    channel: "work",
    title: "Atlas Ridge property validation passed phase 2",
    source: "Project update",
    sender: "Maya Ortiz",
    project: "Atlas Ridge Properties",
    priority: "medium",
    classification: "context",
    confidence: 0.88,
    summary:
      "Validation cleared 14 of 16 listings. Two flagged for resurvey. No budget impact. Maya will close out by Friday.",
    rawExcerpt: "Phase 2 closed. 14/16 cleared. Flagged: 221 Mercer, 18 Hoxton.",
    suggestedAction: "Acknowledge. No reply needed.",
    trustLevel: 2,
    duration: "0:48",
    reasoning: "Routine project status. You set Atlas Ridge to Level 2 Concise.",
    createdAt: "07:30",
  },
  {
    id: "4",
    channel: "strategic",
    title: "NovaAxis market intelligence brief — EU AI Act enforcement",
    source: "Newsletter",
    sender: "NovaAxis Ventures + 3 sources",
    priority: "medium",
    classification: "context",
    confidence: 0.81,
    summary:
      "Three converging stories: EU enforcement starts Aug 2; enterprise audit logs go mainstream; new compliance tooling funded. Implication: compliance becomes a wedge for B2B AI startups.",
    rawExcerpt: "Synthesis across 4 newsletters you subscribe to.",
    suggestedAction: "Save to Strategic Context. Mention to Northbridge on Thursday.",
    trustLevel: 3,
    duration: "3:05",
    reasoning: "Cross-source synthesis from your Level 3 Strategic feeds.",
    createdAt: "06:00",
  },
  {
    id: "5",
    channel: "strategic",
    title: "Meridian Works budget review — burn up 12% MoM",
    source: "Finance",
    sender: "Meridian Works Finance",
    priority: "high",
    classification: "signal",
    confidence: 0.94,
    summary:
      "Monthly burn rose from $184k to $206k. Infra +$11k (vector DB scaling), payroll +$9k (new ML eng). Runway now 14.2 months at current pace.",
    rawExcerpt: "Computed from connected ledger.",
    suggestedAction: "Review infra commit. Brief Northbridge with updated runway.",
    trustLevel: 1,
    duration: "1:28",
    reasoning: "Material financial change above your 10% threshold.",
    createdAt: "Yesterday",
  },
  {
    id: "6",
    channel: "work",
    title: "HelioGrid Energy — board memo for May session",
    source: "Email",
    sender: "HelioGrid Chair",
    project: "HelioGrid Energy",
    priority: "high",
    classification: "signal",
    confidence: 0.9,
    summary: "Pre-read for next board meeting. Three resolutions to review: PPA renewal, capex envelope, ESG disclosure schedule.",
    rawExcerpt: "Please review attached memo before May 18 session.",
    suggestedAction: "Skim memo, mark dissents on capex envelope.",
    trustLevel: 1,
    duration: "2:05",
    reasoning: "Board-level document. Hard-pass on summary depth.",
    createdAt: "Yesterday",
  },
  {
    id: "7",
    channel: "work",
    title: "Orion Textile Group — revised supplier terms",
    source: "Email",
    sender: "Orion Procurement",
    project: "Orion Textile Group",
    priority: "medium",
    classification: "signal",
    confidence: 0.86,
    summary: "Supplier requesting 8% price increase tied to cotton index. Volume rebate restructured. Net effect: +3.2% landed cost.",
    rawExcerpt: "Effective Q3, unit price moves to $43.45 with revised rebate ladder.",
    suggestedAction: "Counter at +5% with locked rebate floor.",
    trustLevel: 2,
    duration: "1:12",
    reasoning: "Procurement signal above 2% threshold.",
    createdAt: "Yesterday",
  },
  {
    id: "8",
    channel: "strategic",
    title: "BluePeak Holdings executive update — portfolio Q2",
    source: "Email",
    sender: "BluePeak CEO Office",
    project: "BluePeak Holdings",
    priority: "medium",
    classification: "context",
    confidence: 0.83,
    summary: "Two portfolio companies beat plan, one is flat. Recommendation to top up the flat one with bridge financing.",
    rawExcerpt: "Quarterly portfolio briefing attached.",
    suggestedAction: "Acknowledge. Decide on bridge by month-end.",
    trustLevel: 2,
    duration: "1:35",
    reasoning: "Routine portfolio update. Level 2 Concise.",
    createdAt: "Yesterday",
  },
  {
    id: "9",
    channel: "strategic",
    title: "Riverstone Assets — asset review flags rebalance",
    source: "Finance",
    sender: "Riverstone Analytics",
    project: "Riverstone Assets",
    priority: "medium",
    classification: "context",
    confidence: 0.79,
    summary: "Equity allocation drifted 4.2% above target. Recommended rebalance into short-duration fixed income.",
    rawExcerpt: "Drift report attached.",
    suggestedAction: "Approve rebalance or defer to next review.",
    trustLevel: 2,
    duration: "0:58",
    reasoning: "Asset drift above your 3% threshold.",
    createdAt: "2 days ago",
  },
  {
    id: "10",
    channel: "strategic",
    title: "Goldleaf Advisory memo — tax planning window",
    source: "Email",
    sender: "Goldleaf Advisory",
    project: "Goldleaf Advisory",
    priority: "medium",
    classification: "context",
    confidence: 0.82,
    summary: "Recommended actions before fiscal year close: harvest losses, defer two invoices, accelerate one capex line.",
    rawExcerpt: "See attached planning memo.",
    suggestedAction: "Forward to CFO. Decide by June 1.",
    trustLevel: 2,
    duration: "1:18",
    reasoning: "Advisory memo with deadline.",
    createdAt: "2 days ago",
  },
  {
    id: "11",
    channel: "personal",
    title: "Dr. Patel — annual physical confirmation",
    source: "Email",
    sender: "Tribeca Health",
    priority: "low",
    classification: "context",
    confidence: 0.78,
    summary: "Appointment confirmed for May 14, 9:30am. Fasting required.",
    rawExcerpt: "Your appointment with Dr. Patel is confirmed.",
    suggestedAction: "Add to calendar. No reply needed.",
    trustLevel: 2,
    duration: "0:22",
    reasoning: "Personal appointment. Low urgency.",
    createdAt: "Yesterday",
  },
  {
    id: "12",
    channel: "work",
    title: "VendorPro spring sale — 40% off",
    source: "Promotion",
    sender: "VendorPro Marketing",
    priority: "low",
    classification: "noise",
    confidence: 0.97,
    summary: "Promotional email. Filtered.",
    rawExcerpt: "Save 40% this week only!",
    suggestedAction: "Auto-archived. Suggest unsubscribe.",
    trustLevel: 3,
    duration: "0:10",
    reasoning: "Marketing template detected. Engagement score: 2/100 over 6 months.",
    createdAt: "Yesterday",
  },
];

export interface Subscription {
  id: string;
  name: string;
  category: string;
  frequency: string;
  engagement: number;
  lastOpened: string;
  recommendation: "keep" | "summarize" | "unsubscribe";
  backlog: number;
}

export const subscriptions: Subscription[] = [
  { id: "s1", name: "NovaAxis Weekly Digest", category: "Market intelligence", frequency: "Weekly", engagement: 64, lastOpened: "5 days ago", recommendation: "summarize", backlog: 2 },
  { id: "s2", name: "Goldleaf Advisory Notes", category: "Advisory", frequency: "Weekly", engagement: 78, lastOpened: "2 days ago", recommendation: "keep", backlog: 4 },
  { id: "s3", name: "Riverstone Market Brief", category: "Asset research", frequency: "Daily", engagement: 41, lastOpened: "12 days ago", recommendation: "summarize", backlog: 14 },
  { id: "s4", name: "VendorPro Promotions", category: "Vendor promo", frequency: "3×/week", engagement: 2, lastOpened: "8 months ago", recommendation: "unsubscribe", backlog: 87 },
  { id: "s5", name: "ProductHunt Daily", category: "Product launches", frequency: "Daily", engagement: 18, lastOpened: "6 weeks ago", recommendation: "unsubscribe", backlog: 41 },
  { id: "s6", name: "BluePeak Portfolio Letter", category: "Portfolio update", frequency: "Monthly", engagement: 71, lastOpened: "Today", recommendation: "keep", backlog: 1 },
];

export interface TrustRule {
  id: string;
  name: string;
  scope: string;
  level: TrustLevel;
  hardPass: boolean;
  active: boolean;
}

export const trustRules: TrustRule[] = [
  { id: "r1", name: "Investor Emails", scope: "Tag · investor", level: 1, hardPass: false, active: true },
  { id: "r2", name: "Atlas Ridge Project", scope: "Project · Atlas Ridge", level: 2, hardPass: false, active: true },
  { id: "r3", name: "Newsletters", scope: "Type · newsletter", level: 3, hardPass: false, active: true },
  { id: "r4", name: "Legal Contracts", scope: "Type · contract", level: 1, hardPass: true, active: true },
  { id: "r5", name: "Northbridge Capital", scope: "Domain · northbridgecap.com", level: 1, hardPass: false, active: true },
];

export interface DocItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded: string;
  brief: string;
  changes: string[];
  obligations: string[];
  deadlines: string[];
  numbers: string[];
  risks: string[];
}

export const documents: DocItem[] = [
  {
    id: "d1",
    name: "Crownline Legal Contract v3.pdf",
    type: "Legal contract",
    size: "412 KB",
    uploaded: "Today, 07:55",
    brief:
      "Revised supply agreement. Counterparty introduced three material changes vs v2. Two are unfavorable, one is acceptable.",
    changes: [
      "Payment terms: net-30 → net-90 (unfavorable)",
      "Limitation of liability clause removed (high risk)",
      "Hem tolerance tightened to 2 inches (acceptable)",
    ],
    obligations: ["Quarterly volume commitment of 5,000 units", "Quality audit every 6 months"],
    deadlines: ["Counter-signature requested by May 9", "First shipment due June 15"],
    numbers: ["Unit price: $42.10", "Volume: 5,000/qtr", "Total annual: $842,000"],
    risks: ["Net-90 strains cash 22 days vs runway model", "No liability cap exposes to uncapped damages"],
  },
  {
    id: "d2",
    name: "Meridian Works Budget Q2.xlsx",
    type: "Spreadsheet",
    size: "88 KB",
    uploaded: "Yesterday",
    brief: "Q2 operating budget. Track tightening vs Q1 by 6%. Marketing reallocated to product.",
    changes: ["Marketing -$22k", "Engineering +$28k", "Travel -$6k"],
    obligations: ["Monthly review with finance lead"],
    deadlines: ["Q2 close: June 30"],
    numbers: ["Total Q2: $612,000", "Headcount delta: +2"],
    risks: ["Marketing underspend may impact pipeline in Q3"],
  },
  {
    id: "d3",
    name: "Atlas Ridge Property Validation Report.pdf",
    type: "Report",
    size: "1.2 MB",
    uploaded: "2 days ago",
    brief: "Phase 2 validation across 16 listings. 14 cleared. 2 flagged for resurvey.",
    changes: [],
    obligations: ["Resurvey 221 Mercer and 18 Hoxton within 14 days"],
    deadlines: ["Resurvey complete by May 16"],
    numbers: ["Listings: 16", "Cleared: 14", "Flagged: 2"],
    risks: ["18 Hoxton has zoning ambiguity — escalate to counsel"],
  },
];

export const triageItems = feedItems.slice(0, 5);

export const channelMeta = {
  work: { label: "Work Signal", icon: Briefcase, color: "from-primary to-primary-glow" },
  strategic: { label: "Strategic Intelligence", icon: FileText, color: "from-violet-500 to-blue-500" },
  personal: { label: "Personal", icon: Mail, color: "from-emerald-500 to-teal-500" },
} as const;

export const sourceIcons = { Email: Mail, Contract: FileText, Newsletter: Newspaper, Finance: Wallet, Promotion: CheckCircle2, "Project update": Briefcase };
