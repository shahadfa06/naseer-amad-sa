import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Bot, FileText, Heart, Home, LayoutGrid, Newspaper, ScrollText } from "lucide-react";
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
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/85 border-b border-border">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <Logo size={38} />
            <div className="leading-tight">
              <div className="font-display font-bold text-lg">نسير</div>
              <div className="text-[10px] tracking-widest text-muted-foreground">NASEER</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 mx-auto">
            {NAV.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-semibold"
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
              className="relative w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/40 transition"
              aria-label="الإشعارات"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-primary" />
            </Link>
            <Link
              to="/register"
              className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
            >
              تسجيل ودخول
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
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground"
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

      <footer className="relative border-t border-border bg-card mt-16">
        <div className="absolute inset-0 pattern-bg opacity-[0.05]" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <div className="font-display font-bold">نسير · Naseer</div>
              <div className="text-xs text-muted-foreground">مع نسير… طريقك يسير 🇸🇦</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5" />
            صنع بـ <Heart className="w-3.5 h-3.5 fill-primary text-primary" /> في المملكة العربية السعودية
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
