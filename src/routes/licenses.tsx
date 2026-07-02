import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/naseer/AppShell";
import { ACTIVITIES, getLicensesFor, store, type License } from "@/lib/naseer-data";
import {
  Clock,
  Coins,
  ExternalLink,
  FileText,
  Landmark,
  Sparkles,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  FileCheck2,
  ClipboardList,
  BadgeCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  BrainCircuit,
  Upload,
  Send,
  XCircle,
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

// -------- Enriched (mock-synced) license metadata --------
// In production this comes from a backend sync service that compares the
// internal KB with the official government source and stores verified deltas.

type LicenseMeta = {
  description: string;
  descriptionEn: string;
  requirements: string[];
  requirementsEn: string[];
  documents: string[];
  documentsEn: string[];
  eligibility: string[];
  eligibilityEn: string[];
  lastSyncedAt: string;
  lastOfficialUpdate: string;
  sourceUrl: string;
  verified: boolean;
  stale?: boolean;
};

const META: Record<string, LicenseMeta> = {
  cr: {
    description: "السجل التجاري وثيقة رسمية تُثبت مزاولة النشاط التجاري وفق نظام السجل التجاري.",
    descriptionEn: "Official document proving commercial activity per the Commercial Registration Law.",
    requirements: ["أن يكون المتقدم سعودي أو مقيم نظامي", "لا يوجد سجل تجاري مماثل لنفس النشاط"],
    requirementsEn: ["Saudi citizen or legal resident", "No duplicate CR for same activity"],
    documents: ["الهوية الوطنية / الإقامة", "تحديد الاسم التجاري", "عنوان وطني"],
    documentsEn: ["National ID / Iqama", "Trade name", "National address"],
    eligibility: ["العمر ١٨ سنة فأعلى", "الأهلية القانونية الكاملة"],
    eligibilityEn: ["Age 18+", "Full legal capacity"],
    lastSyncedAt: "٢٠٢٦/٠٦/٢٨ ٠٩:١٢",
    lastOfficialUpdate: "٢٠٢٦/٠٥/١٤",
    sourceUrl: "https://mc.gov.sa",
    verified: true,
  },
  municipal: {
    description: "رخصة تصدرها البلدية لممارسة النشاط في موقع محدد وفق اشتراطات السلامة والصحة.",
    descriptionEn: "Municipal license to operate at a specific location per safety and health rules.",
    requirements: ["سجل تجاري ساري", "عقد إيجار موثق (إيجار)", "مخطط الموقع"],
    requirementsEn: ["Valid CR", "Ejar-verified lease", "Site plan"],
    documents: ["السجل التجاري", "عقد إيجار", "شهادة الدفاع المدني"],
    documentsEn: ["Commercial Registration", "Lease contract", "Civil Defense certificate"],
    eligibility: ["موقع مطابق لاشتراطات البلدية"],
    eligibilityEn: ["Location compliant with municipal code"],
    lastSyncedAt: "٢٠٢٦/٠٦/٢٩ ١٤:٠٠",
    lastOfficialUpdate: "٢٠٢٦/٠٣/١٨",
    sourceUrl: "https://balady.gov.sa",
    verified: true,
  },
  chamber: {
    description: "عضوية الغرفة التجارية تتيح لك خدمات التصديق والدعم التجاري.",
    descriptionEn: "Chamber membership unlocks attestation and trade support services.",
    requirements: ["سجل تجاري ساري"],
    requirementsEn: ["Valid CR"],
    documents: ["السجل التجاري", "الهوية الوطنية"],
    documentsEn: ["Commercial Registration", "National ID"],
    eligibility: ["منشأة مسجلة"],
    eligibilityEn: ["Registered establishment"],
    lastSyncedAt: "٢٠٢٦/٠٦/٣٠ ٠٨:٤٥",
    lastOfficialUpdate: "٢٠٢٥/١١/٠١",
    sourceUrl: "https://fsc.org.sa",
    verified: true,
  },
  health: {
    description: "شهادة صحية إلزامية لجميع العاملين في القطاع الغذائي.",
    descriptionEn: "Mandatory health certificate for all food-sector workers.",
    requirements: ["فحص طبي معتمد", "دورة السلامة الغذائية"],
    requirementsEn: ["Approved medical exam", "Food safety course"],
    documents: ["الهوية / الإقامة", "نتيجة الفحص الطبي"],
    documentsEn: ["ID / Iqama", "Medical exam result"],
    eligibility: ["كل عامل على تماس مباشر بالغذاء"],
    eligibilityEn: ["Any worker in direct food contact"],
    lastSyncedAt: "٢٠٢٦/٠٦/٢٧ ١٦:٣٠",
    lastOfficialUpdate: "٢٠٢٦/٠٢/١٠",
    sourceUrl: "https://moh.gov.sa",
    verified: true,
  },
  food: {
    description: "ترخيص السلامة الغذائية من هيئة الغذاء والدواء للمنشآت الغذائية.",
    descriptionEn: "SFDA food safety license for food establishments.",
    requirements: ["مطابقة اشتراطات SFDA", "مسؤول سلامة غذائية"],
    requirementsEn: ["SFDA compliance", "Food safety officer"],
    documents: ["السجل التجاري", "رخصة البلدية", "شهادة السلامة"],
    documentsEn: ["Commercial Registration", "Municipal license", "Safety certificate"],
    eligibility: ["منشأة غذائية مرخصة بلدياً"],
    eligibilityEn: ["Municipally-licensed food establishment"],
    lastSyncedAt: "٢٠٢٦/٠٦/٢٨ ١١:٠٠",
    lastOfficialUpdate: "٢٠٢٦/٠٤/٠٢",
    sourceUrl: "https://sfda.gov.sa",
    verified: true,
  },
  civil: {
    description: "موافقة الدفاع المدني على اشتراطات السلامة من الحريق للمنشأة.",
    descriptionEn: "Civil Defense approval on fire-safety requirements for the site.",
    requirements: ["نظام إنذار وإطفاء", "مخارج طوارئ"],
    requirementsEn: ["Fire alarm & suppression", "Emergency exits"],
    documents: ["مخطط السلامة", "عقد الصيانة"],
    documentsEn: ["Safety layout", "Maintenance contract"],
    eligibility: ["منشأة مطابقة لكود السلامة"],
    eligibilityEn: ["Site compliant with safety code"],
    lastSyncedAt: "٢٠٢٦/٠٦/٢٥ ١٠:٢٠",
    lastOfficialUpdate: "٢٠٢٥/١٢/١٥",
    sourceUrl: "https://998.gov.sa",
    verified: true,
    stale: true,
  },
  profession: {
    description: "ترخيص لمزاولة المهنة داخل المنشأة.",
    descriptionEn: "Professional practice license inside the establishment.",
    requirements: ["مؤهل أو شهادة خبرة", "فحص طبي"],
    requirementsEn: ["Qualification or experience", "Medical exam"],
    documents: ["السجل التجاري", "الشهادات المهنية"],
    documentsEn: ["Commercial Registration", "Professional certificates"],
    eligibility: ["مؤهل معتمد"],
    eligibilityEn: ["Accredited qualification"],
    lastSyncedAt: "٢٠٢٦/٠٦/٢٦ ٠٩:٠٠",
    lastOfficialUpdate: "٢٠٢٦/٠١/٢٠",
    sourceUrl: "https://balady.gov.sa",
    verified: true,
  },
  pharma: {
    description: "ترخيص إنشاء وتشغيل صيدلية من وزارة الصحة.",
    descriptionEn: "MoH license to establish and operate a pharmacy.",
    requirements: ["صيدلي مرخص", "موقع مطابق"],
    requirementsEn: ["Licensed pharmacist", "Compliant location"],
    documents: ["ترخيص الصيدلي", "السجل التجاري", "مخطط الموقع"],
    documentsEn: ["Pharmacist license", "Commercial Registration", "Site plan"],
    eligibility: ["صيدلي حاصل على الترخيص"],
    eligibilityEn: ["Certified pharmacist"],
    lastSyncedAt: "٢٠٢٦/٠٦/٢٩ ١٣:٤٥",
    lastOfficialUpdate: "٢٠٢٦/٠٣/٠١",
    sourceUrl: "https://moh.gov.sa",
    verified: true,
  },
  maroof: {
    description: "توثيق النشاط التجاري في منصة معروف لتعزيز ثقة العملاء.",
    descriptionEn: "Verify your business on Maroof to build customer trust.",
    requirements: ["سجل تجاري ساري"],
    requirementsEn: ["Valid CR"],
    documents: ["السجل التجاري"],
    documentsEn: ["Commercial Registration"],
    eligibility: ["منشأة مسجلة"],
    eligibilityEn: ["Registered establishment"],
    lastSyncedAt: "٢٠٢٦/٠٦/٣٠ ٠٧:٠٠",
    lastOfficialUpdate: "٢٠٢٦/٠٢/٢٥",
    sourceUrl: "https://maroof.sa",
    verified: true,
  },
};

const DEFAULT_META: LicenseMeta = {
  description: "خدمة حكومية رسمية.",
  descriptionEn: "Official government service.",
  requirements: ["سجل تجاري ساري"],
  requirementsEn: ["Valid CR"],
  documents: ["الهوية الوطنية"],
  documentsEn: ["National ID"],
  eligibility: ["أهلية قانونية"],
  eligibilityEn: ["Legal capacity"],
  lastSyncedAt: "٢٠٢٦/٠٦/٣٠",
  lastOfficialUpdate: "—",
  sourceUrl: "https://my.gov.sa",
  verified: true,
};

function LicensesPage() {
  const { lang, tr } = useLang();
  const { activity } = Route.useSearch();
  const list = useMemo(() => (activity ? getLicensesFor(activity) : []), [activity]);
  const current = ACTIVITIES.find((a) => a.id === activity);
  const [active, setActive] = useState<License | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const startJourney = (l: License) => {
    setActive(l);
    setSubmittedId(null);
  };

  const finishJourney = () => {
    if (!active) return;
    const app = store.addApplication(active);
    setSubmittedId(app.id);
  };

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
                    onClick={() => startJourney(l)}
                    className="rounded-full"
                    style={{ background: "var(--saudi-deep)" }}
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    {tr("ابدأ الرحلة", "Start Journey")}
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

      {active && (
        <JourneyWizard
          license={active}
          meta={META[active.id] ?? DEFAULT_META}
          onClose={() => setActive(null)}
          onSubmit={finishJourney}
          submittedId={submittedId}
        />
      )}
    </AppShell>
  );
}

