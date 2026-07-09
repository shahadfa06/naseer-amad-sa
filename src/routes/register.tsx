import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, User, IdCard, Calendar, Mail, Phone, Fingerprint, Loader2, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/naseer/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { store } from "@/lib/naseer-data";
import { Logo } from "@/components/naseer/brand";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "تسجيل ودخول | Sign In · نسير" },
      { name: "description", content: "سجّل حسابك في نسير بشكل آمن، وابدأ رحلة مشروعك." },
    ],
  }),
  component: RegisterPage,
});

function Field({
  id,
  label,
  icon: Icon,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const { dir } = useLang();
  const isRtl = dir === "rtl";
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <div className="relative">
        <Icon
          className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`}
        />
        <Input
          id={id}
          className={`${isRtl ? "pr-9 text-right" : "pl-9 text-left"} h-12 rounded-xl`}
          {...rest}
        />
      </div>
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const { tr } = useLang();
  const [form, setForm] = useState({
    fullName: "",
    nationalId: "",
    dob: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [nafathOpen, setNafathOpen] = useState(false);
  const [nafathId, setNafathId] = useState("");
  const [nafathStage, setNafathStage] = useState<"idle" | "sending" | "waiting" | "verified">("idle");
  const [nafathCode, setNafathCode] = useState<number | null>(null);

  const upd =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const startNafath = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(nafathId)) return;
    setNafathStage("sending");
    const code = Math.floor(10 + Math.random() * 90);
    setTimeout(() => {
      setNafathCode(code);
      setNafathStage("waiting");
      setTimeout(() => {
        setNafathStage("verified");
        setForm((f) => ({ ...f, nationalId: nafathId, fullName: f.fullName || tr("مستخدم نفاذ", "Nafath User") }));
        store.setUser({ fullName: tr("مستخدم نفاذ", "Nafath User"), nationalId: nafathId, dob: "", email: "", phone: "" });
        store.addNotification({
          title: tr("تم التحقق عبر نفاذ", "Verified via Nafath"),
          body: tr("تم التحقق من هويتك بنجاح.", "Your identity has been verified successfully."),
        });
        setTimeout(() => navigate({ to: "/activities" }), 900);
      }, 2200);
    }, 900);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    store.setUser(form);
    store.addNotification({
      title: tr("تم إنشاء حسابك", "Your account is ready"),
      body: tr(
        `أهلاً ${form.fullName || ""}، حيّاك الله في نسير.`,
        `Welcome ${form.fullName || ""} to Naseer.`,
      ),
    });
    setTimeout(() => navigate({ to: "/activities" }), 400);
  };

  return (
    <AppShell>
      <section className="relative py-14">
        <div className="absolute inset-0 -z-10 pattern-bg opacity-[0.08]" aria-hidden />
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--beige) 55%, white) 0%, white 60%)",
          }}
        />
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <Logo size={190} />
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary mb-3">
              <ShieldCheck className="w-4 h-4" />
              {tr("تسجيل آمن", "Secure sign-in")}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {tr("ابدأ رحلتك", "Start your journey")}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {tr("حيّاك الله 👋 — عطنا بياناتك ونسير معك.", "Welcome 👋 — share your details and we'll walk with you.")}
            </p>
          </div>

          <Card className="rounded-3xl overflow-hidden shadow-card">
            <div className="h-1.5 w-full bg-gradient-to-l from-primary via-[var(--gold)] to-[var(--sky-soft)]" />
            <CardHeader className="pt-7 pb-2">
              <CardTitle className="font-display text-xl">
                {tr("تسجيل ودخول", "Sign up & Sign in")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-7">
              <div className="mb-6 rounded-2xl border border-border bg-[color-mix(in_oklab,var(--beige)_50%,white)] p-4">
                {!nafathOpen && (
                  <button
                    type="button"
                    onClick={() => setNafathOpen(true)}
                    className="w-full flex items-center justify-center gap-2.5 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 hover:shadow-soft transition"
                  >
                    <Fingerprint className="w-5 h-5" />
                    {tr("الدخول عبر نفاذ", "Sign in with Nafath")}
                  </button>
                )}
                {nafathOpen && nafathStage !== "verified" && (
                  <form onSubmit={startNafath} className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <Fingerprint className="w-4 h-4" />
                      {tr("التحقق عبر نفاذ", "Verify with Nafath")}
                    </div>
                    <Field
                      id="nafath-nid"
                      label={tr("رقم الهوية الوطنية / الإقامة", "National ID / Iqama")}
                      icon={IdCard}
                      inputMode="numeric"
                      maxLength={10}
                      value={nafathId}
                      onChange={(e) => setNafathId(e.target.value.replace(/\D/g, ""))}
                      placeholder="10xxxxxxxx"
                      dir="ltr"
                      disabled={nafathStage !== "idle"}
                    />
                    {nafathStage === "idle" && (
                      <Button type="submit" className="w-full h-11 rounded-xl" disabled={!/^\d{10}$/.test(nafathId)}>
                        {tr("إرسال طلب التحقق", "Send verification request")}
                      </Button>
                    )}
                    {nafathStage === "sending" && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {tr("جاري الإرسال إلى تطبيق نفاذ...", "Sending to Nafath app...")}
                      </div>
                    )}
                    {nafathStage === "waiting" && nafathCode !== null && (
                      <div className="text-center space-y-2 py-2">
                        <div className="text-xs text-muted-foreground">
                          {tr("افتح تطبيق نفاذ واختر الرقم", "Open the Nafath app and select the number")}
                        </div>
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-soft">
                          {nafathCode}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          {tr("بانتظار التأكيد...", "Waiting for confirmation...")}
                        </div>
                      </div>
                    )}
                  </form>
                )}
                {nafathStage === "verified" && (
                  <div className="flex items-center justify-center gap-2 text-primary font-semibold py-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {tr("تم التحقق بنجاح", "Successfully verified")}
                  </div>
                )}
              </div>
              <div className="relative mb-6 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <span className="relative bg-card px-3 text-xs text-muted-foreground">
                  {tr("أو أكمل بالبيانات", "or continue with details")}
                </span>
              </div>
              <form onSubmit={submit} className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Field
                    id="name"
                    label={tr("الاسم الكامل", "Full name")}
                    icon={User}
                    required
                    value={form.fullName}
                    onChange={upd("fullName")}
                    placeholder={tr("مثال: محمد بن عبدالله", "e.g. Mohammed Al-Otaibi")}
                  />
                </div>
                <Field
                  id="nid"
                  label={tr("رقم الهوية الوطنية / الإقامة", "National ID / Iqama")}
                  icon={IdCard}
                  required
                  inputMode="numeric"
                  value={form.nationalId}
                  onChange={upd("nationalId")}
                  placeholder={tr("١٠xxxxxxxx", "10xxxxxxxx")}
                />
                <Field
                  id="dob"
                  label={tr("تاريخ الميلاد", "Date of birth")}
                  icon={Calendar}
                  type="date"
                  required
                  value={form.dob}
                  onChange={upd("dob")}
                />
                <Field
                  id="email"
                  label={tr("البريد الإلكتروني", "Email")}
                  icon={Mail}
                  type="email"
                  required
                  value={form.email}
                  onChange={upd("email")}
                  placeholder="name@email.com"
                  dir="ltr"
                />
                <Field
                  id="phone"
                  label={tr("رقم الجوال", "Mobile number")}
                  icon={Phone}
                  type="tel"
                  required
                  value={form.phone}
                  onChange={upd("phone")}
                  placeholder="+9665xxxxxxxx"
                  dir="ltr"
                />

                <div className="md:col-span-2 flex items-start gap-2 p-4 rounded-2xl bg-[color-mix(in_oklab,var(--sky-soft)_45%,white)] border border-border text-xs text-foreground/80 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  {tr(
                    "تستخدم بياناتك لربط معاملاتك مع الجهات الحكومية بشكل آمن.",
                    "Your data is used to securely link your transactions with government authorities.",
                  )}
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" size="lg" disabled={loading} className="w-full h-12 rounded-2xl">
                    {loading
                      ? tr("جاري الدخول...", "Signing in...")
                      : tr("تسجيل ودخول", "Sign up & Sign in")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
