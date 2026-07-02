import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/naseer/AppShell";
import { ACTIVITIES } from "@/lib/naseer-data";
import { localize, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "الأنشطة | Activities · نسير" },
      { name: "description", content: "اختر نوع مشروعك وشوف التراخيص المطلوبة." },
    ],
  }),
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const { lang, tr } = useLang();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <AppShell>
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">
            {tr("وش نوع مشروعك؟", "What kind of business?")}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {tr(
              "اختر النشاط، ونسير يطلع لك كل التراخيص المطلوبة.",
              "Pick an activity and Naseer will list every required license.",
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACTIVITIES.map((a, i) => (
            <Link
              key={a.id}
              to="/licenses"
              search={{ activity: a.id }}
              className="group relative p-7 rounded-3xl border border-border bg-card shadow-soft hover:shadow-card hover:-translate-y-1 hover:border-primary/30 transition-all overflow-hidden animate-fade-in"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
            >
              <div className="absolute -top-10 -left-10 w-32 h-32 pattern-bg opacity-[0.08]" aria-hidden />
              <div className="relative flex items-start justify-between">
                <div className="text-5xl">{a.emoji}</div>
                <Arrow className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="relative mt-5 font-display font-bold text-xl">{localize(lang, a.name)}</div>
              <div className="relative mt-1 text-sm text-muted-foreground">{localize(lang, a.desc)}</div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
