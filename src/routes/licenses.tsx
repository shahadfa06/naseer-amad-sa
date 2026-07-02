import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { AppShell } from "@/components/naseer/AppShell";
import { ACTIVITIES, getLicensesFor } from "@/lib/naseer-data";
import { META, DEFAULT_META, type LicenseMeta } from "@/lib/licenses-meta";
import {
  Clock,
  Coins,
  ExternalLink,
  FileText,
  Landmark,
  Sparkles,
  Rocket,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  BadgeCheck,
} from "lucide-react";
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

  return (
    <AppShell>
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {current
              ? `${current.emoji} ${localize(lang, current.name)}`
              : tr("اختر نشاطك", "Pick your activity")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            {tr("التراخيص المطلوبة", "Required Licenses")}
          </h1>
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
            const meta = META[l.id] ?? DEFAULT_META;
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
                  <div className="flex-1">
                    <div className="text-[11px] text-muted-foreground mb-0.5">
                      {tr("اسم الترخيص", "License name")}
                    </div>
                    <h3 className="font-display font-bold text-lg leading-snug">
                      {localize(lang, l.name)}
                    </h3>
                  </div>
                  <VerifyBadge meta={meta} />
                </div>

                <div className="space-y-3 text-sm relative mb-5">
                  <Row icon={Landmark} label={tr("الجهة", "Authority")} value={localize(lang, l.authority)} />
                  <Row icon={Coins} label={tr("الرسوم الرسمية", "Official fees")} value={localize(lang, l.cost)} />
                  <Row icon={Clock} label={tr("مدة الإنجاز", "Processing time")} value={localize(lang, l.duration)} />
                </div>

                <SyncStrip meta={meta} />

                <div className="relative flex flex-wrap items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild className="rounded-full">
                    <a href={l.authorityUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" />
                      {tr("الانتقال إلى الجهة الرسمية", "Go to official authority")}
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="rounded-full"
                  >
                    <Link
                      to="/journey/$licenseId"
                      params={{ licenseId: l.id }}
                      search={{ activity: activity ?? "" }}
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      {tr("ابدأ الرحلة", "Start Journey")}
                    </Link>
                  </Button>
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

function VerifyBadge({ meta }: { meta: LicenseMeta }) {
  const { tr } = useLang();
  if (meta.stale) {
    return (
      <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
        <AlertTriangle className="w-3 h-3" />
        {tr("قد تكون قديمة", "May be outdated")}
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
      <BadgeCheck className="w-3 h-3" />
      {tr("موثوق", "Verified")}
    </div>
  );
}

function SyncStrip({ meta }: { meta: LicenseMeta }) {
  const { tr } = useLang();
  return (
    <div className="relative rounded-2xl border border-border/70 bg-background/60 p-3 text-[11px] space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <RefreshCw className="w-3 h-3" />
          {tr("آخر مزامنة ناجحة", "Last successful sync")}
        </span>
        <span className="font-semibold" dir="auto">{meta.lastSyncedAt}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <ShieldCheck className="w-3 h-3" />
          {tr("آخر تحديث رسمي", "Last official update")}
        </span>
        <span className="font-semibold" dir="auto">{meta.lastOfficialUpdate}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <ExternalLink className="w-3 h-3" />
          {tr("المصدر الرسمي", "Source")}
        </span>
        <a
          href={meta.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-primary hover:underline truncate max-w-[55%]"
          dir="ltr"
        >
          {meta.sourceUrl.replace(/^https?:\/\//, "")}
        </a>
      </div>
      {meta.stale && (
        <div className="flex items-start gap-1.5 text-amber-800 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-2 py-1.5 mt-1">
          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
          <span className="leading-relaxed">
            {tr(
              "لم تُحدَّث هذه البيانات منذ فترة — يرجى التحقق من الموقع الرسمي.",
              "Data hasn't been refreshed recently — please double-check the official site.",
            )}
          </span>
        </div>
      )}
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
  const { dir } = useLang();
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-t border-border/60 first:border-t-0">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div
        className={`font-semibold text-foreground text-sm ${dir === "rtl" ? "text-left" : "text-right"}`}
        dir="auto"
      >
        {value}
      </div>
    </div>
  );
}
