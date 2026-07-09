import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/naseer/AppShell";
import { ACTIVITIES, getLicensesFor, store, type License } from "@/lib/naseer-data";
import { Button } from "@/components/ui/button";
import { useLang, localize } from "@/lib/i18n";
import {
  Wallet,
  Calculator,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Building2,
  FileText,
} from "lucide-react";

const search = z.object({ activity: z.string().optional() });

export const Route = createFileRoute("/funding")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "التمويل | Funding · نسير" },
      {
        name: "description",
        content:
          "اعرف تكلفة التراخيص، وقارنها بميزانيتك، واحصل على أفضل خيارات التمويل.",
      },
      { property: "og:title", content: "التمويل | Funding · نسير" },
      {
        property: "og:description",
        content: "قارن تكلفة التراخيص بميزانيتك واستكشف خيارات التمويل.",
      },
    ],
  }),
  component: FundingPage,
});

// ---- Cost parsing (Arabic-Indic digits + ranges) ----
const AR_DIGITS: Record<string, string> = {
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
};
function normalizeDigits(s: string): string {
  return s.replace(/[٠-٩]/g, (d) => AR_DIGITS[d] ?? d).replace(/[٬،,]/g, "");
}
function parseCost(cost: string): number {
  const nums = normalizeDigits(cost).match(/\d+(?:\.\d+)?/g);
  if (!nums) return 0;
  return Math.max(...nums.map(parseFloat));
}
function estimateTotal(licenses: License[]): number {
  return licenses.reduce((sum, l) => sum + parseCost(l.cost), 0);
}

// ---- Financing providers (placeholder; ready for Supabase/Firebase) ----
export type FinancingProvider = {
  id: string;
  name: { ar: string; en: string };
  maxAmount: number;
  terms: { ar: string; en: string };
  applyUrl: string;
};

const PROVIDERS: FinancingProvider[] = [
  {
    id: "sdb",
    name: { ar: "بنك التنمية الاجتماعية — كفالة", en: "SDB — Kafalah" },
    maxAmount: 500000,
    terms: {
      ar: "تمويل للمنشآت الصغيرة والمتوسطة بضمان جزئي، فترة سداد حتى ٦٠ شهرًا.",
      en: "SME financing with partial guarantee, repayment up to 60 months.",
    },
    applyUrl: "https://www.sdb.gov.sa",
  },
  {
    id: "monshaat",
    name: { ar: "منشآت — التمويل غير المباشر", en: "Monsha'at — Indirect Lending" },
    maxAmount: 300000,
    terms: {
      ar: "تمويل عبر جهات معتمدة بدون رسوم إدارية، مناسب للشركات الناشئة.",
      en: "Financing via accredited lenders, no admin fees, startup-friendly.",
    },
    applyUrl: "https://www.monshaat.gov.sa",
  },
  {
    id: "riyadbank",
    name: { ar: "بنك الرياض — تمويل الأعمال", en: "Riyad Bank — Business Financing" },
    maxAmount: 1000000,
    terms: {
      ar: "تمويل مرن للمشاريع التجارية، يشترط سجل تجاري نشط وحساب بنكي.",
      en: "Flexible business financing; requires active CR and bank account.",
    },
    applyUrl: "https://www.riyadbank.com",
  },
  {
    id: "tamweel",
    name: { ar: "تمويل الوطنية", en: "Tamweel National Finance" },
    maxAmount: 200000,
    terms: {
      ar: "دفعات شهرية ميسّرة، موافقة خلال ٤٨ ساعة، بدون كفيل للمبالغ الصغيرة.",
      en: "Easy monthly installments, 48-hour approval, no guarantor for small amounts.",
    },
    applyUrl: "#",
  },
];

async function fetchProviders(): Promise<FinancingProvider[]> {
  // TODO: replace with Supabase/Firebase call. e.g.
  // const { data } = await supabase.from("financing_providers").select("*");
  return PROVIDERS;
}

function formatSAR(n: number, lang: "ar" | "en"): string {
  const s = n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
  return lang === "ar" ? `${s} ر.س` : `SAR ${s}`;
}

