import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/naseer/AppShell";
import { STATUS_META, store, type Application } from "@/lib/naseer-data";
import { Building2, Calendar, FileText, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "طلباتي | نسير" },
      { name: "description", content: "تابع كل طلباتك وحالتها من جهة واحدة." },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  useEffect(() => setApps(store.getApplications()), []);

  return (
    <AppShell>
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">طلباتي</h1>
          <p className="mt-3 text-muted-foreground">تابع حالة طلباتك خطوة بخطوة.</p>
        </div>

        {apps.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-3xl bg-card">
            <div className="text-5xl mb-4">🗂️</div>
            <div className="font-display font-bold text-lg">ما عندك طلبات لحد الحين</div>
            <p className="text-sm text-muted-foreground mt-2">
              اختر نشاطك وقدّم أول طلب في ثواني.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link to="/activities">ابدأ الآن</Link>
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
                        <div className="text-xs text-muted-foreground">اسم الترخيص</div>
                        <div className="font-display font-bold text-lg">{a.licenseName}</div>
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${meta.color}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 text-sm mb-6">
                    <Field icon={Hash} label="رقم الطلب" value={a.id} />
                    <Field icon={Building2} label="الجهة" value={a.authority} />
                    <Field
                      icon={Calendar}
                      label="تاريخ التقديم"
                      value={new Date(a.submittedAt).toLocaleDateString("ar-SA")}
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

const STEPS = ["تم الاستلام", "قيد المعالجة", "استكمال / موافقة", "تم الإصدار"];

function Timeline({ step, rejected }: { step: number; rejected: boolean }) {
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
      <div className="absolute top-4 right-[12%] left-[12%] h-0.5 bg-border -z-10" />
    </div>
  );
}
