import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/naseer/AppShell";
import { ACTIVITIES, getLicensesFor, store, type License } from "@/lib/naseer-data";
import { Clock, Coins, ExternalLink, FileText, Landmark, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localize, useLang } from "@/lib/i18n";

const search = z.object({ activity: z.string().optional() });

export const Route = createFileRoute("/licenses")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "التراخيص | Licenses · نسير" },
      { name: "description", content: "كل التراخيص الحكومية اللي يحتاجها مشروعك في مكان واحد." },
    ],
  }),
  component: LicensesPage,
});

function LicensesPage() {
  const { lang, tr } = useLang();
  const { activity } = Route.useSearch();
  const list = useMemo(() => (activity ? getLicensesFor(activity) : []), [activity]);
  const current = ACTIVITIES.find((a) => a.id === activity);
  const [submitted, setSubmitted] = useState<Record<string, string>>({});

  const submit = (l: License) => {
    const app = store.addApplication(l);
    setSubmitted((s) => ({ ...s, [l.id]: app.id }));
  };

  return (
    <AppShell>
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {current ? `${current.emoji} ${localize(lang, current.name)}` : tr("اختر نشاطك", "Pick your activity")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{tr("التراخيص المطلوبة", "Required Licenses")}</h1>
          <p className="mt-3 text-muted-foreground">
            {current
              ? tr(
                  `طلّعنا لك ${list.length} ترخيص ومتطلب لنشاط ${current.name}.`,
                  `We found ${list.length} licenses & requirements for ${localize(lang, current.name)}.`,
                )
              : tr("روح لصفحة الأنشطة واختر نوع مشروعك.", "Head to the Activities page and pick your business type.")}
          </p>
        </div>

        {!current && (
          <div className="max-w-md mx-auto text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/activities">{tr("اختر نشاطك", "Pick your activity")}</Link>
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {list.map((l, i) => {
            const done = submitted[l.id];
            return (
              <div
                key={l.id}
                className="group relative p-6 rounded-3xl border border-border bg-card shadow-soft hover:shadow-card hover:border-primary/30 transition-all overflow-hidden animate-fade-in"
                style={{ animationDelay: `${i * 70}ms`, animationFillMode: "backwards" }}
              >
                <div className="absolute -top-12 -left-12 w-32 h-32 pattern-bg opacity-[0.08]" aria-hidden />
                <div className="relative flex items-start gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-0.5">{tr("اسم الترخيص", "License name")}</div>
                    <h3 className="font-display font-bold text-lg leading-snug">{localize(lang, l.name)}</h3>
                  </div>
                </div>
                <div className="space-y-3 text-sm relative mb-5">
                  <Row icon={Landmark} label={tr("الجهة", "Authority")} value={localize(lang, l.authority)} />
                  <Row icon={Coins} label={tr("الرسوم", "Cost")} value={localize(lang, l.cost)} />
                  <Row icon={Clock} label={tr("مدة الإصدار", "Duration")} value={localize(lang, l.duration)} />
                </div>

                <div className="relative flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" asChild className="rounded-full">
                    <a href={l.authorityUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" />
                      {tr("زيارة موقع الجهة", "Visit authority site")}
                    </a>
                  </Button>
                  {done ? (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {tr(`تم إرسال طلبك (${done})`, `Application submitted (${done})`)}
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => submit(l)} className="rounded-full">
                      <Send className={`w-3.5 h-3.5 ${lang === "ar" ? "rotate-180" : ""}`} />
                      {tr("تقديم الطلب", "Submit application")}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {current && (
          <div className="text-center mt-10">
            <Button variant="outline" asChild className="rounded-full">
              <Link to="/applications">{tr("شوف طلباتي", "View my applications")}</Link>
            </Button>
          </div>
        )}
      </section>
    </AppShell>
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
  const { dir } = useLang();
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-t border-border/60 first:border-t-0">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className={`font-semibold text-foreground text-sm ${dir === "rtl" ? "text-left" : "text-right"}`} dir="auto">
        {value}
      </div>
    </div>
  );
}
