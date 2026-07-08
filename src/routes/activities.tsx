import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Coffee,
  Pill,
  Scissors,
  Shirt,
  ShoppingCart,
  Stethoscope,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
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

const ICONS: Record<string, { icon: LucideIcon; cls: string }> = {
  coffee: { icon: Coffee, cls: "bg-[#EFE9D9] dark:bg-secondary" },
  restaurant: { icon: UtensilsCrossed, cls: "bg-[#E9E3D2] dark:bg-secondary" },
  salon: { icon: Scissors, cls: "bg-[#EFEBE0] dark:bg-secondary" },
  supermarket: { icon: ShoppingCart, cls: "bg-[#E7E1D1] dark:bg-secondary" },
  pharmacy: { icon: Pill, cls: "bg-[#EEE7D2] dark:bg-secondary" },
  clothing: { icon: Shirt, cls: "bg-[#EAE3CE] dark:bg-secondary" },
  retail: { icon: Store, cls: "bg-[#E7E1D1] dark:bg-secondary" },
  clinic: { icon: Stethoscope, cls: "bg-[#EEE7D2] dark:bg-secondary" },
  contracting: { icon: Building2, cls: "bg-[#EAE3CE] dark:bg-secondary" },
};

const FALLBACK = { icon: Store, cls: "bg-[#EFE9D9] dark:bg-secondary" };

function ActivitiesPage() {
  const { lang, tr } = useLang();

  return (
    <AppShell>
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.2em] text-primary font-bold mb-2">
            {tr("الأنشطة الشائعة", "Popular activities")}
          </div>
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {ACTIVITIES.map((a, i) => {
            const meta = ICONS[a.id] ?? FALLBACK;
            const Icon = meta.icon;
            return (
              <Link
                key={a.id}
                to="/licenses"
                search={{ activity: a.id }}
                className="group rounded-2xl border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/40 hover:-translate-y-1 hover:shadow-soft transition-all bg-background/50 animate-fade-in"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${meta.cls}`}
                >
                  <Icon className="w-5 h-5 text-saudi-ink" />
                </div>
                <div className="text-sm font-semibold text-center">{localize(lang, a.name)}</div>
              </Link>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
