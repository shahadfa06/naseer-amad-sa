import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Mail,
  User,
  Sparkles,
  MessageCircle,
  X,
  Send,
  ShieldCheck,
  Clock,
  Coins,
  Landmark,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import patternUrl from "@/assets/pattern.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nuysir — Your Smart Guide to Business Licenses in Saudi Arabia" },
      {
        name: "description",
        content:
          "Nuysir helps entrepreneurs in Saudi Arabia identify the licenses, authorities, costs and timelines required to start a business — aligned with Vision 2030.",
      },
      { property: "og:title", content: "Nuysir — Smart Business Licensing for KSA" },
      {
        property: "og:description",
        content: "Find every license you need to launch your business in Saudi Arabia.",
      },
    ],
  }),
  component: Index,
});

type License = {
  name: string;
  authority: string;
  cost: string;
  duration: string;
  required: boolean;
};

const ACTIVITIES = [
  "Retail / E-commerce",
  "Restaurant & Café",
  "Fintech",
  "Construction",
  "Healthcare Clinic",
  "Education & Training",
  "Logistics & Delivery",
  "Beauty & Wellness",
  "Tourism & Hospitality",
  "Manufacturing",
];

const CITIES = [
  "Riyadh",
  "Jeddah",
  "Mecca",
  "Medina",
  "Dammam",
  "Khobar",
  "Tabuk",
  "Abha",
  "NEOM",
];

function generateLicenses(activity: string, city: string): License[] {
  const base: License[] = [
    {
      name: "Commercial Registration (CR)",
      authority: "Ministry of Commerce",
      cost: "SAR 1,200 / year",
      duration: "1–3 business days",
      required: true,
    },
    {
      name: `${city} Municipality License`,
      authority: `${city} Municipality (Baladiya)`,
      cost: "SAR 800 – 2,500",
      duration: "5–10 business days",
      required: true,
    },
    {
      name: "Chamber of Commerce Membership",
      authority: "Saudi Chamber of Commerce",
      cost: "SAR 500 / year",
      duration: "1 business day",
      required: true,
    },
  ];

  const activitySpecific: Record<string, License[]> = {
    Fintech: [
      {
        name: "Fintech Sandbox Permit",
        authority: "Saudi Central Bank (SAMA)",
        cost: "SAR 5,000",
        duration: "30–60 business days",
        required: true,
      },
      {
        name: "Payment Service Provider License",
        authority: "SAMA",
        cost: "SAR 50,000+",
        duration: "3–6 months",
        required: false,
      },
    ],
    "Restaurant & Café": [
      {
        name: "Food Safety License",
        authority: "Saudi Food & Drug Authority (SFDA)",
        cost: "SAR 1,500",
        duration: "10–15 business days",
        required: true,
      },
      {
        name: "Civil Defense Approval",
        authority: "General Directorate of Civil Defense",
        cost: "SAR 600",
        duration: "7 business days",
        required: true,
      },
    ],
    "Healthcare Clinic": [
      {
        name: "Healthcare Facility License",
        authority: "Ministry of Health",
        cost: "SAR 3,500",
        duration: "30 business days",
        required: true,
      },
    ],
    "Retail / E-commerce": [
      {
        name: "Maroof E-commerce Registration",
        authority: "Ministry of Commerce",
        cost: "Free",
        duration: "Same day",
        required: true,
      },
    ],
    Construction: [
      {
        name: "Contractor Classification",
        authority: "Ministry of Municipal & Rural Affairs",
        cost: "SAR 2,000",
        duration: "20 business days",
        required: true,
      },
    ],
    "Tourism & Hospitality": [
      {
        name: "Tourism Activity License",
        authority: "Ministry of Tourism",
        cost: "SAR 2,500",
        duration: "14 business days",
        required: true,
      },
    ],
  };

  return [...base, ...(activitySpecific[activity] ?? [])];
}

