import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/naseer/AppShell";
import { getLicensesFor, store, type License } from "@/lib/naseer-data";
import { META, DEFAULT_META, type LicenseMeta } from "@/lib/licenses-meta";
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

const search = z.object({ activity: z.string() });

export const Route = createFileRoute("/journey/$licenseId")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "رحلة إصدار الترخيص | Journey · نسير" },
      { name: "description", content: "رحلة موجهة لإصدار الترخيص خطوة بخطوة." },
    ],
  }),
  component: JourneyPage,
});

type StepKey = "overview" | "requirements" | "documents" | "readiness" | "recommend" | "submit";

const STEPS: { key: StepKey; ar: string; en: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview", ar: "نظرة عامة", en: "Overview", icon: FileText },
  { key: "requirements", ar: "المتطلبات", en: "Requirements", icon: ClipboardList },
  { key: "documents", ar: "المستندات", en: "Documents", icon: FileCheck2 },
  { key: "readiness", ar: "جاهزية الطلب", en: "Readiness", icon: BrainCircuit },
  { key: "recommend", ar: "توصيات المساعد", en: "AI Recommendations", icon: Sparkles },
  { key: "submit", ar: "التقديم الرسمي", en: "Official Submission", icon: Send },
];

function JourneyPage() {
  const { lang, tr, dir } = useLang();
  const { licenseId } = Route.useParams();
  const { activity } = Route.useSearch();
  const navigate = useNavigate();

  const license = useMemo<License | undefined>(
    () => getLicensesFor(activity).find((l) => l.id === licenseId),
    [activity, licenseId],
  );

  const meta: LicenseMeta = META[licenseId] ?? DEFAULT_META;

  const [stepIdx, setStepIdx] = useState(0);
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  if (!license) {
    return (
      <AppShell>
        <section className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold mb-3">{tr("لم نجد هذا الترخيص", "License not found")}</h1>
          <Button asChild className="rounded-full" style={{ background: "var(--saudi-deep)" }}>
            <Link to="/licenses" search={{ activity }}>
              {tr("رجوع إلى التراخيص", "Back to licenses")}
            </Link>
          </Button>
        </section>
      </AppShell>
    );
  }

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

  const submit = () => {
    const app = store.addApplication(license);
    setSubmittedId(app.id);
  };

  return (
    <AppShell>
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-5">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={() => navigate({ to: "/licenses", search: { activity } })}
          >
            <Prev className="w-3.5 h-3.5" />
            {tr("رجوع إلى التراخيص", "Back to licenses")}
          </Button>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden text-white p-7 md:p-9 mb-6"
          style={{
            background:
              "linear-gradient(135deg, var(--saudi-ink) 0%, var(--saudi-deep) 60%, var(--saudi) 100%)",
          }}
        >
          <div className="absolute inset-0 pattern-bg opacity-[0.12]" aria-hidden />
          <div className="relative">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold bg-white/15 backdrop-blur px-3 py-1 rounded-full mb-3">
              <Rocket className="w-3.5 h-3.5" />
              {tr("رحلة إصدار الترخيص", "License Issuance Journey")}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{localize(lang, license.name)}</h1>
            <p className="text-white/80 text-sm mt-1">{localize(lang, license.authority)}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2">
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

        <div className="rounded-3xl bg-card border border-border shadow-soft p-6 md:p-8 min-h-[320px]">
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
                  <li key={r} className="flex items-start gap-2 text-sm bg-background border border-border rounded-xl p-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <SectionTitle icon={ShieldCheck} title={tr("شروط الأهلية", "Eligibility conditions")} />
              <ul className="grid sm:grid-cols-2 gap-2">
                {elig.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm bg-background border border-border rounded-xl p-3">
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
                {tr("علّم على كل مستند رفعته لتحديث نسبة جاهزيتك.", "Check off each document you've uploaded to update your readiness.")}
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
                        {on ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-muted-foreground" />}
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
                    <span className="text-muted-foreground">{tr("المستندات المرفوعة", "Uploaded documents")}</span>
                    <span className="font-bold">{uploadedCount} / {docs.length}</span>
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
                    ? tr(`ابدأ برفع "${missing[0]}" لرفع نسبة الجاهزية بشكل ملحوظ.`, `Upload "${missing[0]}" first to boost your readiness significantly.`)
                    : tr("طلبك مكتمل — قدّمه مباشرة لتوفير الوقت.", "Your application is complete — submit now to save time.")
                }
              />
              <Recommendation
                tone="warn"
                text={tr("أغلب المتقدمين لنشاطك ينسون رفع شهادة السلامة — راجعها قبل التقديم.", "Most applicants for your activity forget the Safety Certificate — double-check before submitting.")}
              />
              <Recommendation
                tone="ok"
                text={tr("المستندات المُنشأة من نسير جاهزة تلقائياً بصيغة مقبولة رسمياً.", "Naseer-generated documents are ready in officially-accepted format.")}
              />
              <SectionTitle icon={FileCheck2} title={tr("المستندات المُنشأة تلقائياً", "Generated documents")} />
              <ul className="grid sm:grid-cols-2 gap-2">
                {[
                  tr("خطاب التقديم الرسمي", "Official cover letter"),
                  tr("ملخص المتطلبات", "Requirements summary"),
                  tr("نموذج البيانات الأولية", "Preliminary data form"),
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm bg-background border border-border rounded-xl p-3">
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
                    <Button asChild size="sm" className="rounded-full" style={{ background: "var(--saudi-deep)" }}>
                      <Link to="/licenses" search={{ activity }}>{tr("رجوع للتراخيص", "Back to licenses")}</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={submit}
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
                  {tr("ارفع مزيد من المستندات لتصل إلى ٥٠٪ على الأقل قبل التقديم.", "Upload more documents to reach at least 50% before submitting.")}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => canPrev && setStepIdx((s) => s - 1)} disabled={!canPrev}>
            <Prev className="w-3.5 h-3.5" />
            {tr("السابق", "Back")}
          </Button>
          <div className="text-xs text-muted-foreground">{stepIdx + 1} / {STEPS.length}</div>
          <Button size="sm" className="rounded-full" style={{ background: "var(--saudi-deep)" }} onClick={() => canNext && setStepIdx((s) => s + 1)} disabled={!canNext}>
            {tr("التالي", "Next")}
            <Next className="w-3.5 h-3.5" />
          </Button>
        </div>
      </section>
    </AppShell>
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
        <a href={meta.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline truncate max-w-[55%]" dir="ltr">
          {meta.sourceUrl.replace(/^https?:\/\//, "")}
        </a>
      </div>
      {meta.stale && (
        <div className="flex items-start gap-1.5 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 mt-1">
          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
          <span className="leading-relaxed">
            {tr("لم تُحدَّث هذه البيانات منذ فترة — يرجى التحقق من الموقع الرسمي.", "Data hasn't been refreshed recently — please double-check the official site.")}
          </span>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h4 className="font-display font-bold text-base">{title}</h4>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="font-bold text-sm" dir="auto">{value}</div>
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
        <circle cx="60" cy="60" r={r} stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} className="transition-all duration-500" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-black" style={{ color }}>{value}%</div>
        <div className="text-[10px] font-bold text-muted-foreground">READINESS</div>
      </div>
    </div>
  );
}
