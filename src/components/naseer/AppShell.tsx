import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Bot, FileText, Globe, Heart, Home, LayoutGrid, Moon, Newspaper, ScrollText, ShieldCheck, Sun } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "./brand";
import { ChatWidget } from "./ChatWidget";
import patternUrl from "@/assets/pattern.png";
import { useLang } from "@/lib/i18n";
import { store } from "@/lib/naseer-data";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { lang, setLang, tr } = useLang();
  const [unread, setUnread] = useState(0);
  const theme = "light" as const;
  const setTheme = (_: "light" | "dark") => {};

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    try { localStorage.setItem("naseer:theme", "light"); } catch {}
  }, []);


  useEffect(() => {
    const refresh = () => setUnread(store.getUnreadCount());
    refresh();
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener("naseer:updated", onStorage);
    const t = setInterval(refresh, 4000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("naseer:updated", onStorage);
      clearInterval(t);
    };
  }, [pathname]);


  const NAV = [
    { to: "/", label: tr("الرئيسية", "Home"), icon: Home },
    { to: "/activities", label: tr("الأنشطة", "Activities"), icon: LayoutGrid },
    { to: "/licenses", label: tr("التراخيص", "Licenses"), icon: ScrollText },
    { to: "/applications", label: tr("طلباتي", "My Applications"), icon: FileText },
    { to: "/notifications", label: tr("الإشعارات", "Notifications"), icon: Bell },
    { to: "/regulations", label: tr("الأنظمة", "Regulations"), icon: Newspaper },
  ] as const;

  const LangSwitcher = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-card ${
        compact ? "p-0.5" : "p-1"
      } shadow-soft`}
      role="group"
      aria-label={tr("تبديل اللغة", "Language switcher")}
    >
      <Globe className={`${compact ? "w-3.5 h-3.5 mx-1.5" : "w-4 h-4 mx-2"} text-muted-foreground`} />
      <button
        onClick={() => setLang("ar")}
        className={`px-2.5 ${compact ? "py-0.5 text-[11px]" : "py-1 text-xs"} rounded-full font-semibold transition ${
          lang === "ar" ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={lang === "ar"}
        lang="ar"
      >
        العربية
      </button>
      <span className="text-muted-foreground/50 text-xs" aria-hidden>|</span>
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 ${compact ? "py-0.5 text-[11px]" : "py-1 text-xs"} rounded-full font-semibold transition ${
          lang === "en" ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={lang === "en"}
        lang="en"
      >
        English
      </button>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-background flex flex-col relative"
      style={{ ["--pattern-url" as string]: `url(${patternUrl})` } as React.CSSProperties}
    >
      <div className="aurora-bg" aria-hidden />

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
            <span>
              {tr(
                "منصة رقمية سعودية • مستوحاة من رؤية 2030",
                "A Saudi digital platform • Inspired by Vision 2030",
              )}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 opacity-80">
            <span>{tr("الدعم 920000000", "Support 920000000")}</span>
            <span aria-hidden>·</span>
            <span>{lang === "ar" ? "AR" : "EN"}</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
<Logo size={104} />

            <div className="leading-tight">
              <div className="font-display font-extrabold text-lg" style={{ color: "var(--saudi-ink)" }}>
                {tr("نسير", "Naseer")}
              </div>
              <div className="text-[10px] tracking-[0.28em] text-muted-foreground font-semibold">
                {tr("NASEER", "نسير")}
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

          <div className="ms-auto lg:ms-0 flex items-center gap-2">
            <div className="hidden md:block">
              <LangSwitcher />
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/40 hover:shadow-soft transition"
              aria-label={tr("تبديل الوضع", "Toggle theme")}
              title={theme === "dark" ? tr("الوضع النهاري", "Light mode") : tr("الوضع الليلي", "Dark mode")}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              to="/notifications"
              className="relative w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/40 hover:shadow-soft transition"
              aria-label={tr("الإشعارات", "Notifications")}
            >
              <Bell className="w-4 h-4" />
              {unread > 0 && (
                <span className="absolute -top-1 -start-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-background">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>


            <Link
              to="/register"
              className="hidden sm:inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 hover:shadow-soft transition"
            >
              {tr("تسجيل دخول", "Sign In")}
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
            <div className="ms-2 md:hidden">
              <LangSwitcher compact />
            </div>
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
              <Logo />
              <div>
                <div className="font-display font-bold text-lg">{tr("نسير · Naseer", "Naseer · نسير")}</div>
                <div className="text-xs text-muted-foreground">
                  {tr("مع نسير… طريقك يسير", "With Naseer… your path is smooth")}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              {tr(
                "منصة رقمية سعودية توحّد رحلة رواد الأعمال — من اختيار النشاط لين إصدار التراخيص، بمكان واحد وبتجربة ميسّرة.",
                "A Saudi digital platform unifying the entrepreneur's journey — from choosing an activity to issuing licenses, in one seamless experience.",
              )}
            </p>
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest text-muted-foreground mb-3">
              {tr("المنصة", "PLATFORM")}
            </div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/activities" className="hover:text-primary transition">{tr("الأنشطة", "Activities")}</Link></li>
              <li><Link to="/licenses" className="hover:text-primary transition">{tr("التراخيص", "Licenses")}</Link></li>
              <li><Link to="/applications" className="hover:text-primary transition">{tr("طلباتي", "My Applications")}</Link></li>
              <li><Link to="/regulations" className="hover:text-primary transition">{tr("الأنظمة والتشريعات", "Regulations & Laws")}</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest text-muted-foreground mb-3">
              {tr("تواصل معنا", "CONTACT US")}
            </div>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">{tr("الدعم: 920000000", "Support: 920000000")}</li>
              <li className="text-muted-foreground">care@naseer.sa</li>
              <li className="text-muted-foreground">{tr("الرياض، المملكة العربية السعودية", "Riyadh, Kingdom of Saudi Arabia")}</li>
            </ul>
          </div>
        </div>
        <div className="relative border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <div>
              © {new Date().getFullYear()} {tr("نسير — جميع الحقوق محفوظة.", "Naseer — All rights reserved.")}
            </div>
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              {tr("صنع بـ", "Made with")} <Heart className="w-3 h-3 fill-primary text-primary" /> {tr("في المملكة", "in the Kingdom")}
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
