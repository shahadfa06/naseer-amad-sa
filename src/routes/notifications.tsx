import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/naseer/AppShell";
import { store, type Notification, type NotificationKind } from "@/lib/naseer-data";
import { Bell, Check, CheckCircle2, Clock, Lightbulb, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localize, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "الإشعارات | Notifications · نسير" },
      { name: "description", content: "مركز الإشعارات الذكي — تحديثات مخصّصة حسب تقدّم رحلتك." },
    ],
  }),
  component: NotificationsPage,
});

const KIND_STYLES: Record<
  NotificationKind,
  { wrap: string; icon: string; iconBg: string; Icon: React.ComponentType<{ className?: string }>; badgeAr: string; badgeEn: string }
> = {
  success: {
    wrap: "bg-emerald-50 border-emerald-200",
    icon: "text-emerald-700",
    iconBg: "bg-emerald-100",
    Icon: CheckCircle2,
    badgeAr: "مُنجز",
    badgeEn: "Completed",
  },
  reminder: {
    wrap: "bg-orange-50 border-orange-200",
    icon: "text-orange-700",
    iconBg: "bg-orange-100",
    Icon: Clock,
    badgeAr: "تذكير",
    badgeEn: "Reminder",
  },
  urgent: {
    wrap: "bg-red-50 border-red-200",
    icon: "text-red-700",
    iconBg: "bg-red-100",
    Icon: AlertTriangle,
    badgeAr: "عاجل",
    badgeEn: "Urgent",
  },
  ai: {
    wrap: "bg-blue-50 border-blue-200",
    icon: "text-blue-700",
    iconBg: "bg-blue-100",
    Icon: Lightbulb,
    badgeAr: "توصية ذكية",
    badgeEn: "AI Suggestion",
  },
  info: {
    wrap: "bg-card border-border",
    icon: "text-muted-foreground",
    iconBg: "bg-muted",
    Icon: Info,
    badgeAr: "معلومة",
    badgeEn: "Info",
  },
};

function NotificationsPage() {
  const { lang, tr } = useLang();
  const [items, setItems] = useState<Notification[]>([]);

  const refresh = () => setItems(store.getSmartNotifications());
  useEffect(() => {
    refresh();
  }, []);

  const markAll = () => {
    store.markAllRead();
    refresh();
    window.dispatchEvent(new Event("naseer:updated"));
  };

  const unread = items.filter((n) => !n.read).length;

  return (
    <AppShell>
      <section className="max-w-3xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Bell className="w-7 h-7 text-primary" />
              {tr("مركز الإشعارات الذكي", "Smart Notifications Center")}
              {unread > 0 && (
                <span className="text-xs font-bold bg-red-500 text-white rounded-full px-2.5 py-1">
                  {unread}
                </span>
              )}
            </h1>
            <p className="mt-2 text-muted-foreground text-sm">
              {tr(
                "تحديثات مخصّصة تظهر تلقائياً حسب تقدّمك في رحلة التراخيص.",
                "Personalized updates generated automatically from your licensing journey.",
              )}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={markAll} className="rounded-full">
            <Check className="w-3.5 h-3.5" />
            {tr("تحديد الكل كمقروء", "Mark all as read")}
          </Button>
        </div>

        <div className="space-y-3">
          {items.length === 0 && (
            <div className="text-center py-14 border border-dashed border-border rounded-3xl bg-card">
              <div className="text-4xl mb-2">🔔</div>
              <div className="font-display font-bold">
                {tr("لا توجد إشعارات حالياً", "No notifications yet")}
              </div>
            </div>
          )}

          {items.map((n, i) => {
            const style = KIND_STYLES[n.kind ?? "info"];
            const Icon = style.Icon;
            return (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border shadow-soft animate-fade-in ${style.wrap} ${
                  !n.read ? "ring-1 ring-primary/10" : "opacity-90"
                }`}
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-xl ${style.iconBg}`}>
                    {n.emoji ? <span>{n.emoji}</span> : <Icon className={`w-5 h-5 ${style.icon}`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="font-display font-bold text-[15px]">
                        {localize(lang, n.title)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold tracking-wide uppercase rounded-full px-2 py-0.5 ${style.iconBg} ${style.icon}`}
                        >
                          {tr(style.badgeAr, style.badgeEn)}
                        </span>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-red-500" />}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
                      {localize(lang, n.body)}
                    </p>
                    <div className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {new Date(n.at).toLocaleString(lang === "ar" ? "ar-SA" : "en-GB")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
