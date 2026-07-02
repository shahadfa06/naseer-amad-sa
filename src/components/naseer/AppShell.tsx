import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Bot, FileText, Heart, Home, LayoutGrid, Newspaper, ScrollText, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./brand";
import { ChatWidget } from "./ChatWidget";
import patternUrl from "@/assets/pattern.png";

const NAV = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/activities", label: "الأنشطة", icon: LayoutGrid },
  { to: "/licenses", label: "التراخيص", icon: ScrollText },
  { to: "/applications", label: "طلباتي", icon: FileText },
  { to: "/notifications", label: "الإشعارات", icon: Bell },
  { to: "/regulations", label: "الأنظمة", icon: Newspaper },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      style={{ ["--pattern-url" as string]: `url(${patternUrl})` } as React.CSSProperties}
    >
      {/* Trust bar */}
      <div
        className="text-[11px] tracking-wider"
        style={{
          background: "linear-gradient(90deg, var(--saudi-ink), var(--saudi))",
          color: "var(--primary-foreground)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 h-8 flex items-center justify-between">
          <div className="flex items-center gap-2 opacity-90">
            <ShieldCheck className="w-3 h-3" />
            <span>منصة رقمية سعودية • مستوحاة من رؤية 2030</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 opacity-80">
            <span>الدعم 920000000</span>
            <span aria-hidden>·</span>
            <span>AR</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <Logo size={40} withRing />
            <div className="leading-tight">
              <div className="font-display font-extrabold text-lg" style={{ color: "var(--saudi-ink)" }}>
                نسير
              </div>
              <div className="text-[10px] tracking-[0.28em] text-muted-foreground font-semibold">
                NASEER
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 mx-auto rounded-full border border-border bg-card/70 backdrop-blur px-1.5 py-1 shadow-soft">
            {NAV.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm transition-all ${
                    active
                      ? "bg-primary text-primary-foreground font-semibold shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <n.icon className="w-3.5 h-3.5" />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="mr-auto lg:mr-0 flex items-center gap-2">
            <Link
              to="/notifications"
              className="relative w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/40 hover:shadow-soft transition"
              aria-label="الإشعارات"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
            </Link>
            <Link
              to="/register"
              className="hidden sm:inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 hover:shadow-soft transition"
            >
              تسجيل دخول
            </Link>
          </div>
        </div>

        {/* mobile nav */}
        <div className="lg:hidden border-t border-border overflow-x-auto">
          <div className="flex items-center gap-1 px-3 py-2 min-w-max">
            {NAV.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition ${
                    active
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <n.icon className="w-3 h-3" />
                  {n.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="relative border-t border-border bg-card mt-16 overflow-hidden">
        <div className="absolute inset-0 pattern-bg opacity-[0.04]" aria-hidden />
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30"
          style={{ background: "var(--saudi)" }}
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo size={40} withRing />
              <div>
                <div className="font-display font-bold text-lg">نسير · Naseer</div>
                <div className="text-xs text-muted-foreground">مع نسير… طريقك يسير</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              منصة رقمية سعودية توحّد رحلة رواد الأعمال — من اختيار النشاط لين إصدار
              التراخيص، بمكان واحد وبتجربة ميسّرة.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest text-muted-foreground mb-3">المنصة</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/activities" className="hover:text-primary transition">الأنشطة</Link></li>
              <li><Link to="/licenses" className="hover:text-primary transition">التراخيص</Link></li>
              <li><Link to="/applications" className="hover:text-primary transition">طلباتي</Link></li>
              <li><Link to="/regulations" className="hover:text-primary transition">الأنظمة والتشريعات</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest text-muted-foreground mb-3">تواصل معنا</div>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">الدعم: 920000000</li>
              <li className="text-muted-foreground">care@naseer.sa</li>
              <li className="text-muted-foreground">الرياض، المملكة العربية السعودية</li>
            </ul>
          </div>
        </div>
        <div className="relative border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <div>© {new Date().getFullYear()} نسير — جميع الحقوق محفوظة.</div>
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              صنع بـ <Heart className="w-3 h-3 fill-primary text-primary" /> في المملكة
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
