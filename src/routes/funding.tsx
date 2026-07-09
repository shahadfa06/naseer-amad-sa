import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/naseer/AppShell";
import { ACTIVITIES, getLicensesFor, type License } from "@/lib/naseer-data";
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

// ---- Parsing helpers (Arabic-Indic digits + ranges) ----
const AR_DIGITS: Record<string, string> = {
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
};

function normalizeDigits(s: string): string {
  return s.replace(/[٠-٩]/g, (d) => AR_DIGITS[d] ?? d).replace(/[٬،,]/g, "");
}

/** Extract numeric max value from strings like "٨٠٠ – ٢٬٥٠٠ ر.س", "١٬٢٠٠ ر.س / سنة", "مجاناً". */
function parseCost(cost: string): number {
  const norm = normalizeDigits(cost);
  const nums = norm.match(/\d+(?:\.\d+)?/g);
  if (!nums || nums.length === 0) return 0;
  const values = nums.map((n) => parseFloat(n));
  return Math.max(...values);
}

function estimateTotal(licenses: License[]): number {
  return licenses.reduce((sum, l) => sum + parseCost(l.cost), 0);
}

// ---- Financing providers (placeholder; swap to Supabase/Firebase later) ----
export type FinancingProvider = {
  id: string;
  name: { ar: string; en: string };
  maxAmount: number;
  terms: { ar: string; en: string };
  applyUrl: string;
};

const PROVIDERS: FinancingProvider[] = [
  {
    id: "monshaat",
    name: { ar: "بنك التنمية الاجتماعية — كفالة", en: "SDB — Kafalah" },
    maxAmount: 500000,
    terms: {
      ar: "تمويل للمنشآت الصغيرة والمتوسطة بضمان جزئي، فترة سداد حتى ٦٠ شهر.",
      en: "SME financing with partial guarantee, repayment up to 60 months.",
    },
    applyUrl: "https://www.sdb.gov.sa",
  },
  {
    id: "monsha",
    name: { ar: "منشآت — برنامج التمويل غير المباشر", en: "Monsha'at — Indirect Lending" },
    maxAmount: 300000,
    terms: {
      ar: "تمويل عبر جهات تمويلية معتمدة، دون رسوم إدارية، مناسب للشركات الناشئة.",
      en: "Financing via accredited lenders, no admin fees, startup-friendly.",
    },
    applyUrl: "https://www.monshaat.gov.sa",
  },
  {
    id: "riyadbank",
    name: { ar: "بنك الرياض — تمويل الأعمال", en: "Riyad Bank — Business Financing" },
    maxAmount: 1000000,
    terms: {
      ar: "تمويل مرن للمشاريع التجارية، متطلبات سجل تجاري نشط وحساب بنكي.",
      en: "Flexible business financing; requires active CR and bank account.",
    },
    applyUrl: "https://www.riyadbank.com",
  },
  {
    id: "tamweel",
    name: { ar: "تمويل — شركة التمويل الوطنية", en: "Tamweel National Finance" },
    maxAmount: 200000,
    terms: {
      ar: "دفعات شهرية ميسّرة، موافقة خلال ٤٨ ساعة، بدون كفيل للمبالغ الصغيرة.",
      en: "Easy monthly installments, 48-hour approval, no guarantor for small amounts.",
    },
    applyUrl: "#",
  },
];

async function fetchProviders(): Promise<FinancingProvider[]> {
  // TODO: replace with Supabase/Firebase call.
  // e.g. const { data } = await supabase.from("financing_providers").select("*");
  return PROVIDERS;
}

function formatSAR(n: number, lang: "ar" | "en"): string {
  const s = n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
  return lang === "ar" ? `${s} ر.س` : `SAR ${s}`;
}

