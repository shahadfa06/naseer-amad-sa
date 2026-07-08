import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
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
import { Logo, logoUrl } from "@/components/naseer/brand";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

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

function HomePage() {
  const { lang, tr } = useLang();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const ACTIVITIES = [
    { icon: Coffee, label: tr("كوفي شوب", "Coffee Shop"), cls: "bg-[#EFE9D9] dark:bg-secondary" },
    { icon: UtensilsCrossed, label: tr("مطعم", "Restaurant"), cls: "bg-[#E9E3D2] dark:bg-secondary" },
    { icon: Scissors, label: tr("صالون", "Salon"), cls: "bg-[#EFEBE0] dark:bg-secondary" },
    { icon: Store, label: tr("بيع تجزئة", "Retail"), cls: "bg-[#E7E1D1] dark:bg-secondary" },
    { icon: Stethoscope, label: tr("عيادة", "Clinic"), cls: "bg-[#EEE7D2] dark:bg-secondary" },
    { icon: Building2, label: tr("مقاولات", "Contracting"), cls: "bg-[#EAE3CE] dark:bg-secondary" },
  ];

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pattern-bg opacity-[0.10]" aria-hidden />

        {/* Aurora background effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          {/* Emerald aurora — left side (empty space, no text overlap) */}
          <div
            className="absolute top-[5%] -left-[10%] w-[55%] h-[75%] rounded-full"
            style={{
              background: "rgba(15,92,82,0.10)",
              filter: "blur(70px)",
              animation: "aurora-drift 20s ease-in-out infinite",
            }}
          />
          {/* Secondary emerald accent — left mid */}
          <div
            className="absolute top-[35%] left-[5%] w-[30%] h-[40%] rounded-full"
            style={{
              background: "rgba(47,168,139,0.08)",
              filter: "blur(60px)",
              animation: "aurora-drift 26s ease-in-out infinite reverse",
              animationDelay: "-6s",
            }}
          />
          {/* Gold aurora — top area */}
          <div
            className="absolute -top-[5%] left-[30%] w-[40%] h-[35%] rounded-full"
            style={{
              background: "rgba(216,193,122,0.14)",
              filter: "blur(65px)",
              animation: "aurora-drift 24s ease-in-out infinite",
              animationDelay: "-4s",
            }}
          />
          {/* Warm gold wash — bottom left */}
          <div
            className="absolute -bottom-[5%] left-[15%] w-[45%] h-[40%] rounded-full"
            style={{
              background: "rgba(216,193,122,0.10)",
              filter: "blur(55px)",
              animation: "aurora-drift 28s ease-in-out infinite reverse",
              animationDelay: "-10s",
            }}
          />
        </div>

        {/* Brand watermark */}
        <div
          className="pointer-events-none absolute top-10 -left-6 hidden lg:block -z-10"
          aria-hidden
          style={{
            width: "420px",
            height: "530px",
            opacity: 0.06,
            backgroundImage: `url(${logoUrl})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-3xl">
            <div className="mb-10 pt-2 flex justify-start">
              <Logo size={280} />
            </div>

            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/90 backdrop-blur border border-border text-xs font-semibold mb-7 shadow-soft"
              style={{ color: "var(--saudi-deep)" }}
            >
              <Flag className="w-3.5 h-3.5" />
              {tr(
                "حيّاكم الله في نسير 🇸🇦 — مستوحى من رؤية 2030",
                "Welcome to Naseer 🇸🇦 — Inspired by Vision 2030",
              )}
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight leading-[1.02]">
              {tr("مع نسير…", "With Naseer…")}
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, var(--saudi) 0%, var(--saudi-ink) 55%, var(--gold) 120%)",
                }}
              >
                {tr("طريقك يسير.", "your path is smooth.")}
              </span>
            </h1>

            <p className="mt-7 text-base md:text-lg text-muted-foreground max-w-2xl leading-loose">
              {tr(
                "من أول خطوة… لين إصدار آخر ترخيص،",
                "From your very first step… to issuing your last license,",
              )}
              <br className="hidden md:block" />
              {tr(
                "نسير معك ونسهّل عليك كل إجراءات مشروعك في مكان واحد.",
                "we walk with you and simplify every business procedure in one place.",
              )}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" asChild className="text-base h-13 px-8 rounded-full shadow-soft">
                <Link to="/register">
                  <Rocket className="w-4 h-4" />
                  {tr("ابدأ رحلتك الآن", "Start your journey")}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base h-13 px-8 rounded-full bg-card/70 backdrop-blur border-border hover:bg-card"
              >
                <a href="#assistant">
                  <MessageCircle className="w-4 h-4" />
                  {tr("اسأل مساعد نسير", "Ask Naseer Assistant")}
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                {tr("ربط آمن بالهوية الوطنية", "Secure National ID integration")}
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {tr(
                  "معتمد على بيانات المركز السعودي للأعمال",
                  "Backed by Saudi Business Center data",
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                {tr("مساعد ذكي بلهجتك", "Smart assistant in your language")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey / Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-3 text-xs tracking-[0.24em] text-primary font-bold mb-4">
            <span className="w-8 h-px bg-primary/60" />
            {tr("كيف نسير معك؟", "How Naseer works")}
            <span className="w-8 h-px bg-primary/60" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">{tr("خلّ الباقي علينا", "Leave the rest to us")}</h2>
          <p className="mt-3 text-muted-foreground">
            {tr("أربع خطوات… ومشروعك على الطريق.", "Four steps — and your business is on the way.")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: ShieldCheck,
              t: tr("سجّل بأمان", "Sign up securely"),
              d: tr("أنشئ حسابك وربطه بهويتك الوطنية بشكل آمن.", "Create your account and link it securely to your National ID."),
              href: "/register",
              n: tr("٠١", "01"),
            },
            {
              icon: LayoutGrid,
              t: tr("اختر نشاطك", "Choose your activity"),
              d: tr("من كوفي شوب لصيدلية — نعرف اللي يناسبك.", "From coffee shops to pharmacies — we know what fits."),
              href: "/activities",
              n: tr("٠٢", "02"),
            },
            {
              icon: ScrollText,
              t: tr("شوف التراخيص", "See required licenses"),
              d: tr("كل التراخيص المطلوبة بجهاتها ورسومها.", "All required licenses with their authorities and fees."),
              href: "/licenses",
              n: tr("٠٣", "03"),
            },
            {
              icon: ClipboardList,
              t: tr("تابع طلباتك", "Track your applications"),
              d: tr("من التقديم لين الإصدار في لوحة واحدة.", "From submission to issuance in a single dashboard."),
              href: "/applications",
              n: tr("٠٤", "04"),
            },
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
                <Arrow className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
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
              <div className="text-xs tracking-[0.2em] text-primary font-bold mb-2">
                {tr("الأنشطة الشائعة", "Popular activities")}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">{tr("وش نوع مشروعك؟", "What kind of business?")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {tr("اختر النشاط وتعرّف على تراخيصه.", "Pick an activity and view its licenses.")}
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full self-start md:self-end">
              <Link to="/activities">
                {tr("عرض الكل", "View all")}
                <Arrow className="w-4 h-4" />
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
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${a.cls}`}
                >
                  <a.icon className="w-5 h-5 text-saudi-ink" />
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
              "linear-gradient(135deg, #002A14 0%, #005128 60%, #003D1E 100%)",
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
                <Bot className="w-4 h-4" /> {tr("مساعد نسير الذكي", "Naseer Smart Assistant")}
              </div>
              <h3 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {tr("حاير من وين تبدأ؟", "Not sure where to start?")}
                <br />
                <span style={{ color: "var(--gold)" }}>
                  {tr("اسأل مساعد نسير.", "Ask Naseer Assistant.")}
                </span>
              </h3>
              <p className="opacity-85 max-w-xl leading-loose">
                {tr(
                  "جاوبك عن أي استفسار يخص مشروعك، التراخيص، الجهات الحكومية، والرسوم — بلهجتك، وعلى مدار الساعة.",
                  "Answers anything about your business, licenses, government authorities, and fees — in your language, 24/7.",
                )}
              </p>
            </div>
            <Button
              size="lg"
              className="rounded-full h-14 px-8 bg-white text-primary hover:bg-white/90 shadow-glow self-start md:self-center"
              asChild
            >
              <a href="#">
                <MessageCircle className="w-5 h-5" />
                {tr("افتح المساعد الآن", "Open the assistant")}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
