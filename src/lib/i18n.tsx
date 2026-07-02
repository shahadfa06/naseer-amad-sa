import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

type Ctx = {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (l: Lang) => void;
  tr: (ar: string, en: string) => string;
};

const LangCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "naseer.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {
      // ignore
    }
  }, []);

  // Sync <html lang> and <html dir>
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  };

  const value = useMemo<Ctx>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang,
      tr: (ar, en) => (lang === "en" ? en : ar),
    }),
    [lang],
  );

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang(): Ctx {
  const v = useContext(LangCtx);
  if (!v) {
    // Safe fallback for any component rendered outside the provider (e.g. SSR shell).
    return {
      lang: "ar",
      dir: "rtl",
      setLang: () => {},
      tr: (ar) => ar,
    };
  }
  return v;
}

// ----- Data translations (Arabic-source → English) -----

export const AR_EN: Record<string, string> = {
  // Activities
  "كوفي شوب": "Coffee Shop",
  "مطعم": "Restaurant",
  "صالون نسائي": "Women's Salon",
  "سوبرماركت": "Supermarket",
  "صيدلية": "Pharmacy",
  "محل ملابس": "Clothing Store",
  "صالون": "Salon",
  "بيع تجزئة": "Retail",
  "عيادة": "Clinic",
  "مقاولات": "Contracting",
  "مقهى صغير أو سلسلة كوفي.": "Small café or coffee chain.",
  "مطعم مأكولات محلية أو عالمية.": "Local or international cuisine.",
  "مركز تجميل وخدمات نسائية.": "Beauty center and women's services.",
  "بقالة أو سوبرماركت أحياء.": "Grocery or neighborhood supermarket.",
  "بيع أدوية ومستلزمات طبية.": "Sale of medicine and medical supplies.",
  "بيع تجزئة للأزياء والإكسسوارات.": "Retail of fashion and accessories.",

  // Licenses
  "السجل التجاري": "Commercial Registration",
  "رخصة بلدية": "Municipal License",
  "عضوية الغرفة التجارية": "Chamber of Commerce Membership",
  "شهادة صحية للعاملين": "Health Certificate for Workers",
  "ترخيص سلامة غذائية": "Food Safety License",
  "موافقة الدفاع المدني": "Civil Defense Approval",
  "ترخيص مزاولة مهنة": "Professional Practice License",
  "ترخيص صيدلية": "Pharmacy License",
  "توثيق نشاط تجاري في معروف": "Business Verification on Maroof",

  // Authorities
  "وزارة التجارة": "Ministry of Commerce",
  "أمانة المنطقة (البلدية)": "Regional Municipality",
  "أمانة المنطقة": "Regional Municipality",
  "الغرفة التجارية السعودية": "Saudi Chamber of Commerce",
  "وزارة الصحة": "Ministry of Health",
  "هيئة الغذاء والدواء (SFDA)": "Saudi Food & Drug Authority (SFDA)",
  "هيئة الغذاء والدواء": "Saudi Food & Drug Authority",
  "المديرية العامة للدفاع المدني": "General Directorate of Civil Defense",
  "وزارة الشؤون البلدية والقروية": "Ministry of Municipal & Rural Affairs",

  // Costs / durations
  "١٬٢٠٠ ر.س / سنة": "SAR 1,200 / year",
  "٨٠٠ – ٢٬٥٠٠ ر.س": "SAR 800 – 2,500",
  "٥٠٠ ر.س / سنة": "SAR 500 / year",
  "١٠٠ ر.س للعامل": "SAR 100 per worker",
  "١٬٥٠٠ ر.س": "SAR 1,500",
  "٦٠٠ ر.س": "SAR 600",
  "٧٠٠ ر.س": "SAR 700",
  "٣٬٠٠٠ ر.س": "SAR 3,000",
  "مجاناً": "Free",
  "١ – ٣ أيام عمل": "1 – 3 business days",
  "٥ – ١٠ أيام عمل": "5 – 10 business days",
  "يوم عمل واحد": "1 business day",
  "٢ – ٥ أيام": "2 – 5 days",
  "١٠ – ١٥ يوم عمل": "10 – 15 business days",
  "٧ أيام عمل": "7 business days",
  "٥ أيام عمل": "5 business days",
  "٣٠ يوم عمل": "30 business days",
  "نفس اليوم": "Same day",

  // Statuses
  "قيد المعالجة": "Processing",
  "بانتظار استكمال البيانات": "Awaiting Info",
  "تمت الموافقة": "Approved",
  "تم الإصدار": "Issued",
  "مرفوض": "Rejected",

  // Regulations
  "تحديث نظام السجل التجاري لعام 2026": "2026 Commercial Registration System Update",
  "تسهيلات جديدة لتراخيص المنشآت الغذائية": "New Facilitations for Food Facility Licenses",
  "منصة بلدي: خدمات جديدة للرخص البلدية": "Balady Platform: New Municipal License Services",
  "توحيد السجل التجاري لكل الأنشطة تحت رقم واحد، مع إلغاء الحاجة لتجديد الفروع بشكل منفصل.":
    "Unified commercial registration for all activities under a single number, removing separate branch renewals.",
  "تقليل مدة إصدار ترخيص سلامة الغذاء إلى ٧ أيام عمل، مع منصة رقمية موحدة.":
    "Food safety license issuance reduced to 7 business days via a unified digital platform.",
  "إطلاق مسار سريع لإصدار الرخص البلدية للمنشآت الصغيرة، مع دفع إلكتروني مباشر.":
    "Launch of a fast-track municipal license path for small businesses with instant online payment.",
};

export function localize(lang: Lang, ar: string): string {
  if (lang === "ar") return ar;
  return AR_EN[ar] ?? ar;
}