function FundingPage() {
  const { lang, tr } = useLang();
  const { activity } = Route.useSearch();

  const licenses = useMemo(
    () => (activity ? getLicensesFor(activity) : []),
    [activity],
  );
  const currentActivity = ACTIVITIES.find((a) => a.id === activity);
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
    const sufficient = b >= totalCost && totalCost > 0;
    const gap = Math.max(0, totalCost - b);
    const eligible = sufficient
      ? []
      : providers
          .filter((p) => p.maxAmount >= Math.max(gap, 1))
          .sort((a, b) => a.maxAmount - b.maxAmount);
    setAnalysis({ sufficient, gap, providers: eligible });
    setLoading(false);
  };

  return (
    <AppShell>
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <Wallet className="w-3.5 h-3.5" />
            {tr("خطط ميزانيتك بذكاء", "Plan your budget smartly")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            {tr("التمويل", "Funding")}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            {tr(
              "اعرف تكلفة التراخيص، وقارنها بميزانيتك، واحصل على أفضل خيارات التمويل.",
              "Know your licensing costs, compare with your budget, and find the best financing options.",
            )}
          </p>
        </div>

        {/* Budget analysis card */}
        <div className="rounded-3xl border border-border bg-card shadow-soft p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg">
                {tr("محلّل الميزانية", "Budget Analyzer")}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentActivity
                  ? tr(
                      `بناءً على نشاط: ${currentActivity.name}`,
                      `Based on activity: ${localize(lang, currentActivity.name)}`,
                    )
                  : tr(
                      "لم يتم تحديد نشاط — اختر نشاطك لحساب دقيق.",
                      "No activity selected — pick one for a precise estimate.",
                    )}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background/60 p-5">
              <div className="text-xs font-semibold text-muted-foreground mb-1.5">
                {tr("إجمالي تكلفة التراخيص", "Total licensing cost")}
              </div>
              <div className="text-3xl font-extrabold text-foreground">
                {totalCost > 0
                  ? formatSAR(totalCost, lang)
                  : tr("— اختر نشاطك —", "— pick an activity —")}
              </div>
              {!currentActivity && (
                <Link
                  to="/activities"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  {tr("تصفّح الأنشطة", "Browse activities")}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-background/60 p-5">
              <label
                htmlFor="budget"
                className="block text-xs font-semibold text-muted-foreground mb-1.5"
              >
                {tr("ميزانيتك الحالية (ر.س)", "Your current budget (SAR)")}
              </label>
              <input
                id="budget"
                type="number"
                inputMode="numeric"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder={tr("مثال: 50000", "e.g. 50000")}
                className="w-full h-12 rounded-xl border border-border bg-background px-4 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={analyze}
              disabled={loading || !budget || totalCost === 0}
              className="h-12 px-6 rounded-full text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4 me-1.5" />
              {tr("تحليل الميزانية", "Analyze budget")}
            </Button>
          </div>
        </div>

        {/* Analysis result */}
        {analysis && (
          <div className="mt-8">
            {analysis.sufficient ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-900">
                    {tr(
                      "ميزانيتك كافية لإكمال إجراءات الترخيص.",
                      "Your budget is sufficient to complete the licensing process.",
                    )}
                  </div>
                  <p className="mt-1 text-sm text-emerald-800/80">
                    {tr(
                      "تقدر تبدأ فورًا بتقديم طلبات التراخيص من صفحة التراخيص.",
                      "You can start submitting your license applications right away.",
                    )}
                  </p>
                  <Link
                    to="/licenses"
                    search={activity ? { activity } : undefined}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline"
                  >
                    {tr("اذهب إلى التراخيص", "Go to licenses")}
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 flex items-start gap-4 mb-6">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-900">
                      {tr(
                        "ميزانيتك غير كافية — نرشّح لك خيارات تمويل مناسبة.",
                        "Your budget is insufficient — here are recommended financing options.",
                      )}
                    </div>
                    <p className="mt-1 text-sm text-amber-800/80">
                      {tr(
                        `الفرق المطلوب: ${formatSAR(analysis.gap, lang)}`,
                        `Amount needed: ${formatSAR(analysis.gap, lang)}`,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Landmark className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-lg">
                    {tr("جهات التمويل الموصى بها", "Recommended financing providers")}
                  </h2>
                </div>

                {analysis.providers.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                    {tr(
                      "لا توجد جهات تغطي هذا المبلغ حاليًا. جرّب تعديل ميزانيتك.",
                      "No providers cover this amount right now. Try adjusting your budget.",
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {analysis.providers.map((p) => (
                      <ProviderCard key={p.id} provider={p} lang={lang} tr={tr} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </AppShell>
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
            {localize(lang, provider.name)}
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

      <p className="mt-3 text-sm text-foreground/80 leading-relaxed flex-1">
        {localize(lang, provider.terms)}
      </p>

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
