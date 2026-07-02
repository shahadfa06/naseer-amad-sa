import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  BadgeCheck,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Upload,
  Send,
  XCircle,
  Wand2,
  Pencil,
  ScanSearch,
  Lightbulb,
  History,
  Loader2,
  Download,
  FileWarning,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { localize, useLang } from "@/lib/i18n";

const search = z.object({ activity: z.string() });

export const Route = createFileRoute("/journey/$licenseId")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "رحلة إصدار الترخيص | Journey · نسير" },
      { name: "description", content: "مساعد المستندات الذكي — إنشاء، مراجعة، تحقق، وتحضير كامل قبل التقديم." },
    ],
  }),
  component: JourneyPage,
});

// ---------- Types ----------

type DocStatus = "missing" | "generated" | "uploaded" | "reviewed" | "validated";

type DocState = {
  name: string;
  status: DocStatus;
  content: string;         // draft / uploaded text
  aiReport?: string;       // markdown from review
  aiValidation?: string;   // markdown from validate
  compliance?: number;     // 0..100 parsed from validate
  issuedAt?: string;       // simulated document date
  expired?: boolean;
  formatOk?: boolean;
};

type SyncSnapshot = {
  checkedAt: string;
  source: string;
  lastOfficialUpdate: string;
  verified: boolean;
  stale: boolean;
  history: { at: string; field: string; summary: string }[];
};

// ---------- Page ----------

