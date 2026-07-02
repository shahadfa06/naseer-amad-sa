import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/naseer/AppShell";
import { STATUS_META, store, type Application } from "@/lib/naseer-data";
import { Building2, Calendar, FileText, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localize, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "طلباتي | My Applications · نسير" },
      { name: "description", content: "تابع كل طلباتك وحالتها من جهة واحدة." },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { lang, tr } = useLang();
  const [apps, setApps] = useState<Application[]>([]);
  useEffect(() => setApps(store.getApplications()), []);

  return (
    <AppShell>
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">{tr("طلباتي", "My Applications")}</h1>
          <p className="mt-3 text-muted-foreground">
            {tr("تابع حالة طلباتك خطوة بخطوة.", "Follow your applications step by step.")}
          </p>
        </div>

        <ReadinessCard apps={apps} />


        {apps.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-3xl bg-card">
            <div className="text-5xl mb-4">🗂️</div>
            <div className="font-display font-bold text-lg">
              {tr("ما عندك طلبات لحد الحين", "You don't have any applications yet")}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {tr("اختر نشاطك وقدّم أول طلب في ثواني.", "Pick an activity and submit your first application in seconds.")}
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link to="/activities">{tr("ابدأ الآن", "Start now")}</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {apps.map((a, i) => {
              const meta = STATUS_META[a.status];
              return (
                <div
                  key={a.id}
                  className="p-6 rounded-3xl border border-border bg-card shadow-soft animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">{tr("اسم الترخيص", "License name")}</div>
                        <div className="font-display font-bold text-lg">{localize(lang, a.licenseName)}</div>
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${meta.color}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                      {localize(lang, meta.label)}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 text-sm mb-6">
                    <Field icon={Hash} label={tr("رقم الطلب", "Application #")} value={a.id} />
                    <Field icon={Building2} label={tr("الجهة", "Authority")} value={localize(lang, a.authority)} />
                    <Field
                      icon={Calendar}
                      label={tr("تاريخ التقديم", "Submitted on")}
                      value={new Date(a.submittedAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-GB")}
                    />
                  </div>

                  <Timeline step={meta.step} rejected={a.status === "rejected"} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3 rounded-2xl bg-background border border-border">
      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  );
}

function Timeline({ step, rejected }: { step: number; rejected: boolean }) {
  const { tr, dir } = useLang();
  const STEPS = [
    tr("تم الاستلام", "Received"),
    tr("قيد المعالجة", "Processing"),
    tr("استكمال / موافقة", "Review / Approval"),
    tr("تم الإصدار", "Issued"),
  ];
  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => {
          const active = !rejected && i <= step;
          return (
            <div key={s} className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  rejected
                    ? "bg-red-100 border-red-300 text-red-700"
                    : active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <div className={`text-[11px] mt-2 ${active ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                {s}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className={`absolute top-4 h-0.5 bg-border -z-10 ${
          dir === "rtl" ? "right-[12%] left-[12%]" : "left-[12%] right-[12%]"
        }`}
      />
    </div>
  );
}

// ---------------- Readiness Card ----------------

const REQUIRED_DOCS: { id: string; ar: string; en: string }[] = [
  { id: "cr", ar: "السجل التجاري", en: "Commercial Registration" },
  { id: "id", ar: "الهوية الوطنية", en: "National ID" },
  { id: "lease", ar: "عقد الإيجار", en: "Lease Contract" },
  { id: "safety", ar: "شهادة السلامة", en: "Safety Certificate" },
  { id: "municipal", ar: "الرخصة البلدية", en: "Municipal License" },
];

function ReadinessCard({ apps }: { apps: Application[] }) {
  const { lang, tr } = useLang();

  // Determine which docs are considered "uploaded" based on submitted apps.
  const uploadedIds = new Set<string>();
  if (apps.length > 0) {
    uploadedIds.add("id"); // registered user implies ID
    uploadedIds.add("lease");
  }
  apps.forEach((a) => {
    if (a.licenseId === "cr") uploadedIds.add("cr");
    if (a.licenseId === "municipal") uploadedIds.add("municipal");
    if (a.licenseId === "civil" || a.licenseId === "food") uploadedIds.add("safety");
  });

  const uploaded = REQUIRED_DOCS.filter((d) => uploadedIds.has(d.id));
  const missing = REQUIRED_DOCS.filter((d) => !uploadedIds.has(d.id));
  const total = REQUIRED_DOCS.length;
  const score = Math.round((uploaded.length / total) * 100);

  const authorities = new Set(apps.map((a) => a.authority));
  const entityCount = Math.max(authorities.size, apps.length > 0 ? 2 : 0);
  const eta = missing.length === 0 ? 0 : 3 + missing.length * 2;

  const nextDoc = missing[0];
  const projected = Math.min(100, Math.round(((uploaded.length + 1) / total) * 100));

  const R = 52;
  const C = 2 * Math.PI * R;
  const offset = C - (score / 100) * C;

  return (
    <div className="mb-8 p-6 md:p-8 rounded-3xl border border-border bg-card shadow-soft animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        <h2 className="font-display font-bold text-xl">
          {tr("جاهزية الطلب", "Request Readiness")}
        </h2>
      </div>

      <div className="grid md:grid-cols-[auto,1fr] gap-8 items-center">
        {/* Circular score */}
        <div className="relative w-40 h-40 mx-auto md:mx-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={R} stroke="hsl(var(--border))" strokeWidth="10" fill="none" />
            <circle
              cx="60"
              cy="60"
              r={R}
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 800ms ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-primary">{score}%</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {tr("جاهزية", "Readiness")}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Stat emoji="✅" label={tr("المستندات المرفوعة", "Uploaded documents")} value={String(uploaded.length)} tone="green" />
          <Stat emoji="❌" label={tr("المستندات الناقصة", "Missing documents")} value={String(missing.length)} tone="red" />
          <Stat emoji="📄" label={tr("إجمالي المستندات", "Total required")} value={String(total)} />
          <Stat emoji="🏛️" label={tr("الجهات الحكومية", "Government entities")} value={String(entityCount)} />
          <Stat
            emoji="⏳"
            label={tr("المدة المتوقعة", "Estimated completion")}
            value={eta === 0 ? tr("مكتمل", "Complete") : tr(`${eta} أيام`, `${eta} days`)}
          />
        </div>
      </div>

      {/* Document lists */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/60">
          <div className="text-sm font-semibold text-emerald-800 mb-3">
            {tr("المستندات المرفوعة", "Uploaded documents")}
          </div>
          {uploaded.length === 0 ? (
            <div className="text-xs text-muted-foreground">
              {tr("لا يوجد مستندات مرفوعة بعد.", "No documents uploaded yet.")}
            </div>
          ) : (
            <ul className="space-y-2">
              {uploaded.map((d) => (
                <li key={d.id} className="flex items-center gap-2 text-sm text-emerald-900">
                  <span className="text-emerald-600">✔</span>
                  {lang === "ar" ? d.ar : d.en}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-5 rounded-2xl border border-red-200 bg-red-50/60">
          <div className="text-sm font-semibold text-red-800 mb-3">
            {tr("المستندات الناقصة", "Missing documents")}
          </div>
          {missing.length === 0 ? (
            <div className="text-xs text-muted-foreground">
              {tr("كل المستندات مكتملة 🎉", "All documents complete 🎉")}
            </div>
          ) : (
            <ul className="space-y-2">
              {missing.map((d) => (
                <li key={d.id} className="flex items-center gap-2 text-sm text-red-900">
                  <span className="text-red-600">✖</span>
                  {lang === "ar" ? d.ar : d.en}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Smart recommendation */}
      {nextDoc && (
        <div className="mt-5 p-4 rounded-2xl border border-orange-200 bg-orange-50/70 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            💡
          </div>
          <div className="text-sm text-orange-900 leading-relaxed">
            <div className="font-semibold mb-1">
              {tr("التوصية الذكية", "Smart recommendation")}
            </div>
            {tr(
              `إذا قمت برفع ${nextDoc.ar} أولاً، سترتفع نسبة جاهزية طلبك إلى ${projected}%.`,
              `If you upload the ${nextDoc.en} first, your readiness score will rise to ${projected}%.`,
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  emoji,
  label,
  value,
  tone,
}: {
  emoji: string;
  label: string;
  value: string;
  tone?: "green" | "red";
}) {
  const toneClass =
    tone === "green"
      ? "text-emerald-700"
      : tone === "red"
      ? "text-red-700"
      : "text-foreground";
  return (
    <div className="p-3 rounded-2xl bg-background border border-border">
      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-1">
        <span>{emoji}</span>
        {label}
      </div>
      <div className={`font-bold text-lg ${toneClass}`}>{value}</div>
    </div>
  );
}