function Index() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [activity, setActivity] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState<License[] | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity || !city) return;
    setResults(generateLicenses(activity, city));
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo />
            <div className="leading-tight">
              <div className="font-display font-bold text-lg">Nuysir</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                نُيسّر
              </div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#finder" className="hover:text-foreground transition-colors">License Finder</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
          </nav>
          <Button size="sm" asChild>
            <a href="#finder">Get started <ArrowRight className="w-3.5 h-3.5 ml-1" /></a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* pattern + gradient layers */}
        <div
          className="absolute inset-0 -z-10 pattern-bg opacity-[0.18]"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 80% 0%, color-mix(in oklab, var(--sky-soft) 75%, transparent), transparent 70%), radial-gradient(ellipse 70% 60% at 10% 100%, color-mix(in oklab, var(--saudi) 14%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--beige) 40%, white) 0%, white 100%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-20 md:pt-28 md:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-border text-xs font-medium text-saudi-deep mb-6 shadow-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Aligned with Saudi Vision 2030
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.02] text-foreground">
              Nuysir
            </h1>
            <div
              className="mt-2 text-xl md:text-2xl font-display font-light"
              style={{ color: "var(--saudi-deep)" }}
            >
              نُيسّر
            </div>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Your smart guide to business licenses in Saudi Arabia.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <Feature>Every required permit</Feature>
              <Feature>Authority &amp; cost breakdown</Feature>
              <Feature>Realistic timelines</Feature>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" asChild className="text-base h-12 px-6">
                <a href="#finder">Find my licenses <ArrowRight className="w-4 h-4 ml-1.5" /></a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base h-12 px-6">
                <a href="#how">How it works</a>
              </Button>
            </div>
          </div>
        </div>

        {/* decorative corner ornament */}
        <div className="pointer-events-none absolute top-6 right-6 hidden md:block">
          <Ornament className="w-28 h-28 text-primary/15" />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            <span className="w-6 h-px bg-primary" />
            How it works
            <span className="w-6 h-px bg-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Three steps to clarity</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: User, t: "Tell us about you", d: "Share your name, contact, and business idea." },
            { icon: Building2, t: "Pick activity & city", d: "We tailor the results to your sector and region." },
            { icon: ShieldCheck, t: "Get your license map", d: "Every required permit, cost, and timeline." },
          ].map((s, i) => (
            <div
              key={i}
              className="relative p-7 rounded-2xl border border-border bg-card shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all"
            >
              <div className="absolute top-5 right-5 text-xs font-display font-bold text-muted-foreground/40">
                0{i + 1}
              </div>
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-display font-semibold text-lg mb-1.5">{s.t}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Finder */}
      <section id="finder" className="relative py-20">
        <div className="absolute inset-0 -z-10 pattern-bg opacity-[0.08]" aria-hidden />
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              "linear-gradient(180deg, transparent, color-mix(in oklab, var(--beige) 50%, white) 30%, color-mix(in oklab, var(--beige) 50%, white) 70%, transparent)",
          }}
        />
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">License Finder</h2>
            <p className="mt-3 text-muted-foreground">
              Fill in your details and we'll generate your personalized licensing checklist.
            </p>
          </div>

          <Card className="border-border shadow-card rounded-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-primary via-[var(--gold)] to-[var(--sky-soft)]" />
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Your business details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Mohammed Al-Saud"
                      className="pl-9 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.sa"
                      className="pl-9 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Business activity</Label>
                  <Select value={activity} onValueChange={setActivity}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose an activity" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITIES.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 mt-2">
                  <Button type="submit" size="lg" className="w-full text-base h-12">
                    Find Required Licenses
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results */}
      {results && (
        <section id="results" className="max-w-6xl mx-auto px-6 pb-24">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {results.length} permits identified
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Your licensing roadmap
              {fullName && (
                <span className="text-muted-foreground font-normal">
                  , {fullName.split(" ")[0]}
                </span>
              )}
            </h2>
            <p className="text-muted-foreground mt-2">
              For <span className="text-foreground font-medium">{activity}</span> in{" "}
              <span className="text-foreground font-medium">{city}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {results.map((l, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl border border-border bg-card shadow-soft hover:shadow-card hover:border-primary/30 transition-all overflow-hidden"
              >
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 pattern-bg opacity-[0.1]"
                  aria-hidden
                />
                <div className="flex items-start justify-between mb-4 gap-3 relative">
                  <h3 className="font-display font-semibold text-lg leading-snug pr-2">
                    {l.name}
                  </h3>
                  <span
                    className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide ${
                      l.required
                        ? "bg-primary/10 text-primary"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {l.required ? "Required" : "Optional"}
                  </span>
                </div>
                <div className="space-y-3 text-sm relative">
                  <Row icon={Landmark} label="Authority" value={l.authority} />
                  <Row icon={Coins} label="Cost" value={l.cost} />
                  <Row icon={Clock} label="Duration" value={l.duration} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="about" className="relative border-t border-border bg-card">
        <div className="absolute inset-0 pattern-bg opacity-[0.06]" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <div className="font-display font-semibold">Nuysir · نُيسّر</div>
              <div className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} — Built for the KSA fintech ecosystem.
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Aligned with Saudi Vision 2030
          </div>
        </div>
      </footer>

      <ChatWidget open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-primary" />
      {children}
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </div>
        <div className="font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[var(--saudi-deep)] flex items-center justify-center shadow-soft">
      <Ornament className="w-6 h-6 text-white" />
    </div>
  );
}

function Ornament({ className }: { className?: string }) {
  // 8-point star inspired by Saudi geometric motifs
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <g stroke="currentColor" strokeWidth="1.5">
        <path d="M32 4 L40 24 L60 32 L40 40 L32 60 L24 40 L4 32 L24 24 Z" fill="currentColor" fillOpacity="0.15" />
        <rect x="14" y="14" width="36" height="36" transform="rotate(45 32 32)" />
        <rect x="14" y="14" width="36" height="36" />
        <circle cx="32" cy="32" r="6" />
      </g>
    </svg>
  );
}

function ChatWidget({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    {
      role: "bot",
      text: "أهلاً وسهلاً 👋 I'm your Nuysir assistant. Ask me anything about Saudi business licensing.",
    },
  ]);
  const [input, setInput] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "Great question! Complete the License Finder above and I'll explain each permit in detail.",
        },
      ]);
    }, 600);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card shadow-card overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div
            className="px-4 py-3.5 text-primary-foreground flex items-center justify-between relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--saudi) 0%, var(--saudi-deep) 100%)",
            }}
          >
            <div
              className="absolute inset-0 pattern-bg opacity-20"
              aria-hidden
            />
            <div className="flex items-center gap-2.5 relative">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="font-display font-semibold text-sm">Nuysir Assistant</div>
                <div className="text-[10px] opacity-80">Online · powered by AI</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="relative">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-muted/40">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="p-3 border-t border-border flex gap-2 bg-card">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about licenses, costs..."
              className="flex-1"
            />
            <Button type="submit" size="icon" aria-label="Send">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="Open AI assistant"
      >
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-40" />
        <span
          className="relative w-16 h-16 rounded-full flex items-center justify-center text-primary-foreground shadow-card hover:scale-105 transition-transform overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--saudi) 0%, var(--saudi-deep) 100%)",
          }}
        >
          <span
            className="absolute inset-0 pattern-bg opacity-20"
            aria-hidden
          />
          {open ? <X className="w-6 h-6 relative" /> : <MessageCircle className="w-6 h-6 relative" />}
        </span>
      </button>
    </>
  );
}

// keep referenced asset import resolved
void patternUrl;