function JourneyPage() {
  const { lang, tr, dir } = useLang();
  const { licenseId } = Route.useParams();
  const { activity } = Route.useSearch();
  const navigate = useNavigate();
  const Prev = dir === "rtl" ? ArrowRight : ArrowLeft;

  const license = useMemo<License | undefined>(
    () => getLicensesFor(activity).find((l) => l.id === licenseId),
    [activity, licenseId],
  );
  const meta: LicenseMeta = META[licenseId] ?? DEFAULT_META;

  const docs = lang === "ar" ? meta.documents : meta.documentsEn;
  const reqs = lang === "ar" ? meta.requirements : meta.requirementsEn;

  const user = store.getUser();
  const [profileComplete] = useState(() => {
    if (!user) return 0;
    const fields = [user.fullName, user.email, user.phone, user.nationalId, user.dob];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  });

  const [state, setState] = useState<Record<string, DocState>>(() =>
    Object.fromEntries(docs.map((d) => [d, { name: d, status: "missing" as DocStatus, content: "" }])),
  );
  const [active, setActive] = useState<string | null>(docs[0] ?? null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [sync, setSync] = useState<SyncSnapshot | null>(null);

  // Automated sync engine hit on mount
  useEffect(() => {
    fetch(`/api/sync-check?licenseId=${licenseId}`)
      .then((r) => r.json())
      .then((d) => setSync(d))
      .catch(() => setSync(null));
  }, [licenseId]);

  const patch = (name: string, p: Partial<DocState>) =>
    setState((s) => ({ ...s, [name]: { ...s[name], ...p } }));

  // ----- Readiness scoring (weighted) -----
  const readiness = useMemo(() => {
    const total = docs.length || 1;
    const uploaded = docs.filter((d) => state[d]?.status !== "missing").length;
    const validated = docs.filter((d) => (state[d]?.compliance ?? 0) >= 70).length;
    const valid = docs.filter((d) => state[d] && !state[d].expired && state[d].formatOk !== false && state[d].status !== "missing").length;
    const aiPassed = docs.filter((d) => state[d]?.aiReport && (state[d]?.compliance ?? 0) >= 60).length;

    const parts = {
      profile: profileComplete,                                   // weight 15
      uploaded: Math.round((uploaded / total) * 100),             // weight 25
      validity: Math.round((valid / total) * 100),                // weight 20
      requirements: Math.round(((total - (total - uploaded)) / total) * 100), // 15
      aiValidation: Math.round((aiPassed / total) * 100),         // 25
    };
    const score = Math.round(
      parts.profile * 0.15 +
        parts.uploaded * 0.25 +
        parts.validity * 0.20 +
        parts.requirements * 0.15 +
        parts.aiValidation * 0.25,
    );

    // Explanations for why score < 100
    const reasons: string[] = [];
    if (profileComplete < 100) reasons.push(tr("بياناتك الشخصية غير مكتملة.", "Your personal profile is incomplete."));
    if (uploaded < total) reasons.push(tr(`لا يزال ${total - uploaded} مستند(ات) بدون رفع.`, `${total - uploaded} document(s) still not uploaded.`));
    if (valid < uploaded) reasons.push(tr("بعض المستندات تحتوي تنسيقاً غير صحيح أو منتهية الصلاحية.", "Some documents have wrong formatting or are expired."));
    if (aiPassed < uploaded) reasons.push(tr("لم يجتز المساعد الذكي فحص كل المستندات المرفوعة.", "AI hasn't validated every uploaded document yet."));

    return { score, parts, reasons, uploaded, total, validated };
  }, [state, docs, profileComplete, tr]);

  if (!license) {
    return (
      <AppShell>
        <section className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold mb-3">{tr("لم نجد هذا الترخيص", "License not found")}</h1>
          <Button asChild className="rounded-full" style={{ background: "var(--saudi-deep)" }}>
            <Link to="/licenses" search={{ activity }}>{tr("رجوع إلى التراخيص", "Back to licenses")}</Link>
          </Button>
        </section>
      </AppShell>
    );
  }

  const activeDoc = active ? state[active] : null;

  const submit = () => {
    const app = store.addApplication(license);
    setSubmittedId(app.id);
  };

  return (
    <AppShell>
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Back */}
        <div className="mb-4">
          <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate({ to: "/licenses", search: { activity } })}>
            <Prev className="w-3.5 h-3.5" />
            {tr("رجوع إلى التراخيص", "Back to licenses")}
          </Button>
        </div>

        {/* Hero */}
        <div
          className="relative rounded-3xl overflow-hidden text-white p-6 md:p-8 mb-5"
          style={{ background: "linear-gradient(135deg, #002A14 0%, #003D1E 60%, #005128 100%)" }}
        >
          <div className="absolute inset-0 pattern-bg opacity-[0.12]" aria-hidden />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold bg-white/15 backdrop-blur px-3 py-1 rounded-full mb-3">
                <BrainCircuit className="w-3.5 h-3.5" />
                {tr("مساعد المستندات الذكي", "AI Document Assistant")}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{localize(lang, license.name)}</h1>
              <p className="text-white/80 text-sm mt-1">{localize(lang, license.authority)}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Chip icon={Coins} label={tr("الرسوم", "Fees")} value={localize(lang, license.cost)} />
              <Chip icon={Clock} label={tr("المدة", "Duration")} value={localize(lang, license.duration)} />
              <Chip icon={Landmark} label={tr("الجهة", "Authority")} value={localize(lang, license.authority)} />
            </div>
          </div>
        </div>

        {/* Sync engine banner */}
        <SyncBanner sync={sync} meta={meta} />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-5 mt-5">
          {/* LEFT: Documents + Assistant */}
          <div className="space-y-5 min-w-0">
            <div className="rounded-3xl border border-border bg-card shadow-soft p-5">
              <SectionTitle icon={FileCheck2} title={tr("مستندات الترخيص", "License documents")} />
              <p className="text-xs text-muted-foreground mb-4">
                {tr(
                  "أنشئ، حرّر، ارفع، وراجع كل مستند بذكاء قبل التقديم.",
                  "Generate, edit, upload and review every document with AI before you submit.",
                )}
              </p>
              <ul className="space-y-2">
                {docs.map((d) => {
                  const s = state[d];
                  const isActive = active === d;
                  return (
                    <li key={d}>
                      <button
                        onClick={() => setActive(d)}
                        className={`w-full text-start flex items-center justify-between gap-3 rounded-2xl border p-3 transition ${
                          isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 bg-background"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <StatusDot status={s.status} />
                          <div className="min-w-0">
                            <div className="font-semibold text-sm truncate">{d}</div>
                            <StatusLine s={s} />
                          </div>
                        </div>
                        {typeof s.compliance === "number" && (
                          <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                            s.compliance >= 70 ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400" : "bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400"
                          }`}>
                            {s.compliance}%
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {activeDoc && (
              <DocumentAssistant
                key={activeDoc.name}
                license={license}
                lang={lang}
                doc={activeDoc}
                requirements={reqs}
                onPatch={(p) => patch(activeDoc.name, p)}
              />
            )}
          </div>

          {/* RIGHT: Readiness + Submit */}
          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            <ReadinessCard readiness={readiness} lang={lang} />

            <div className="rounded-3xl border border-border bg-card shadow-soft p-5 space-y-3">
              <SectionTitle icon={Send} title={tr("التقديم الرسمي", "Official submission")} />
              <div className="text-xs text-muted-foreground">
                {tr("عندما تصل جاهزيتك إلى ٧٠٪ سنمكّنك من إرسال الطلب رسمياً للجهة المختصة.", "Once readiness reaches 70% you can submit officially to the authority.")}
              </div>
              {submittedId ? (
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-emerald-900 dark:text-emerald-300">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <CheckCircle2 className="w-5 h-5" />
                    {tr("تم إرسال طلبك", "Application submitted")}
                  </div>
                  <div className="text-xs">
                    {tr("رقم الطلب:", "Application ID:")} <span className="font-mono font-bold">{submittedId}</span>
                  </div>
                  <Button asChild size="sm" variant="outline" className="rounded-full mt-3">
                    <Link to="/applications">{tr("متابعة الطلبات", "Track applications")}</Link>
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={submit}
                  className="w-full rounded-full h-11"
                  style={{ background: "var(--saudi-deep)" }}
                  disabled={readiness.score < 70}
                >
                  <Send className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                  {tr("إرسال الطلب رسمياً", "Submit officially")}
                </Button>
              )}
              <Button variant="outline" size="sm" asChild className="w-full rounded-full">
                <a href={license.authorityUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {tr("الانتقال إلى الجهة الرسمية", "Go to official authority")}
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}

// ---------- Document Assistant Panel ----------

function DocumentAssistant({
  license,
  lang,
  doc,
  requirements,
  onPatch,
}: {
  license: License;
  lang: "ar" | "en";
  doc: DocState;
  requirements: string[];
  onPatch: (p: Partial<DocState>) => void;
}) {
  const { tr } = useLang();
  const [busy, setBusy] = useState<null | "generate" | "review" | "validate" | "suggest">(null);
  const [suggestions, setSuggestions] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const call = async (action: "generate" | "review" | "validate" | "suggest") => {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch("/api/doc-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          licenseName: localize(lang, license.name),
          authority: localize(lang, license.authority),
          documentName: doc.name,
          documentContent: doc.content,
          requirements,
          lang,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI error");
      const text: string = data.text ?? "";
      if (action === "generate") {
        onPatch({ content: text, status: "generated", formatOk: true, issuedAt: new Date().toISOString() });
      } else if (action === "review") {
        onPatch({ aiReport: text, status: doc.status === "missing" ? "reviewed" : "reviewed" });
      } else if (action === "validate") {
        const m = text.match(/(\d{1,3})\s*%/);
        const pct = m ? Math.min(100, parseInt(m[1], 10)) : undefined;
        onPatch({ aiValidation: text, compliance: pct, status: "validated" });
      } else if (action === "suggest") {
        setSuggestions(text);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI error");
    } finally {
      setBusy(null);
    }
  };

  const upload = async (file: File) => {
    const text = await file.text().catch(() => `[${file.name}] — ${tr("ملف مرفوع (غير نصي)", "uploaded (binary)")}`);
    const expired = /2020|2021|2022/.test(file.name);
    const formatOk = /\.(pdf|txt|md|docx?)$/i.test(file.name);
    onPatch({
      content: text.slice(0, 20000),
      status: "uploaded",
      expired,
      formatOk,
      issuedAt: new Date().toISOString(),
    });
  };

  const download = () => {
    const blob = new Blob([doc.content || ""], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${doc.name}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="rounded-3xl border border-border bg-card shadow-soft p-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <SectionTitle icon={BrainCircuit} title={doc.name} />
        <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${
          doc.status === "missing" ? "bg-muted text-muted-foreground"
            : doc.status === "validated" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            : "bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
        }`}>
          {statusLabel(doc.status, tr)}
        </span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <AiBtn onClick={() => call("generate")} loading={busy === "generate"} icon={Wand2} label={tr("توليد", "Generate")} primary />
        <AiBtn onClick={() => fileRef.current?.click()} icon={Upload} label={tr("رفع", "Upload")} />
        <AiBtn onClick={() => setEditing((v) => !v)} icon={Pencil} label={editing ? tr("إغلاق التحرير", "Close editor") : tr("تحرير", "Edit")} disabled={!doc.content} />
        <AiBtn onClick={download} icon={Download} label={tr("تنزيل", "Download")} disabled={!doc.content} />
      </div>
      <input ref={fileRef} type="file" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />

      {error && (
        <div className="text-xs text-red-800 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>
      )}

      {/* Draft */}
      {doc.content ? (
        <div className="rounded-2xl border border-border bg-background">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/60">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <FileText className="w-3.5 h-3.5" />
              {tr("محتوى المستند", "Document content")}
            </div>
            {doc.issuedAt && (
              <div className="text-[10px] text-muted-foreground">
                {tr("آخر تحديث:", "Updated:")} {new Date(doc.issuedAt).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}
              </div>
            )}
          </div>
          {editing ? (
            <textarea
              value={doc.content}
              onChange={(e) => onPatch({ content: e.target.value })}
              className="w-full min-h-[240px] p-4 text-sm bg-transparent outline-none resize-y"
              dir="auto"
            />
          ) : (
            <div className="max-h-[320px] overflow-auto p-4 prose prose-sm max-w-none" dir="auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.content}</ReactMarkdown>
            </div>
          )}
          {/* Detection strip */}
          <div className="flex flex-wrap gap-2 px-3 py-2 border-t border-border/60">
            <DetectionBadge ok={doc.formatOk !== false} okLabel={tr("تنسيق سليم", "Valid format")} badLabel={tr("تنسيق غير صحيح", "Invalid format")} />
            <DetectionBadge ok={!doc.expired} okLabel={tr("سارية", "Not expired")} badLabel={tr("منتهية الصلاحية", "Expired")} />
            <DetectionBadge ok={doc.content.length > 80} okLabel={tr("محتوى كافٍ", "Sufficient content")} badLabel={tr("محتوى ناقص", "Content too short")} />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          <FileWarning className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          {tr("لا يوجد محتوى بعد. ولّد المستند تلقائياً أو ارفع نسختك.", "No content yet. Generate a draft or upload your own copy.")}
        </div>
      )}

      {/* AI panels */}
      <div className="grid md:grid-cols-2 gap-3">
        <AiPanel
          title={tr("مراجعة ذكية", "AI Review")}
          icon={ScanSearch}
          onRun={() => call("review")}
          loading={busy === "review"}
          disabled={!doc.content}
          body={doc.aiReport}
          emptyLabel={tr("اطلب من المساعد مراجعة المستند وكشف: مرفقات ناقصة، أخطاء تنسيق، معلومات غير متسقة.", "Ask the assistant to review this document for: missing attachments, formatting issues, inconsistent info.")}
        />
        <AiPanel
          title={tr("تحقق من المتطلبات الرسمية", "Requirements validation")}
          icon={ShieldCheck}
          onRun={() => call("validate")}
          loading={busy === "validate"}
          disabled={!doc.content}
          body={doc.aiValidation}
          emptyLabel={tr("سيقارن المساعد المستند بمتطلبات الجهة الرسمية ويحسب نسبة المطابقة.", "The assistant will compare this document to the official requirements and compute a compliance score.")}
        />
      </div>

      <div className="rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Lightbulb className="w-4 h-4 text-primary" />
            {tr("اقتراحات التحسين", "Improvement suggestions")}
          </div>
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => call("suggest")} disabled={busy === "suggest" || !doc.content}>
            {busy === "suggest" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {tr("اقترح تحسينات", "Suggest")}
          </Button>
        </div>
        {suggestions ? (
          <div className="prose prose-sm max-w-none" dir="auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{suggestions}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {tr("سيقترح المساعد تحسينات محددة قبل إرسال المستند للجهة الرسمية.", "The assistant will suggest concrete improvements before you send the document to the authority.")}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------- Sync banner ----------

function SyncBanner({ sync, meta }: { sync: SyncSnapshot | null; meta: LicenseMeta }) {
  const { tr } = useLang();
  const verified = sync ? sync.verified : meta.verified && !meta.stale;
  return (
    <div className={`rounded-2xl border p-4 flex flex-col md:flex-row md:items-center gap-3 ${
      verified ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" : "bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
    }`}>
      <div className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${verified ? "bg-emerald-100" : "bg-amber-100"}`}>
          <RefreshCw className={`w-4 h-4 ${verified ? "text-emerald-700" : "text-amber-700"}`} />
        </div>
        <div>
          <div className="text-sm font-bold">
            {tr("محرّك المزامنة التلقائي", "Automated sync engine")} · {verified ? tr("محدَّث", "Up to date") : tr("قد تكون قديمة", "May be outdated")}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {tr("آخر فحص:", "Checked:")} {sync?.checkedAt ?? meta.lastSyncedAt} · {tr("آخر تحديث رسمي:", "Official update:")} {sync?.lastOfficialUpdate ?? meta.lastOfficialUpdate}
          </div>
        </div>
      </div>
      <a href={sync?.source ?? meta.sourceUrl} target="_blank" rel="noreferrer" className="md:ms-auto text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1" dir="ltr">
        <ExternalLink className="w-3 h-3" />
        {(sync?.source ?? meta.sourceUrl).replace(/^https?:\/\//, "")}
      </a>
      {sync && sync.history.length > 0 && (
        <details className="md:ms-2 w-full md:w-auto">
          <summary className="text-xs font-semibold text-primary cursor-pointer inline-flex items-center gap-1">
            <History className="w-3 h-3" />
            {tr("سجل التحديثات", "Change history")}
          </summary>
          <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
            {sync.history.map((h, i) => (
              <li key={i}>
                <span className="font-mono">{h.at}</span> — <span className="font-semibold">{h.field}</span>: {h.summary}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

// ---------- Readiness ----------

function ReadinessCard({ readiness, lang }: { readiness: { score: number; parts: Record<string, number>; reasons: string[]; uploaded: number; total: number }; lang: "ar" | "en" }) {
  const { tr } = useLang();
  const labels: Record<string, string> = {
    profile: tr("اكتمال البيانات", "Profile completeness"),
    uploaded: tr("المستندات المرفوعة", "Uploaded documents"),
    validity: tr("صلاحية المستندات", "Document validity"),
    requirements: tr("تغطية المتطلبات", "Requirements coverage"),
    aiValidation: tr("تحقق المساعد الذكي", "AI validation"),
  };
  return (
    <div className="rounded-3xl border border-border bg-card shadow-soft p-5">
      <SectionTitle icon={BrainCircuit} title={tr("جاهزية الطلب", "Application readiness")} />
      <div className="flex items-center gap-4 mt-3">
        <ReadinessRing value={readiness.score} />
        <div className="text-sm">
          <div className="font-bold text-lg">
            {readiness.uploaded}/{readiness.total} <span className="text-muted-foreground font-normal text-xs">{tr("مستند مرفوع", "docs uploaded")}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {readiness.score >= 100
              ? tr("طلبك مكتمل 🎉", "You're fully ready 🎉")
              : tr("النسبة أقل من ١٠٠٪ للأسباب التالية:", "Score is below 100% because:")}
          </div>
        </div>
      </div>
      {readiness.reasons.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-xs">
          {readiness.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-1.5 text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 space-y-2">
        {Object.entries(readiness.parts).map(([k, v]) => (
          <div key={k}>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
              <span>{labels[k]}</span>
              <span className="font-bold text-foreground">{v}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full transition-all" style={{ width: `${v}%`, background: "var(--saudi-deep)" }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed" dir="auto">
        {tr(
          "النتيجة محسوبة ديناميكياً وفق: اكتمال بياناتك، المستندات المرفوعة، صلاحيتها، تغطية المتطلبات، ونتائج تحقق المساعد الذكي.",
          "Score is calculated dynamically from: your profile completeness, uploaded documents, document validity, requirements coverage, and AI validation results.",
        )}
      </p>
      <div className="mt-3 text-[10px] text-muted-foreground">{lang === "ar" ? "تقرير الجاهزية" : "Readiness report"}</div>
    </div>
  );
}

// ---------- Small pieces ----------

function AiBtn({ onClick, loading, icon: Icon, label, primary, disabled }: {
  onClick: () => void; loading?: boolean; icon: React.ComponentType<{ className?: string }>; label: string; primary?: boolean; disabled?: boolean;
}) {
  return (
    <Button
      size="sm"
      onClick={onClick}
      disabled={disabled || loading}
      className="rounded-full h-9"
      variant={primary ? "default" : "outline"}
      style={primary ? { background: "var(--saudi-deep)" } : undefined}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
      {label}
    </Button>
  );
}

function AiPanel({ title, icon: Icon, onRun, loading, body, emptyLabel, disabled }: {
  title: string; icon: React.ComponentType<{ className?: string }>; onRun: () => void; loading: boolean; body?: string; emptyLabel: string; disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </div>
        <Button size="sm" variant="outline" className="rounded-full" onClick={onRun} disabled={loading || disabled}>
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {loading ? "…" : "Run"}
        </Button>
      </div>
      {body ? (
        <div className="prose prose-sm max-w-none max-h-[280px] overflow-auto" dir="auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">{emptyLabel}</p>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: DocStatus }) {
  const map: Record<DocStatus, string> = {
    missing: "bg-muted-foreground/30",
    generated: "bg-blue-500",
    uploaded: "bg-blue-500",
    reviewed: "bg-amber-500",
    validated: "bg-emerald-500",
  };
  return <span className={`w-2.5 h-2.5 rounded-full ${map[status]}`} />;
}

function StatusLine({ s }: { s: DocState }) {
  const { tr } = useLang();
  const parts: string[] = [];
  if (s.status === "missing") parts.push(tr("لم يُرفع بعد", "not uploaded"));
  else parts.push(statusLabel(s.status, tr).toLowerCase());
  if (s.expired) parts.push(tr("منتهية الصلاحية ⚠️", "expired ⚠️"));
  if (s.formatOk === false) parts.push(tr("تنسيق غير صحيح", "invalid format"));
  return <div className="text-[11px] text-muted-foreground">{parts.join(" · ")}</div>;
}

function statusLabel(s: DocStatus, tr: (a: string, e: string) => string) {
  switch (s) {
    case "missing": return tr("ناقص", "Missing");
    case "generated": return tr("تم توليده", "Generated");
    case "uploaded": return tr("مرفوع", "Uploaded");
    case "reviewed": return tr("تمت المراجعة", "Reviewed");
    case "validated": return tr("تم التحقق", "Validated");
  }
}

function DetectionBadge({ ok, okLabel, badLabel }: { ok: boolean; okLabel: string; badLabel: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
      ok ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800"
    }`}>
      {ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {ok ? okLabel : badLabel}
    </span>
  );
}

function Chip({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 rounded-full px-3 py-1.5 text-xs">
      <Icon className="w-3.5 h-3.5 opacity-80" />
      <span className="opacity-70">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h4 className="font-display font-bold text-base">{title}</h4>
    </div>
  );
}

function ReadinessRing({ value }: { value: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const off = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  const color = value >= 80 ? "var(--saudi-deep)" : value >= 50 ? "#d97706" : "#dc2626";
  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} stroke="var(--border)" strokeWidth="10" fill="none" />
        <circle cx="60" cy="60" r={r} stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} className="transition-all duration-500" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-black" style={{ color }}>{value}%</div>
      </div>
    </div>
  );
}
