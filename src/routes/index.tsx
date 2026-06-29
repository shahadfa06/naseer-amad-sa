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
  Clock,
  Coins,
  Landmark,
  FileText,
  Rocket,
  ClipboardList,
  Bot,
  Flag,
  Heart,
  ArrowLeft,
} from "lucide-react";
import patternUrl from "@/assets/pattern.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نُيسّر | Nuysir — طريقك ميسّر لتراخيص الأعمال" },
      {
        name: "description",
        content:
          "مع نُيسّر اكتشف كل التراخيص والمتطلبات الحكومية اللي تحتاجها لمشروعك في السعودية خلال ثوانٍ.",
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
};

const ACTIVITIES = [
  "كوفي شوب ☕",
  "مطعم 🍽️",
  "متجر إلكتروني 🛒",
  "صالون أو مركز تجميل 💇",
  "عيادة طبية 🩺",
  "ورشة أو مصنع صغير 🏭",
  "خدمات توصيل 🛵",
  "فنادق وضيافة 🏨",
  "تقنية مالية (Fintech) 💳",
  "تعليم وتدريب 🎓",
];

const CITIES = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "أبها",
  "تبوك",
  "نيوم",
];

function generateLicenses(activity: string): License[] {
  const base: License[] = [
    {
      name: "السجل التجاري",
      authority: "وزارة التجارة",
      cost: "١٬٢٠٠ ر.س / سنة",
      duration: "١ – ٣ أيام عمل",
    },
    {
      name: "رخصة بلدية",
      authority: "أمانة المنطقة (البلدية)",
      cost: "٨٠٠ – ٢٬٥٠٠ ر.س",
      duration: "٥ – ١٠ أيام عمل",
    },
    {
      name: "عضوية الغرفة التجارية",
      authority: "الغرفة التجارية السعودية",
      cost: "٥٠٠ ر.س / سنة",
      duration: "يوم عمل واحد",
    },
  ];

  if (activity.includes("كوفي") || activity.includes("مطعم")) {
    base.push(
      {
        name: "شهادة صحية للعاملين",
        authority: "وزارة الصحة",
        cost: "١٠٠ ر.س للعامل",
        duration: "٢ – ٥ أيام",
      },
      {
        name: "ترخيص سلامة غذائية",
        authority: "هيئة الغذاء والدواء (SFDA)",
        cost: "١٬٥٠٠ ر.س",
        duration: "١٠ – ١٥ يوم عمل",
      },
      {
        name: "موافقة الدفاع المدني",
        authority: "المديرية العامة للدفاع المدني",
        cost: "٦٠٠ ر.س",
        duration: "٧ أيام عمل",
      },
    );
  }
  if (activity.includes("متجر")) {
    base.push({
      name: "توثيق متجر في معروف",
      authority: "وزارة التجارة",
      cost: "مجاناً",
      duration: "نفس اليوم",
    });
  }
  if (activity.includes("عيادة")) {
    base.push({
      name: "ترخيص منشأة صحية",
      authority: "وزارة الصحة",
      cost: "٣٬٥٠٠ ر.س",
      duration: "٣٠ يوم عمل",
    });
  }
  if (activity.includes("Fintech") || activity.includes("مالية")) {
    base.push({
      name: "تصريح البيئة التجريبية (Sandbox)",
      authority: "البنك المركزي السعودي (ساما)",
      cost: "٥٬٠٠٠ ر.س",
      duration: "٣٠ – ٦٠ يوم عمل",
    });
  }
  if (activity.includes("فنادق") || activity.includes("ضيافة")) {
    base.push({
      name: "ترخيص نشاط سياحي",
      authority: "وزارة السياحة",
      cost: "٢٬٥٠٠ ر.س",
      duration: "١٤ يوم عمل",
    });
  }
  if (activity.includes("صالون") || activity.includes("تجميل")) {
    base.push({
      name: "ترخيص مزاولة مهنة",
      authority: "أمانة المنطقة",
      cost: "٧٠٠ ر.س",
      duration: "٥ أيام عمل",
    });
  }

  return base;
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
    setResults(generateLicenses(activity));
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{ ["--pattern-url" as string]: `url(${patternUrl})` } as React.CSSProperties}
    >
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <div className="leading-tight">
              <div className="font-display font-bold text-lg">نُيسّر</div>
              <div className="text-[10px] tracking-widest text-muted-foreground">NUYSIR</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">المميزات</a>
            <a href="#finder" className="hover:text-foreground transition-colors">ابدأ رحلتك</a>
            <a href="#about" className="hover:text-foreground transition-colors">عن نُيسّر</a>
          </nav>
          <Button size="sm" asChild className="rounded-full">
            <a href="#finder">
              ابدأ الآن
              <ArrowLeft className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pattern-bg opacity-[0.16]" aria-hidden />
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 85% 0%, color-mix(in oklab, var(--sky-soft) 80%, transparent), transparent 70%), radial-gradient(ellipse 70% 60% at 5% 100%, color-mix(in oklab, var(--saudi) 16%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--beige) 45%, white) 0%, white 100%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur border border-border text-xs font-semibold mb-7 shadow-soft" style={{ color: "var(--saudi-deep)" }}>
              <Flag className="w-3.5 h-3.5" />
              مستوحى من رؤية المملكة 2030
            </div>

            <h1 className="font-display text-6xl md:text-8xl font-black tracking-tight leading-none">
              نُيسّر
            </h1>
            <div className="mt-5 text-2xl md:text-3xl font-display font-bold" style={{ color: "var(--saudi-deep)" }}>
              مع نُيسّر… طريقك ميسّر.
            </div>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-loose">
              عندك فكرة مشروع؟ عطنا نوع النشاط ومدينتك،
              <br className="hidden md:block" />
              ونطلع لك كل التراخيص والمتطلبات الحكومية اللي تحتاجها خلال ثوانٍ.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" asChild className="text-base h-12 px-7 rounded-full shadow-soft">
                <a href="#finder">
                  <Rocket className="w-4 h-4" />
                  ابدأ الآن
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setChatOpen(true)}
                className="text-base h-12 px-7 rounded-full bg-white"
              >
                <MessageCircle className="w-4 h-4" />
                اسأل مساعد نُيسّر
              </Button>
            </div>

            <div className="mt-8 text-sm text-muted-foreground">
              يالله حيّهم 👋 — جاهزين نيسّرها عليك.
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute top-8 left-8 hidden md:block">
          <Ornament className="w-28 h-28 text-primary/15" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-primary font-bold mb-3">
            <span className="w-6 h-px bg-primary" />
            ليش نُيسّر؟
            <span className="w-6 h-px bg-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">خلّنا نيسّرها عليك</h2>
          <p className="mt-3 text-muted-foreground">كل اللي يحتاجه مشروعك… في مكان واحد.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Rocket, t: "وفّر وقتك", d: "بدل ما تبحث بين أكثر من جهة، نجيبها لك في مكان واحد." },
            { icon: ClipboardList, t: "كل التراخيص", d: "نعرض لك كل التراخيص والمتطلبات الحكومية حسب نشاطك." },
            { icon: Bot, t: "مساعد ذكي", d: "إذا احتجت أي استفسار، مساعد نُيسّر موجود معك." },
            { icon: Flag, t: "مصمم للسعودية", d: "يعرف الأنظمة والجهات الحكومية السعودية." },
          ].map((s, i) => (
            <div
              key={i}
              className="relative p-7 rounded-3xl border border-border bg-card shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-display font-bold text-lg mb-2">{s.t}</div>
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
              "linear-gradient(180deg, transparent, color-mix(in oklab, var(--beige) 55%, white) 25%, color-mix(in oklab, var(--sky-soft) 30%, white) 75%, transparent)",
          }}
        />
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">ابدأ رحلتك</h2>
            <p className="mt-3 text-muted-foreground">
              عطنا البيانات وخل الباقي علينا. جاهزين؟ يلا نبدأ.
            </p>
          </div>

          <Card className="border-border shadow-card rounded-3xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-l from-primary via-[var(--gold)] to-[var(--sky-soft)]" />
            <CardHeader className="pb-2 pt-7">
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                بياناتك
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-7">
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name" className="text-sm">👤 وش نسمّيك؟</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثلاً: محمد"
                      className="pr-9 h-12 rounded-xl text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="text-sm">📧 البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="pr-9 h-12 rounded-xl text-right"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">🏪 وش نوع مشروعك؟</Label>
                  <Select value={activity} onValueChange={setActivity}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="اختر النشاط" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITIES.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">📍 بأي مدينة؟</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 mt-3">
                  <Button type="submit" size="lg" className="w-full text-base h-13 py-4 rounded-2xl shadow-soft">
                    اعرف التراخيص
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    ما يحتاج تحتار — بنطلع لك كل اللي تحتاجه.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results */}
      {results && (
        <section id="results" className="max-w-6xl mx-auto px-6 pb-24">
          <div className="mb-10 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              طلّعنا لك {results.length} ترخيص ومتطلب
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              تفضّل{fullName && <>، {fullName}</>} — هذي رحلتك
            </h2>
            <p className="text-muted-foreground mt-2">
              لنشاط <span className="text-foreground font-semibold">{activity}</span> في{" "}
              <span className="text-foreground font-semibold">{city}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {results.map((l, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-3xl border border-border bg-card shadow-soft hover:shadow-card hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${i * 70}ms`, animationFillMode: "backwards" }}
              >
                <div className="absolute -top-12 -left-12 w-32 h-32 pattern-bg opacity-[0.1]" aria-hidden />
                <div className="flex items-start gap-3 mb-5 relative">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-0.5">📄 اسم الترخيص</div>
                    <h3 className="font-display font-bold text-lg leading-snug">{l.name}</h3>
                  </div>
                </div>
                <div className="space-y-3 text-sm relative">
                  <Row icon={Landmark} label="🏢 الجهة" value={l.authority} />
                  <Row icon={Coins} label="💰 الرسوم" value={l.cost} />
                  <Row icon={Clock} label="⏳ مدة الإصدار" value={l.duration} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="about" className="relative border-t border-border bg-card">
        <div className="absolute inset-0 pattern-bg opacity-[0.05]" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <div className="font-display font-bold">نُيسّر</div>
                <div className="text-xs text-muted-foreground">مع نُيسّر… طريقك ميسّر 🇸🇦</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              Made with <Heart className="w-3.5 h-3.5 fill-primary text-primary" /> in Saudi Arabia
            </div>
          </div>
        </div>
      </footer>

      {/* Chat */}
      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />
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
    <div className="flex items-center justify-between gap-3 py-2 border-t border-border/60 first:border-t-0">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="font-semibold text-foreground text-sm text-left" dir="auto">
        {value}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-[var(--saudi-deep)] flex items-center justify-center shadow-soft">
      <Ornament className="w-6 h-6 text-white" />
    </div>
  );
}

function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        <path d="M32 4 L40 24 L60 32 L40 40 L32 60 L24 40 L4 32 L24 24 Z" fill="currentColor" fillOpacity="0.18" />
        <circle cx="32" cy="32" r="6" />
      </g>
    </svg>
  );
}

type ChatMessage = { role: "user" | "bot"; text: string };

const SUGGESTIONS = [
  "أبي أفتح كوفي بالرياض. وش أول خطوة؟",
  "كم رسوم السجل التجاري؟",
  "هل أحتاج شهادة صحية؟",
  "وش التراخيص المطلوبة لمطعمي؟",
];

function ChatWidget({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text:
        "هلا والله 👋 أنا مساعد نُيسّر. اسألني أي شيء يخص مشروعك أو التراخيص أو الجهات الحكومية، وبنساعدك خطوة بخطوة.",
    },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: value },
      {
        role: "bot",
        text:
          "تمام 👌 خلّنا نيسّرها عليك — هذي إجابة تجريبية. في النسخة الكاملة بنوصلك بمساعد ذكي حقيقي يجاوبك بالتفصيل.",
      },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => onOpenChange(!open)}
        aria-label="مساعد نُيسّر"
        className="fixed bottom-6 left-6 z-40 group"
      >
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        <span className="relative flex items-center gap-2 h-14 px-5 rounded-full bg-primary text-primary-foreground shadow-card hover:scale-105 transition-transform">
          {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          <span className="font-semibold text-sm hidden sm:inline">مساعد نُيسّر</span>
        </span>
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 right-6 sm:right-auto sm:w-[380px] z-40 animate-fade-in">
          <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden flex flex-col max-h-[70vh]">
            <div
              className="relative px-5 py-4 text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--saudi) 0%, var(--saudi-deep) 100%)",
              }}
            >
              <div className="absolute inset-0 pattern-bg opacity-20" aria-hidden />
              <div className="relative flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-bold">مساعد نُيسّر</div>
                  <div className="text-xs opacity-80">حياك الله في نُيسّر</div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background/50">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] text-sm leading-relaxed px-4 py-2.5 rounded-2xl ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-bl-sm"
                        : "bg-white border border-border rounded-br-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {messages.length <= 1 && (
                <div className="pt-2 space-y-2">
                  <div className="text-[11px] text-muted-foreground px-1">أسئلة مقترحة:</div>
                  {SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="block w-full text-right text-xs px-3 py-2 rounded-xl border border-border bg-white hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-border bg-card flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب سؤالك…"
                className="h-10 rounded-xl text-right"
              />
              <Button type="submit" size="icon" className="h-10 w-10 rounded-xl shrink-0">
                <Send className="w-4 h-4 rotate-180" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// Silence unused import warnings for icons kept for future use
void Building2;
