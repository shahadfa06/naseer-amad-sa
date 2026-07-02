import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/naseer/AppShell";
import { REGULATIONS, CATEGORY_META } from "@/lib/naseer-data";
import { ArrowLeft, ArrowRight, Building2, Calendar, Newspaper, ShieldCheck, ShieldAlert, RefreshCw } from "lucide-react";
import { localize, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/regulations")({
  head: () => ({
    meta: [
      { title: "الأنظمة | Regulations · نسير" },
      {
        name: "description",
        content: "مركز الامتثال الذكي لتحديثات الأنظمة التجارية والتراخيص الرسمية في المملكة.",
      },
    ],
  }),
  component: RegulationsPage,
});

function RegulationsPage() {
  const { lang, tr } = useLang();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const lastSync = REGULATIONS[0]?.lastSyncAt ?? "";

  return (
    <AppShell>
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary mb-3">
            <Newspaper className="w-4 h-4" />
            {tr("مركز الامتثال والتحديثات الحكومية", "Compliance & Government Updates")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            {tr("تحديثات الجهات الرسمية", "Official Government Updates")}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            {tr(
              "نتابع التحديثات الرسمية أول بأول ونساعدك تفهم أثرها على نشاطك التجاري.",
              "We track official updates in real time and help you understand their impact on your business.",
            )}
          </p>
        </div>

        {/* Sync status */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-4 flex flex-wrap items-center gap-4 shadow-soft">
          <div className="inline-flex items-center gap-2 text-sm">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </span>
            <div>
              <div className="font-semibold">{tr("مزامنة تلقائية مع المصادر الرسمية", "Auto-sync with official sources")}</div>
              <div className="text-xs text-muted-foreground">
                {tr("آخر مزامنة:", "Last sync:")} {lastSync}
              </div>
            </div>
          </div>
          <div className="ms-auto text-xs text-muted-foreground inline-flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {tr("لا نعرض بيانات مُقدَّرة أو غير موثّقة.", "We never display estimated or unverified data.")}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {REGULATIONS.map((r, i) => {
            const meta = CATEGORY_META[r.category];
            return (
              <Link
                key={r.id}
                to="/regulations/$id"
                params={{ id: r.id }}
                className="group relative p-6 rounded-3xl border border-border bg-card shadow-soft hover:shadow-card hover:border-primary/30 transition-all animate-fade-in flex flex-col"
                style={{ animationDelay: `${i * 70}ms`, animationFillMode: "backwards" }}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${meta.badge}`}>
                    {lang === "ar" ? meta.ar : meta.en}
                  </span>
                  {r.verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {tr("موثّق", "Verified")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-700">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {tr("قيد التحقق", "Verifying")}
                    </span>
                  )}
                </div>
                <h2 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition">{localize(lang, r.title)}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{localize(lang, r.summary)}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground pt-3 border-t border-border">
                  <div className="inline-flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {localize(lang, r.authority)}
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {r.publicationDate}
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {tr("عرض التفاصيل", "View details")}
                  <Arrow className="w-3.5 h-3.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
