import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/naseer/AppShell";
import { REGULATIONS, CATEGORY_META, type Regulation } from "@/lib/naseer-data";
import { localize, useLang } from "@/lib/i18n";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CalendarClock,
  ExternalLink,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/regulations/$id")({
  loader: ({ params }) => {
    const item = REGULATIONS.find((r) => r.id === params.id);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "تحديث"} · نسير` },
      { name: "description", content: loaderData?.summary ?? "" },
    ],
  }),
  component: RegulationDetail,
});

function RegulationDetail() {
  const item = Route.useLoaderData() as Regulation;
  const { lang, tr } = useLang();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const meta = CATEGORY_META[item.category];

  const [summary, setSummary] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [affectOpen, setAffectOpen] = useState(false);

  const requestSummary = async () => {
    setSummaryOpen(true);
    if (summary || loadingSummary) return;
    setLoadingSummary(true);
    try {
      const prompt =
        lang === "en"
          ? `Summarize the following official Saudi government update strictly from the announcement text. Do not add facts. Use these sections with short bullets: 1) What changed 2) Why it changed (only if stated) 3) Who is affected 4) What business owners should do 5) Is any action required?\n\nTitle: ${item.title}\nAuthority: ${item.authority}\nCategory: ${meta.en}\nAnnouncement: ${item.fullAnnouncement}`
          : `لخّص هذا التحديث الحكومي الرسمي بناءً فقط على نص الإعلان الرسمي، بدون أي إضافات أو تخمين. استخدم الأقسام التالية مع نقاط قصيرة: ١) ما الذي تغيّر ٢) لماذا تم التغيير (فقط إن ذُكر) ٣) من يتأثر ٤) ما الذي يجب على أصحاب الأعمال فعله ٥) هل يوجد إجراء مطلوب؟\n\nالعنوان: ${item.title}\nالجهة: ${item.authority}\nالفئة: ${meta.ar}\nنص الإعلان: ${item.fullAnnouncement}`;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "");
      setSummary((data.reply || "").trim() || tr("تعذّر توليد الملخص.", "Couldn't generate a summary."));
    } catch {
      setSummary(tr("تعذّر توليد الملخص الآن. حاول مرة ثانية.", "Couldn't generate a summary right now. Please try again."));
    } finally {
      setLoadingSummary(false);
    }
  };

  const openChatWithContext = () => {
    const contextText =
      lang === "en"
        ? `You are analyzing this specific government update.\n• Update ID: ${item.id}\n• Title: ${item.title}\n• Authority: ${item.authority}\n• Category: ${meta.en}\n• Official summary: ${item.summary}`
        : `أنت تحلل هذا التحديث الحكومي تحديداً.\n• رقم التحديث: ${item.id}\n• العنوان: ${item.title}\n• الجهة: ${item.authority}\n• الفئة: ${meta.ar}\n• الملخص الرسمي: ${item.summary}`;
    const autoPrompt =
      lang === "en"
        ? "Does this update affect my business? Ask me only the minimum questions needed to decide."
        : "هل يؤثر هذا التحديث على نشاطي التجاري؟ اسألني فقط الأسئلة الأساسية اللازمة لتحديد ذلك.";
    window.dispatchEvent(
      new CustomEvent("naseer:chat-open", { detail: { contextText, autoPrompt } }),
    );
  };

  return (
    <AppShell>
      <section className="max-w-4xl mx-auto px-6 py-10">
        <Link
          to="/regulations"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <Arrow className="w-4 h-4" />
          {tr("العودة إلى التحديثات", "Back to updates")}
        </Link>

        {/* Header card */}
        <div className="rounded-3xl border border-border bg-card shadow-soft p-7 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${meta.badge}`}>
              {lang === "ar" ? meta.ar : meta.en}
            </span>
            {item.verified ? (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                {tr("مصدر موثّق", "Verified source")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <ShieldAlert className="w-3.5 h-3.5" />
                {tr("قيد التحقق", "Being verified")}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-3">{localize(lang, item.title)}</h1>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-xs text-muted-foreground">
            <MetaItem icon={Building2} label={tr("الجهة", "Authority")} value={localize(lang, item.authority)} />
            <MetaItem icon={Calendar} label={tr("تاريخ النشر", "Publication date")} value={item.publicationDate} />
            <MetaItem icon={CalendarClock} label={tr("تاريخ السريان", "Effective date")} value={item.effectiveDate} />
            <MetaItem icon={RefreshCw} label={tr("آخر مزامنة", "Last sync")} value={item.lastSyncAt} />
          </div>
        </div>

        {/* Announcement */}
        <div className="rounded-3xl border border-border bg-card shadow-soft p-7 mb-6">
          <h2 className="font-display font-bold text-lg mb-3">{tr("الإعلان الرسمي الكامل", "Full official announcement")}</h2>
          {item.verified ? (
            <p className="text-sm leading-loose whitespace-pre-line text-foreground/90">
              {localize(lang, item.fullAnnouncement)}
            </p>
          ) : (
            <p className="text-sm leading-loose text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              {tr(
                "المعلومات الرسمية قيد التحقق حالياً. يرجى الرجوع إلى المصدر الرسمي أدناه.",
                "Official information is currently being verified. Please refer to the official source below.",
              )}
            </p>
          )}
        </div>

        {/* AI tools */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {/* AI Summary */}
          <div className="rounded-3xl border border-border bg-card shadow-soft p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="font-semibold">{tr("ملخص المساعد الذكي", "AI Summary")}</div>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {tr(
                "ملخص مبني حصراً من نص الإعلان الرسمي — بدون أي معلومات مُختلقة.",
                "A summary generated strictly from the official announcement — no fabricated information.",
              )}
            </p>
            <Button
              type="button"
              onClick={requestSummary}
              disabled={loadingSummary}
              className="w-full rounded-xl"
            >
              {loadingSummary ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {tr("جارٍ التوليد…", "Generating…")}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {summary ? tr("عرض الملخص", "Show summary") : tr("توليد ملخص ذكي", "Generate AI Summary")}
                </>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${summaryOpen ? "rotate-180" : ""}`} />
            </Button>
            {summaryOpen && (summary || loadingSummary) && (
              <div className="mt-4 rounded-2xl border border-border bg-background/60 p-4 text-sm leading-relaxed whitespace-pre-line animate-fade-in">
                {loadingSummary ? (
                  <div className="inline-flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {tr("يقرأ المساعد الإعلان الرسمي…", "The assistant is reading the official announcement…")}
                  </div>
                ) : (
                  summary
                )}
              </div>
            )}
          </div>

          {/* Affects my business */}
          <div className="rounded-3xl border border-border bg-card shadow-soft p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="font-semibold">{tr("هل يؤثر هذا على نشاطي؟", "Does this affect my business?")}</div>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {tr(
                "تحليل ذكي لمعرفة إن كان هذا التحديث يخصّ نشاطك التجاري.",
                "An AI check to determine whether this update affects your business.",
              )}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAffectOpen((v) => !v)}
              className="w-full rounded-xl"
            >
              <MessageCircle className="w-4 h-4" />
              {tr("افحص التأثير على نشاطي", "Check impact on my business")}
              <ChevronDown className={`w-4 h-4 transition-transform ${affectOpen ? "rotate-180" : ""}`} />
            </Button>
            {affectOpen && (
              <div className="mt-4 rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-4 text-sm leading-relaxed animate-fade-in">
                <p className="mb-3 text-sky-900">
                  {tr(
                    "هذه الميزة تتيح للمساعد الذكي تحليل ما إذا كان هذا التحديث الحكومي يؤثر على نشاطك التجاري.",
                    "This feature lets the AI analyze whether this government update affects your business.",
                  )}
                </p>
                <Button type="button" onClick={openChatWithContext} className="rounded-xl">
                  <Sparkles className="w-4 h-4" />
                  {tr("محادثة مع المساعد الذكي", "Chat with AI")}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Official source */}
        <div className="rounded-3xl border border-border bg-card shadow-soft p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[220px]">
              <div className="text-xs text-muted-foreground mb-1">{tr("المصدر الرسمي", "Official source")}</div>
              <div className="font-semibold">{localize(lang, item.authority)}</div>
              <div className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-3">
                <span>{tr("تاريخ النشر:", "Published:")} {item.publicationDate}</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  {item.verified ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {tr("موثّق", "Verified")}
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      {tr("قيد التحقق", "Being verified")}
                    </>
                  )}
                </span>
              </div>
            </div>
            <a
              href={item.url || item.authorityUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
            >
              <ExternalLink className="w-4 h-4" />
              {tr("زيارة المصدر الرسمي", "Visit official source")}
            </a>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/50 px-3 py-2.5">
      <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
