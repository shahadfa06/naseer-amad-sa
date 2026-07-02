import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/naseer/AppShell";
import { store, type Notification } from "@/lib/naseer-data";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localize, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "الإشعارات | Notifications · نسير" },
      { name: "description", content: "كل تحديثات طلباتك وإشعاراتك في مكان واحد." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { lang, tr } = useLang();
  const [items, setItems] = useState<Notification[]>([]);
  useEffect(() => setItems(store.getNotifications()), []);

  const markAll = () => {
    store.markAllRead();
    setItems(store.getNotifications());
  };

  return (
    <AppShell>
      <section className="max-w-3xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Bell className="w-7 h-7 text-primary" />
              {tr("الإشعارات", "Notifications")}
            </h1>
            <p className="mt-2 text-muted-foreground text-sm">
              {tr("كل التحديثات من الجهات ومن نسير.", "All updates from authorities and from Naseer.")}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={markAll} className="rounded-full">
            <Check className="w-3.5 h-3.5" />
            {tr("تحديد الكل كمقروء", "Mark all as read")}
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((n, i) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border shadow-soft animate-fade-in ${
                n.read ? "bg-card border-border" : "bg-primary/5 border-primary/20"
              }`}
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-display font-bold">{localize(lang, n.title)}</div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{localize(lang, n.body)}</p>
                  <div className="text-[11px] text-muted-foreground mt-2">
                    {new Date(n.at).toLocaleString(lang === "ar" ? "ar-SA" : "en-GB")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
