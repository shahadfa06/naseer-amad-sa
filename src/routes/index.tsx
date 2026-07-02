import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bot, ClipboardList, Flag, LayoutGrid, MessageCircle, Rocket, ScrollText, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/naseer/AppShell";
import { Ornament } from "@/components/naseer/brand";
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

function HomePage() {
  return (
    <AppShell>
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

        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur border border-border text-xs font-semibold mb-7 shadow-soft"
              style={{ color: "var(--saudi-deep)" }}
            >
              <Flag className="w-3.5 h-3.5" />
              حيّاكم الله في نسير 🇸🇦 — مستوحى من رؤية 2030
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
              مع نسير…
              <br />
              <span style={{ color: "var(--saudi-deep)" }}>طريقك يسير.</span>
            </h1>

            <p className="mt-7 text-base md:text-lg text-muted-foreground max-w-2xl leading-loose">
              من أول خطوة… لين إصدار آخر ترخيص،
              <br className="hidden md:block" />
              نسير معك ونسهّل عليك كل إجراءات مشروعك في مكان واحد.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" asChild className="text-base h-12 px-7 rounded-full shadow-soft">
                <Link to="/register">
                  <Rocket className="w-4 h-4" />
                  ابدأ رحلتك
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base h-12 px-7 rounded-full bg-white"
              >
                <a href="#assistant">
                  <MessageCircle className="w-4 h-4" />
                  اسأل مساعد نسير
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute top-8 left-8 hidden md:block">
          <Ornament className="w-28 h-28 text-primary/15" />
        </div>
      </section>

      {/* Journey / Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-primary font-bold mb-3">
            <span className="w-6 h-px bg-primary" />
            كيف نسير معك؟
            <span className="w-6 h-px bg-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">خلّ الباقي علينا</h2>
          <p className="mt-3 text-muted-foreground">أربع خطوات… ومشروعك على الطريق.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: ShieldCheck, t: "سجّل بأمان", d: "أنشئ حسابك وربطه بهويتك الوطنية بشكل آمن.", href: "/register" },
            { icon: LayoutGrid, t: "اختر نشاطك", d: "من كوفي شوب لصيدلية — نعرف اللي يناسبك.", href: "/activities" },
            { icon: ScrollText, t: "شوف التراخيص", d: "كل التراخيص المطلوبة بجهاتها ورسومها.", href: "/licenses" },
            { icon: ClipboardList, t: "تابع طلباتك", d: "من التقديم لين الإصدار في لوحة واحدة.", href: "/applications" },
          ].map((s, i) => (
            <Link
              key={i}
              to={s.href}
              className="group relative p-7 rounded-3xl border border-border bg-card shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-display font-bold text-lg mb-2 flex items-center gap-2">
                {s.t}
                <ArrowLeft className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">{s.d}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Assistant call-out */}
      <section id="assistant" className="max-w-6xl mx-auto px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-card p-8 md:p-12">
          <div className="absolute inset-0 pattern-bg opacity-[0.06]" aria-hidden />
          <div
            className="absolute -left-24 -top-24 w-72 h-72 rounded-full blur-3xl opacity-40"
            style={{ background: "var(--saudi)" }}
            aria-hidden
          />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary mb-3">
                <Bot className="w-4 h-4" /> مساعد نسير
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                حاير من وين تبدأ؟ اسأل مساعد نسير.
              </h3>
              <p className="text-muted-foreground max-w-xl">
                جاوبك عن أي استفسار يخص مشروعك، التراخيص، الجهات الحكومية، والرسوم — بلهجتك.
              </p>
            </div>
            <Button size="lg" className="rounded-full h-12 px-6" asChild>
              <a href="#">
                <MessageCircle className="w-4 h-4" />
                افتح المساعد
              </a>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
