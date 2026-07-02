import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  ClipboardList,
  Flag,
  LayoutGrid,
  MessageCircle,
  Rocket,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Store,
  Building2,
  Stethoscope,
  Coffee,
  Scissors,
  UtensilsCrossed,
} from "lucide-react";
import { AppShell } from "@/components/naseer/AppShell";
import { Logo, Ornament } from "@/components/naseer/brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نسير | Naseer — مع نسير… طريقك يسير" },
      {
        name: "description",
        content:
          "نسير — منصة سعودية تسهّل عليك كل إجراءات مشروعك، من أول خطوة لين إصدار آخر ترخيص، في مكان واحد.",
      },
      { property: "og:title", content: "نسير — طريقك يسير" },
      { property: "og:description", content: "منصة سعودية لإجراءات وتراخيص الأعمال." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

const ACTIVITIES = [
  { icon: Coffee, label: "كوفي شوب", tint: "#EFE9D9" },
  { icon: UtensilsCrossed, label: "مطعم", tint: "#E9E3D2" },
  { icon: Scissors, label: "صالون", tint: "#EFEBE0" },
  { icon: Store, label: "بيع تجزئة", tint: "#E7E1D1" },
  { icon: Stethoscope, label: "عيادة", tint: "#EEE7D2" },
  { icon: Building2, label: "مقاولات", tint: "#EAE3CE" },
];


function HomePage() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pattern-bg opacity-[0.10]" aria-hidden />
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 85% -10%, color-mix(in oklab, var(--saudi) 22%, transparent), transparent 65%), radial-gradient(ellipse 60% 55% at 0% 110%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 65%), linear-gradient(180deg, var(--cream) 0%, var(--background) 60%)",
          }}
        />

        {/* Ornaments */}
        <div className="pointer-events-none absolute top-16 left-6 hidden md:block">
          <Ornament className="w-28 h-28 text-primary/20 [animation:float-slow_8s_ease-in-out_infinite]" />
        </div>
        <div className="pointer-events-none absolute bottom-10 right-10 hidden lg:block">
          <Ornament className="w-40 h-40 text-primary/10" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-3xl">
            <div className="mb-8 flex justify-start">
              <Logo size={104} withRing />
            </div>

            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur border border-border text-xs font-semibold mb-7 shadow-soft"
              style={{ color: "var(--saudi-deep)" }}
            >
              <Flag className="w-3.5 h-3.5" />
              حيّاكم الله في نسير 🇸🇦 — مستوحى من رؤية 2030
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight leading-[1.02]">
              مع نسير…
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, var(--saudi) 0%, var(--saudi-ink) 55%, var(--gold) 120%)",
                }}
              >
                طريقك يسير.
              </span>
            </h1>

            <p className="mt-7 text-base md:text-lg text-muted-foreground max-w-2xl leading-loose">
              من أول خطوة… لين إصدار آخر ترخيص،
              <br className="hidden md:block" />
              نسير معك ونسهّل عليك كل إجراءات مشروعك في مكان واحد.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" asChild className="text-base h-13 px-8 rounded-full shadow-soft">
                <Link to="/register">
                  <Rocket className="w-4 h-4" />
                  ابدأ رحلتك الآن
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base h-13 px-8 rounded-full bg-white/70 backdrop-blur border-border hover:bg-white"
              >
                <a href="#assistant">
                  <MessageCircle className="w-4 h-4" />
                  اسأل مساعد نسير
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> ربط آمن بالهوية الوطنية
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" /> معتمد على بيانات المركز السعودي للأعمال
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> مساعد ذكي بلهجتك
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/80 backdrop-blur border border-border p-5 shadow-soft"
              >
                <div className="font-display font-black text-3xl" style={{ color: "var(--saudi-ink)" }}>
                  {s.k}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-3 text-xs tracking-[0.24em] text-primary font-bold mb-4">
            <span className="w-8 h-px bg-primary/60" />
            كيف نسير معك؟
            <span className="w-8 h-px bg-primary/60" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">خلّ الباقي علينا</h2>
          <p className="mt-3 text-muted-foreground">أربع خطوات… ومشروعك على الطريق.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: ShieldCheck, t: "سجّل بأمان", d: "أنشئ حسابك وربطه بهويتك الوطنية بشكل آمن.", href: "/register", n: "٠١" },
            { icon: LayoutGrid, t: "اختر نشاطك", d: "من كوفي شوب لصيدلية — نعرف اللي يناسبك.", href: "/activities", n: "٠٢" },
            { icon: ScrollText, t: "شوف التراخيص", d: "كل التراخيص المطلوبة بجهاتها ورسومها.", href: "/licenses", n: "٠٣" },
            { icon: ClipboardList, t: "تابع طلباتك", d: "من التقديم لين الإصدار في لوحة واحدة.", href: "/applications", n: "٠٤" },
          ].map((s, i) => (
            <Link
              key={i}
              to={s.href}
              className="group relative p-7 rounded-3xl border border-border bg-card shadow-soft hover:shadow-card hover:-translate-y-1.5 hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              <div
                className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity"
                style={{ background: "color-mix(in oklab, var(--saudi) 25%, transparent)" }}
                aria-hidden
              />
              <div className="relative flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-display text-xs font-black tracking-widest text-muted-foreground/60">
                  {s.n}
                </div>
              </div>
              <div className="relative font-display font-bold text-lg mb-2 flex items-center gap-2">
                {s.t}
                <ArrowLeft className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
              </div>
              <div className="relative text-sm text-muted-foreground leading-relaxed">{s.d}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Activities preview */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-3xl border border-border bg-card shadow-soft p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 pattern-bg opacity-[0.05]" aria-hidden />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <div className="text-xs tracking-[0.2em] text-primary font-bold mb-2">الأنشطة الشائعة</div>
              <h3 className="text-2xl md:text-3xl font-bold">وش نوع مشروعك؟</h3>
              <p className="mt-2 text-sm text-muted-foreground">اختر النشاط وتعرّف على تراخيصه.</p>
            </div>
            <Button asChild variant="outline" className="rounded-full self-start md:self-end">
              <Link to="/activities">
                عرض الكل
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {ACTIVITIES.map((a, i) => (
              <Link
                key={i}
                to="/activities"
                className="group rounded-2xl border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/40 hover:-translate-y-1 hover:shadow-soft transition-all bg-background/50"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ background: a.tint }}
                >
                  <a.icon className="w-5 h-5" style={{ color: "var(--saudi-ink)" }} />
                </div>
                <div className="text-sm font-semibold">{a.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Assistant call-out */}
      <section id="assistant" className="max-w-6xl mx-auto px-6 py-20">
        <div
          className="relative overflow-hidden rounded-[2rem] p-8 md:p-14 text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--saudi-ink) 0%, var(--saudi) 60%, var(--saudi-deep) 100%)",
          }}
        >
          <div className="absolute inset-0 pattern-bg opacity-[0.10]" aria-hidden />
          <div
            className="absolute -left-32 -top-32 w-96 h-96 rounded-full blur-3xl opacity-40"
            style={{ background: "color-mix(in oklab, var(--gold) 60%, transparent)" }}
            aria-hidden
          />
          <div
            className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{ background: "color-mix(in oklab, #6FBF9A 70%, transparent)" }}
            aria-hidden
          />

          <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur mb-4">
                <Bot className="w-4 h-4" /> مساعد نسير الذكي
              </div>
              <h3 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                حاير من وين تبدأ؟
                <br />
                <span style={{ color: "var(--gold)" }}>اسأل مساعد نسير.</span>
              </h3>
              <p className="opacity-85 max-w-xl leading-loose">
                جاوبك عن أي استفسار يخص مشروعك، التراخيص، الجهات الحكومية، والرسوم — بلهجتك، وعلى مدار الساعة.
              </p>
            </div>
            <Button
              size="lg"
              className="rounded-full h-14 px-8 bg-white text-primary hover:bg-white/90 shadow-glow self-start md:self-center"
              asChild
            >
              <a href="#">
                <MessageCircle className="w-5 h-5" />
                افتح المساعد الآن
              </a>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