function VerifyBadge({ meta }: { meta: LicenseMeta }) {
  const { tr } = useLang();
  if (meta.stale) {
    return (
      <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
        <AlertTriangle className="w-3 h-3" />
        {tr("قد تكون قديمة", "May be outdated")}
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
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
        <div className="flex items-start gap-1.5 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 mt-1">
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

// ============ Journey Wizard ============

type StepKey = "overview" | "requirements" | "documents" | "readiness" | "recommend" | "submit";

const STEPS: { key: StepKey; ar: string; en: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview", ar: "نظرة عامة", en: "Overview", icon: FileText },
  { key: "requirements", ar: "المتطلبات", en: "Requirements", icon: ClipboardList },
  { key: "documents", ar: "المستندات", en: "Documents", icon: FileCheck2 },
  { key: "readiness", ar: "جاهزية الطلب", en: "Readiness", icon: BrainCircuit },
  { key: "recommend", ar: "توصيات المساعد", en: "AI Recommendations", icon: Sparkles },
  { key: "submit", ar: "التقديم الرسمي", en: "Official Submission", icon: Send },
];

function JourneyWizard({
  license,
  meta,
  onClose,
  onSubmit,
  submittedId,
}: {
  license: License;
  meta: LicenseMeta;
  onClose: () => void;
  onSubmit: () => void;
  submittedId: string | null;
}) {
  const { lang, tr, dir } = useLang();
  const [stepIdx, setStepIdx] = useState(0);
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});

  const docs = lang === "ar" ? meta.documents : meta.documentsEn;
  const reqs = lang === "ar" ? meta.requirements : meta.requirementsEn;
  const elig = lang === "ar" ? meta.eligibility : meta.eligibilityEn;
  const desc = lang === "ar" ? meta.description : meta.descriptionEn;

  const uploadedCount = docs.filter((d) => uploaded[d]).length;
  const readiness = docs.length ? Math.round((uploadedCount / docs.length) * 100) : 0;
  const missing = docs.filter((d) => !uploaded[d]);

  const step = STEPS[stepIdx];
  const canNext = stepIdx < STEPS.length - 1;
  const canPrev = stepIdx > 0;
  const Next = dir === "rtl" ? ArrowLeft : ArrowRight;
  const Prev = dir === "rtl" ? ArrowRight : ArrowLeft;

  const toggleDoc = (d: string) => setUploaded((u) => ({ ...u, [d]: !u[d] }));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="relative p-7 md:p-9 text-white overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--saudi-ink) 0%, var(--saudi-deep) 60%, var(--saudi) 100%)",
          }}
        >
          <div className="absolute inset-0 pattern-bg opacity-[0.12]" aria-hidden />
          <button
            onClick={onClose}
            className="absolute top-4 end-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition"
            aria-label="close"
          >
            <XCircle className="w-5 h-5" />
          </button>
          <div className="relative">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold bg-white/15 backdrop-blur px-3 py-1 rounded-full mb-3">
              <Rocket className="w-3.5 h-3.5" />
              {tr("رحلة إصدار الترخيص", "License Issuance Journey")}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">{localize(lang, license.name)}</h2>
            <p className="text-white/80 text-sm mt-1">{localize(lang, license.authority)}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="px-6 md:px-9 pt-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {STEPS.map((s, i) => {
              const done = i < stepIdx;
              const activeStep = i === stepIdx;
              const Icon = s.icon;
              return (
                <div key={s.key} className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => i <= stepIdx && setStepIdx(i)}
                    disabled={i > stepIdx}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition ${
                      activeStep
                        ? "text-white shadow-soft"
                        : done
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-muted text-muted-foreground"
                    }`}
                    style={activeStep ? { background: "var(--saudi-deep)" } : {}}
                  >
                    {done ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : i > stepIdx ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                    <span>{tr(s.ar, s.en)}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`h-px w-6 ${done ? "bg-emerald-400" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 md:px-9 pb-6 min-h-[280px]">
          {step.key === "overview" && (
            <div className="space-y-4 animate-fade-in">
              <SectionTitle icon={FileText} title={tr("وصف الخدمة الرسمي", "Official service description")} />
              <p className="text-sm leading-loose text-foreground/90 bg-background rounded-2xl border border-border p-4">
                {desc}
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                <Stat icon={Coins} label={tr("الرسوم", "Fees")} value={localize(lang, license.cost)} />
                <Stat icon={Clock} label={tr("المدة", "Duration")} value={localize(lang, license.duration)} />
                <Stat icon={Landmark} label={tr("الجهة", "Authority")} value={localize(lang, license.authority)} />
              </div>
              <SyncStrip meta={meta} />
            </div>
          )}

          {step.key === "requirements" && (
            <div className="space-y-4 animate-fade-in">
              <SectionTitle icon={ClipboardList} title={tr("المتطلبات الرسمية", "Official requirements")} />
              <ul className="grid sm:grid-cols-2 gap-2">
                {reqs.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-2 text-sm bg-background border border-border rounded-xl p-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <SectionTitle icon={ShieldCheck} title={tr("شروط الأهلية", "Eligibility conditions")} />
              <ul className="grid sm:grid-cols-2 gap-2">
                {elig.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-2 text-sm bg-background border border-border rounded-xl p-3"
                  >
                    <BadgeCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.key === "documents" && (
            <div className="space-y-3 animate-fade-in">
              <SectionTitle icon={FileCheck2} title={tr("المستندات المطلوبة", "Required documents")} />
              <p className="text-xs text-muted-foreground">
                {tr(
                  "علّم على كل مستند رفعته لتحديث نسبة جاهزيتك.",
                  "Check off each document you've uploaded to update your readiness.",
                )}
              </p>
              <ul className="space-y-2">
                {docs.map((d) => {
                  const on = !!uploaded[d];
                  return (
                    <li
                      key={d}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition ${
                        on ? "border-emerald-300 bg-emerald-50/60" : "border-border bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        {on ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className={on ? "font-semibold" : ""}>{d}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={on ? "outline" : "default"}
                        onClick={() => toggleDoc(d)}
                        className="rounded-full h-8"
                        style={on ? {} : { background: "var(--saudi-deep)" }}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {on ? tr("مرفوع", "Uploaded") : tr("رفع", "Upload")}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {step.key === "readiness" && (
            <div className="space-y-4 animate-fade-in">
              <SectionTitle icon={BrainCircuit} title={tr("مؤشر جاهزية الطلب", "AI Readiness Score")} />
              <div className="flex flex-col md:flex-row items-center gap-6 bg-background border border-border rounded-2xl p-6">
                <ReadinessRing value={readiness} />
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {tr("المستندات المرفوعة", "Uploaded documents")}
                    </span>
                    <span className="font-bold">
                      {uploadedCount} / {docs.length}
                    </span>
                  </div>
                  {missing.length > 0 ? (
                    <div>
                      <div className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" />
                        {tr("المتطلبات الناقصة", "Missing requirements")}
                      </div>
                      <ul className="space-y-1 text-sm">
                        {missing.map((m) => (
                          <li key={m} className="text-red-700/90">✖ {m}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-sm text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {tr("مكتمل — جاهز للتقديم", "Complete — ready to submit")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step.key === "recommend" && (
            <div className="space-y-3 animate-fade-in">
              <SectionTitle icon={Sparkles} title={tr("توصيات المساعد الذكي", "AI Recommendations")} />
              <Recommendation
                tone="ai"
                text={
                  missing.length > 0
                    ? tr(
                        `ابدأ برفع "${missing[0]}" لرفع نسبة الجاهزية بشكل ملحوظ.`,
                        `Upload "${missing[0]}" first to boost your readiness significantly.`,
                      )
                    : tr(
                        "طلبك مكتمل — قدّمه مباشرة لتوفير الوقت.",
                        "Your application is complete — submit now to save time.",
                      )
                }
              />
              <Recommendation
                tone="warn"
                text={tr(
                  "أغلب المتقدمين لنشاطك ينسون رفع شهادة السلامة — راجعها قبل التقديم.",
                  "Most applicants for your activity forget the Safety Certificate — double-check before submitting.",
                )}
              />
              <Recommendation
                tone="ok"
                text={tr(
                  "المستندات المُنشأة من نسير جاهزة تلقائياً بصيغة مقبولة رسمياً.",
                  "Naseer-generated documents are ready in officially-accepted format.",
                )}
              />

              <SectionTitle
                icon={FileCheck2}
                title={tr("المستندات المُنشأة تلقائياً", "Generated documents")}
              />
              <ul className="grid sm:grid-cols-2 gap-2">
                {[
                  tr("خطاب التقديم الرسمي", "Official cover letter"),
                  tr("ملخص المتطلبات", "Requirements summary"),
                  tr("نموذج البيانات الأولية", "Preliminary data form"),
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 text-sm bg-background border border-border rounded-xl p-3"
                  >
                    <FileCheck2 className="w-4 h-4 text-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.key === "submit" && (
            <div className="space-y-4 animate-fade-in">
              <SectionTitle icon={Send} title={tr("التقديم الرسمي", "Official submission")} />
              <div className="bg-background border border-border rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{tr("الجهة المستلمة", "Receiving authority")}</span>
                  <span className="font-semibold">{localize(lang, license.authority)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{tr("نسبة الجاهزية", "Readiness")}</span>
                  <span className="font-bold text-primary">{readiness}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{tr("الرسوم", "Fees")}</span>
                  <span className="font-semibold">{localize(lang, license.cost)}</span>
                </div>
              </div>

              {submittedId ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
                  <div className="flex items-center gap-2 font-bold mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {tr("تم إرسال طلبك بنجاح", "Application submitted successfully")}
                  </div>
                  <div className="text-sm">
                    {tr("رقم الطلب:", "Application ID:")}{" "}
                    <span className="font-mono font-bold">{submittedId}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link to="/applications">{tr("متابعة الطلبات", "Track applications")}</Link>
                    </Button>
                    <Button size="sm" onClick={onClose} className="rounded-full" style={{ background: "var(--saudi-deep)" }}>
                      {tr("إغلاق", "Close")}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={onSubmit}
                  className="w-full rounded-full h-12"
                  style={{ background: "var(--saudi-deep)" }}
                  disabled={readiness < 50}
                >
                  <Send className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                  {tr("إرسال الطلب رسمياً", "Submit officially")}
                </Button>
              )}
              {readiness < 50 && !submittedId && (
                <p className="text-xs text-amber-700 flex items-center gap-1.5 justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {tr(
                    "ارفع مزيد من المستندات لتصل إلى ٥٠٪ على الأقل قبل التقديم.",
                    "Upload more documents to reach at least 50% before submitting.",
                  )}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="px-6 md:px-9 py-4 border-t border-border bg-background/50 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => canPrev && setStepIdx((s) => s - 1)}
            disabled={!canPrev}
          >
            <Prev className="w-3.5 h-3.5" />
            {tr("السابق", "Back")}
          </Button>
          <div className="text-xs text-muted-foreground">
            {stepIdx + 1} / {STEPS.length}
          </div>
          <Button
            size="sm"
            className="rounded-full"
            style={{ background: "var(--saudi-deep)" }}
            onClick={() => canNext && setStepIdx((s) => s + 1)}
            disabled={!canNext}
          >
            {tr("التالي", "Next")}
            <Next className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h4 className="font-display font-bold text-base">{title}</h4>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="font-bold text-sm" dir="auto">
        {value}
      </div>
    </div>
  );
}

function Recommendation({ tone, text }: { tone: "ai" | "warn" | "ok"; text: string }) {
  const styles =
    tone === "ai"
      ? "bg-blue-50 border-blue-200 text-blue-900"
      : tone === "warn"
        ? "bg-amber-50 border-amber-200 text-amber-900"
        : "bg-emerald-50 border-emerald-200 text-emerald-900";
  const emoji = tone === "ai" ? "💡" : tone === "warn" ? "⚠️" : "✅";
  return (
    <div className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${styles}`}>
      <span className="text-base leading-none">{emoji}</span>
      <span className="leading-relaxed">{text}</span>
    </div>
  );
}

function ReadinessRing({ value }: { value: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const color = value >= 80 ? "var(--saudi-deep)" : value >= 50 ? "#d97706" : "#dc2626";
  return (
    <div className="relative w-32 h-32 shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} stroke="hsl(var(--border))" strokeWidth="10" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={r}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-black" style={{ color }}>
          {value}%
        </div>
        <div className="text-[10px] font-bold text-muted-foreground">READINESS</div>
      </div>
    </div>
  );
}
