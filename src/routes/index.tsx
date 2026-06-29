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
  MapPin,
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
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nuysir — Find Required Licenses to Start Your Business in Saudi Arabia" },
      {
        name: "description",
        content:
          "Nuysir helps entrepreneurs in Saudi Arabia discover the licenses, authorities, costs and timelines needed to launch their business.",
      },
      { property: "og:title", content: "Nuysir — Saudi Business Licensing, Simplified" },
      {
        property: "og:description",
        content:
          "Find the required licenses to start a business in Saudi Arabia in seconds.",
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
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Nuysir</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#finder" className="hover:text-foreground transition-colors">License Finder</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
          </nav>
          <Button size="sm" asChild>
            <a href="#finder">Get started</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at top right, color-mix(in oklab, var(--sky-soft) 70%, transparent), transparent 60%), radial-gradient(ellipse at bottom left, color-mix(in oklab, var(--primary) 12%, transparent), transparent 55%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Built for entrepreneurs in Saudi Arabia
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Find every license you need to{" "}
              <span className="text-primary">start your business</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Nuysir maps your business activity to the exact permits, authorities, costs,
              and timelines — so you can launch in days, not months.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Vision 2030 aligned
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Updated authority data
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Free to use
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: User, t: "Tell us about you", d: "Share your name, contact, and business idea." },
            { icon: Building2, t: "Pick activity & city", d: "We tailor results to your sector and region." },
            { icon: ShieldCheck, t: "Get your license map", d: "See every required permit, cost, and timeline." },
          ].map((s, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-border bg-card hover:shadow-sm transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--sky-soft)] flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-semibold mb-1">{s.t}</div>
              <div className="text-sm text-muted-foreground">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Finder */}
      <section id="finder" className="max-w-4xl mx-auto px-6 py-16">
        <Card className="border-border shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle className="font-display text-2xl">License Finder</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fill in your details and we'll generate your personalized licensing checklist.
            </p>
          </CardHeader>
          <CardContent>
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
                    className="pl-9"
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
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Business activity</Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                <Button type="submit" size="lg" className="w-full text-base">
                  Find Required Licenses
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Results */}
      {results && (
        <section id="results" className="max-w-6xl mx-auto px-6 pb-24">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">
              Your licensing roadmap
              {fullName && <span className="text-muted-foreground font-normal">, {fullName.split(" ")[0]}</span>}
            </h2>
            <p className="text-muted-foreground mt-2">
              {results.length} permits identified for{" "}
              <span className="text-foreground font-medium">{activity}</span> in{" "}
              <span className="text-foreground font-medium">{city}</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {results.map((l, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4 gap-3">
                  <h3 className="font-display font-semibold text-lg leading-snug">
                    {l.name}
                  </h3>
                  <span
                    className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${
                      l.required
                        ? "bg-primary/10 text-primary"
                        : "bg-[var(--sky-soft)] text-accent-foreground"
                    }`}
                  >
                    {l.required ? "Required" : "Optional"}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
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
      <footer id="about" className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">Nuysir</span>
            <span className="text-sm text-muted-foreground ml-2">
              © {new Date().getFullYear()} — Built for the KSA fintech ecosystem.
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Aligned with Saudi Vision 2030
          </div>
        </div>
      </footer>

      {/* Floating AI assistant */}
      <ChatWidget open={chatOpen} setOpen={setChatOpen} />
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
      <div className="w-8 h-8 rounded-lg bg-[var(--sky-soft)] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium text-foreground">{value}</div>
      </div>
    </div>
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
      text: "مرحباً 👋 I'm your Nuysir assistant. Ask me anything about Saudi business licensing.",
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
          text: "Great question! For accurate guidance, complete the License Finder above and I'll explain each permit in detail.",
        },
      ]);
    }, 600);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="px-4 py-3 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold text-sm">Nuysir AI Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-muted/30">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
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
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 transition-transform flex items-center justify-center"
        aria-label="Open AI assistant"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}

// silence unused import warning for MapPin (kept for future use)
void MapPin;
