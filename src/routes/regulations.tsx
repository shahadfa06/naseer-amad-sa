import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/naseer/AppShell";
import { REGULATIONS } from "@/lib/naseer-data";
import { ArrowLeft, ArrowRight, Building2, Calendar, Newspaper } from "lucide-react";
import { localize, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/regulations")({
  head: () => ({
    meta: [
      { title: "الأنظمة | Regulations · نسير" },
      {
        name: "description",
        content: "آخر تحديثات الأنظمة التجارية والتراخيص في المملكة العربية السعودية.",
      },
    ],
  }),
  component: RegulationsPage,
});

function RegulationsPage() {
  const { lang, tr } = useLang();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <AppShell>
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary mb-3">
            <Newspaper className="w-4 h-4" />
            {tr("الأنظمة والتحديثات", "Regulations & Updates")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            {tr("آخر التحديثات الحكومية", "Latest government updates")}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {tr(
              "نتابع لك تحديثات الأنظمة التجارية والتراخيص أول بأول.",
              "We track updates to commercial regulations and licenses in real time.",
            )}
          </p>
        </div>

        <div className="space-y-5">
          {REGULATIONS.map((r, i) => (
            <article
              key={r.id}
              className="relative p-6 rounded-3xl border border-border bg-card shadow-soft hover:shadow-card transition-all animate-fade-in"
              style={{ animationDelay: `${i * 70}ms`, animationFillMode: "backwards" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs text-muted-foreground">
                <div className="inline-flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {localize(lang, r.authority)}
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {r.date}
                </div>
              </div>
              <h2 className="font-display font-bold text-xl mb-2">{localize(lang, r.title)}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{localize(lang, r.summary)}</p>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                {tr("اقرأ المزيد", "Read more")}
                <Arrow className="w-3.5 h-3.5" />
              </a>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