function FundingPage() {
  const { lang, tr } = useLang();
  const { activity: urlActivity } = Route.useSearch();

  // Resolve activity: URL param > stored selection > first activity fallback.
  const [activityId, setActivityId] = useState<string | null>(
    urlActivity ?? null,
  );
  useEffect(() => {
    if (urlActivity) {
      setActivityId(urlActivity);
      store.setSelectedActivity(urlActivity);
      return;
    }
    const stored = store.getSelectedActivity();
    setActivityId(stored ?? ACTIVITIES[0]?.id ?? null);
  }, [urlActivity]);

  const currentActivity = ACTIVITIES.find((a) => a.id === activityId);
  const licenses = useMemo(
    () => (activityId ? getLicensesFor(activityId) : []),
    [activityId],
  );
  const totalCost = useMemo(() => estimateTotal(licenses), [licenses]);

  const [budget, setBudget] = useState<string>("");
  const [analysis, setAnalysis] = useState<null | {
    sufficient: boolean;
    gap: number;
    providers: FinancingProvider[];
  }>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    const b = parseFloat(budget || "0");
    setLoading(true);
    const providers = await fetchProviders();
    const sufficient = b >= totalCost;
    const gap = Math.max(0, totalCost - b);
    const eligible = sufficient
      ? []
      : providers
          .filter((p) => p.maxAmount >= gap)
          .sort((a, b) => a.maxAmount - b.maxAmount);
    setAnalysis({ sufficient, gap, providers: eligible });
    setLoading(false);
  };

  return (
    <AppShell>
      <section className="max-w-3xl mx-auto px-5 md:px-6 py-10 md:py-14 space-y-6">
        {/* Header */}
        <header className="text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <Wallet className="w-3.5 h-3.5" />
            {tr("خطط ميزانيتك بذكاء", "Plan your budget smartly")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            {tr("التمويل", "Funding")}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            {tr(
              "اعرف تكلفة التراخيص، وقارنها بميزانيتك، واحصل على أفضل خيارات التمويل.",
              "Know your licensing costs, compare with your budget, and find the best financing options.",
            )}
          </p>
        </header>

        {/* Section 2: License cost summary */}
        <div className="rounded-3xl border border-border bg-card shadow-soft p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold tracking-wide text-foreground">
              {tr("ملخص تكلفة التراخيص", "License Cost Summary")}
            </h2>
          </div>

          {currentActivity ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <SummaryCell
                label={tr("النشاط المختار", "Selected activity")}
                value={
                  <span className="inline-flex items-center gap-2">
                    <span className="text-lg">{currentActivity.emoji}</span>
                    <span>{localize(lang, currentActivity.name)}</span>
                  </span>
                }
              />
              <SummaryCell
                label={tr("إجمالي تكلفة التراخيص", "Total licensing cost")}
                value={
                  <span className="text-primary">
                    {formatSAR(totalCost, lang)}
                  </span>
                }
                emphasize
              />
              <SummaryCell
                label={tr("عدد التراخيص", "Number of licenses")}
                value={
                  <span>
                    {lang === "ar"
                      ? licenses.length.toLocaleString("ar-SA")
                      : licenses.length}
                  </span>
                }
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {tr("جاري تحميل النشاط…", "Loading activity…")}
            </p>
          )}
        </div>

        {/* Section 3: Budget input */}
        <div className="rounded-3xl border border-border bg-card shadow-soft p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold tracking-wide text-foreground">
              {tr("محلّل الميزانية", "Budget Analyzer")}
            </h2>
          </div>

          <label
            htmlFor="budget"
            className="block text-xs font-semibold text-muted-foreground mb-1.5"
          >
            {tr("ميزانيتك الحالية (ر.س)", "Your current budget (SAR)")}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="budget"
              type="number"
              inputMode="numeric"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={tr("مثال: 50000", "e.g. 50000")}
              className="flex-1 h-12 rounded-xl border border-border bg-background px-4 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <Button
              onClick={analyze}
              disabled={loading || !budget || totalCost === 0}
              className="h-12 px-6 rounded-xl text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4 me-1.5" />
              {tr("تحليل الميزانية", "Analyze budget")}
            </Button>
          </div>
        </div>

        {/* Section 4: Analysis result */}
        {analysis && (
          <div>
            {analysis.sufficient ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 md:p-6 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-900">
                    {tr(
                      "ميزانيتك الحالية كافية لإكمال إجراءات الترخيص.",
                      "Your current budget is sufficient to complete the licensing process.",
                    )}
                  </div>
                  <Link
                    to="/licenses"
                    search={activityId ? { activity: activityId } : undefined}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline"
                  >
                    {tr("اذهب إلى التراخيص", "Go to licenses")}
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 md:p-6 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-900">
                    {tr(
                      `تحتاج إلى تمويل بقيمة ${formatSAR(analysis.gap, lang)}.`,
                      `You need additional funding of ${formatSAR(analysis.gap, lang)}.`,
                    )}
                  </div>
                  <div className="mt-1 text-sm text-amber-800/80">
                    {tr(
                      "استعرض جهات التمويل المقترحة أدناه.",
                      "Review the recommended financing providers below.",
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 5: Providers (only when funding needed) */}
        {analysis && !analysis.sufficient && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Landmark className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold tracking-wide text-foreground">
                {tr(
                  "جهات التمويل الموصى بها",
                  "Recommended financing providers",
                )}
              </h2>
            </div>

            {analysis.providers.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-5 text-sm text-muted-foreground">
                {tr(
                  "لا توجد جهات تغطي هذا المبلغ حاليًا. جرّب تعديل ميزانيتك.",
                  "No providers cover this amount right now. Try adjusting your budget.",
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {analysis.providers.map((p) => (
                  <ProviderCard key={p.id} provider={p} lang={lang} tr={tr} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function SummaryCell({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: React.ReactNode;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">
        {label}
      </div>
      <div
        className={`font-extrabold ${
          emphasize ? "text-xl md:text-2xl" : "text-base md:text-lg"
        } text-foreground leading-tight`}
      >
        {value}
      </div>
    </div>
  );
}

function ProviderCard({
  provider,
  lang,
  tr,
}: {
  provider: FinancingProvider;
  lang: "ar" | "en";
  tr: (ar: string, en: string) => string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card shadow-soft p-5 flex flex-col">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-base leading-tight">
            {tr(provider.name.ar, provider.name.en)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {tr("جهة تمويل معتمدة", "Accredited financing provider")}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-background/60 border border-border px-4 py-3">
        <div className="text-[11px] font-semibold text-muted-foreground">
          {tr("الحد الأعلى للتمويل", "Maximum financing")}
        </div>
        <div className="text-lg font-extrabold text-foreground">
          {formatSAR(provider.maxAmount, lang)}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-[11px] font-semibold text-muted-foreground mb-1">
          {tr("أهم الشروط", "Key terms")}
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {tr(provider.terms.ar, provider.terms.en)}
        </p>
      </div>

      <a
        href={provider.applyUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 hover:shadow-soft transition"
      >
        {tr("التقديم الآن", "Apply now")}
        <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
  );
}
