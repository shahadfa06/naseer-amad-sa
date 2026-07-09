export type License = {
  id: string;
  name: string;
  authority: string;
  authorityUrl: string;
  cost: string;
  duration: string;
};

export type Activity = {
  id: string;
  name: string;
  emoji: string;
  desc: string;
};

export type Application = {
  id: string;
  licenseId: string;
  licenseName: string;
  authority: string;
  submittedAt: string;
  status: "processing" | "awaiting" | "approved" | "issued" | "rejected";
};

export type NotificationKind = "success" | "reminder" | "urgent" | "ai" | "info";

export type Notification = {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  kind?: NotificationKind;
  emoji?: string;
};


export type RegulationCategory =
  | "new_regulation"
  | "fees_update"
  | "requirements_update"
  | "new_service"
  | "service_modification"
  | "form_update"
  | "procedure_update"
  | "circular"
  | "announcement";

export type Regulation = {
  id: string;
  title: string;
  authority: string;
  authorityUrl: string;
  category: RegulationCategory;
  date: string;
  publicationDate: string;
  effectiveDate: string;
  lastSyncAt: string;
  verified: boolean;
  summary: string;
  fullAnnouncement: string;
  url: string;
};

export const ACTIVITIES: Activity[] = [
  { id: "coffee", name: "كوفي شوب", emoji: "☕", desc: "مقهى صغير أو سلسلة كوفي." },
  { id: "restaurant", name: "مطعم", emoji: "🍽️", desc: "مطعم مأكولات محلية أو عالمية." },
  { id: "salon", name: "صالون نسائي", emoji: "💇‍♀️", desc: "مركز تجميل وخدمات نسائية." },
  { id: "supermarket", name: "سوبرماركت", emoji: "🛒", desc: "بقالة أو سوبرماركت أحياء." },
  { id: "pharmacy", name: "صيدلية", emoji: "💊", desc: "بيع أدوية ومستلزمات طبية." },
  { id: "clothing", name: "محل ملابس", emoji: "👗", desc: "بيع تجزئة للأزياء والإكسسوارات." },
];

const BASE: License[] = [
  {
    id: "cr",
    name: "السجل التجاري",
    authority: "وزارة التجارة",
    authorityUrl: "https://mc.gov.sa",
    cost: "١٬٢٠٠ ر.س / سنة",
    duration: "١ – ٣ أيام عمل",
  },
  {
    id: "municipal",
    name: "رخصة بلدية",
    authority: "أمانة المنطقة (البلدية)",
    authorityUrl: "https://balady.gov.sa",
    cost: "٨٠٠ – ٢٬٥٠٠ ر.س",
    duration: "٥ – ١٠ أيام عمل",
  },
  {
    id: "chamber",
    name: "عضوية الغرفة التجارية",
    authority: "الغرفة التجارية السعودية",
    authorityUrl: "https://fsc.org.sa",
    cost: "٥٠٠ ر.س / سنة",
    duration: "يوم عمل واحد",
  },
];

export function getLicensesFor(activityId: string): License[] {
  const list = [...BASE];
  if (activityId === "coffee" || activityId === "restaurant") {
    list.push(
      {
        id: "health",
        name: "شهادة صحية للعاملين",
        authority: "وزارة الصحة",
        authorityUrl: "https://moh.gov.sa",
        cost: "١٠٠ ر.س للعامل",
        duration: "٢ – ٥ أيام",
      },
      {
        id: "food",
        name: "ترخيص سلامة غذائية",
        authority: "هيئة الغذاء والدواء (SFDA)",
        authorityUrl: "https://sfda.gov.sa",
        cost: "١٬٥٠٠ ر.س",
        duration: "١٠ – ١٥ يوم عمل",
      },
      {
        id: "civil",
        name: "موافقة الدفاع المدني",
        authority: "المديرية العامة للدفاع المدني",
        authorityUrl: "https://998.gov.sa",
        cost: "٦٠٠ ر.س",
        duration: "٧ أيام عمل",
      },
    );
  }
  if (activityId === "salon") {
    list.push({
      id: "profession",
      name: "ترخيص مزاولة مهنة",
      authority: "أمانة المنطقة",
      authorityUrl: "https://balady.gov.sa",
      cost: "٧٠٠ ر.س",
      duration: "٥ أيام عمل",
    });
  }
  if (activityId === "pharmacy") {
    list.push({
      id: "pharma",
      name: "ترخيص صيدلية",
      authority: "وزارة الصحة",
      authorityUrl: "https://moh.gov.sa",
      cost: "٣٬٠٠٠ ر.س",
      duration: "٣٠ يوم عمل",
    });
  }
  if (activityId === "supermarket" || activityId === "clothing") {
    list.push({
      id: "maroof",
      name: "توثيق نشاط تجاري في معروف",
      authority: "وزارة التجارة",
      authorityUrl: "https://maroof.sa",
      cost: "مجاناً",
      duration: "نفس اليوم",
    });
  }
  return list;
}

export const REGULATIONS: Regulation[] = [
  {
    id: "1",
    title: "تحديث نظام السجل التجاري لعام 2026",
    authority: "وزارة التجارة",
    authorityUrl: "https://mc.gov.sa",
    category: "new_regulation",
    date: "٢٠٢٦/٠٥/١٤",
    publicationDate: "٢٠٢٦/٠٥/١٤",
    effectiveDate: "٢٠٢٦/٠٧/٠١",
    lastSyncAt: "٢٠٢٦/٠٦/٢٩ ١٠:١٢",
    verified: true,
    summary:
      "توحيد السجل التجاري لكل الأنشطة تحت رقم واحد، مع إلغاء الحاجة لتجديد الفروع بشكل منفصل.",
    fullAnnouncement:
      "أعلنت وزارة التجارة عن تحديث نظام السجل التجاري ليصبح موحداً لجميع الأنشطة تحت رقم واحد، مع إلغاء إجراء تجديد الفروع بشكل منفصل. يسري النظام على جميع المنشآت القائمة والجديدة اعتباراً من ١ يوليو ٢٠٢٦، ويشمل ربط السجل بالعنوان الوطني الموحد وتحديث بيانات المالك تلقائياً من مصادرها الرسمية.",
    url: "https://mc.gov.sa",
  },
  {
    id: "2",
    title: "تسهيلات جديدة لتراخيص المنشآت الغذائية",
    authority: "هيئة الغذاء والدواء",
    authorityUrl: "https://sfda.gov.sa",
    category: "procedure_update",
    date: "٢٠٢٦/٠٤/٠٢",
    publicationDate: "٢٠٢٦/٠٤/٠٢",
    effectiveDate: "٢٠٢٦/٠٤/١٥",
    lastSyncAt: "٢٠٢٦/٠٦/٢٩ ١٠:١٢",
    verified: true,
    summary: "تقليل مدة إصدار ترخيص سلامة الغذاء إلى ٧ أيام عمل، مع منصة رقمية موحدة.",
    fullAnnouncement:
      "أطلقت الهيئة العامة للغذاء والدواء منصة رقمية موحّدة لإصدار تراخيص المنشآت الغذائية، مع تقليص مدة الإصدار إلى ٧ أيام عمل بدلاً من ١٥ يوماً. تشمل التسهيلات قبول التقارير المخبرية المعتمدة إلكترونياً، وربط الطلب مباشرة برخصة الدفاع المدني.",
    url: "https://sfda.gov.sa",
  },
  {
    id: "3",
    title: "منصة بلدي: خدمات جديدة للرخص البلدية",
    authority: "وزارة الشؤون البلدية والقروية",
    authorityUrl: "https://balady.gov.sa",
    category: "new_service",
    date: "٢٠٢٦/٠٣/١٨",
    publicationDate: "٢٠٢٦/٠٣/١٨",
    effectiveDate: "٢٠٢٦/٠٣/١٨",
    lastSyncAt: "٢٠٢٦/٠٦/٢٩ ١٠:١٢",
    verified: true,
    summary:
      "إطلاق مسار سريع لإصدار الرخص البلدية للمنشآت الصغيرة، مع دفع إلكتروني مباشر.",
    fullAnnouncement:
      "أطلقت منصة بلدي مساراً سريعاً لإصدار الرخص البلدية للمنشآت الصغيرة والمتوسطة، مع إمكانية الدفع الإلكتروني المباشر وربط الرخصة تلقائياً بالسجل التجاري. يشمل المسار جميع أنواع الأنشطة التجارية والخدمية منخفضة المخاطر، ولا يتطلب زيارة ميدانية مسبقة قبل الإصدار.",
    url: "https://balady.gov.sa",
  },
  {
    id: "4",
    title: "تحديث رسوم عضوية الغرف التجارية",
    authority: "اتحاد الغرف السعودية",
    authorityUrl: "https://fsc.org.sa",
    category: "fees_update",
    date: "٢٠٢٦/٠٦/١٠",
    publicationDate: "٢٠٢٦/٠٦/١٠",
    effectiveDate: "٢٠٢٦/٠٧/٠١",
    lastSyncAt: "٢٠٢٦/٠٦/٢٩ ١٠:١٢",
    verified: false,
    summary: "مراجعة شرائح رسوم اشتراك الغرف التجارية للمنشآت حسب رأس المال.",
    fullAnnouncement:
      "يجري اتحاد الغرف السعودية حالياً اعتماد تحديث لشرائح رسوم الاشتراك السنوي بناءً على رأس مال المنشأة وحجم النشاط. سيتم نشر الجدول الرسمي بعد اعتماده، ويرجى الرجوع للمصدر الرسمي للتحقق.",
    url: "https://fsc.org.sa",
  },
];

export const CATEGORY_META: Record<
  RegulationCategory,
  { ar: string; en: string; badge: string }
> = {
  new_regulation: { ar: "نظام جديد", en: "New Regulation", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  fees_update: { ar: "تحديث رسوم", en: "Fees Update", badge: "bg-amber-50 text-amber-800 border-amber-200" },
  requirements_update: { ar: "تحديث متطلبات", en: "Requirements Update", badge: "bg-orange-50 text-orange-800 border-orange-200" },
  new_service: { ar: "خدمة جديدة", en: "New Service", badge: "bg-sky-50 text-sky-800 border-sky-200" },
  service_modification: { ar: "تعديل خدمة", en: "Service Modification", badge: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  form_update: { ar: "تحديث نموذج رسمي", en: "Official Form Update", badge: "bg-purple-50 text-purple-800 border-purple-200" },
  procedure_update: { ar: "تحديث إجراء", en: "Procedure Update", badge: "bg-teal-50 text-teal-800 border-teal-200" },
  circular: { ar: "تعميم رسمي", en: "Circular", badge: "bg-slate-50 text-slate-800 border-slate-200" },
  announcement: { ar: "إعلان", en: "Announcement", badge: "bg-rose-50 text-rose-800 border-rose-200" },
};

// ------- localStorage-backed demo store -------

const APPS_KEY = "naseer.applications";
const NOTIFS_KEY = "naseer.notifications";
const USER_KEY = "naseer.user";
const ACTIVITY_KEY = "naseer.selectedActivity";

export type NaseerUser = {
  fullName: string;
  nationalId: string;
  dob: string;
  email: string;
  phone: string;
};

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function safeWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const store = {
  getUser: () => safeRead<NaseerUser | null>(USER_KEY, null),
  setUser: (u: NaseerUser) => safeWrite(USER_KEY, u),

  getSelectedActivity: () => safeRead<string | null>(ACTIVITY_KEY, null),
  setSelectedActivity: (id: string) => safeWrite(ACTIVITY_KEY, id),



  getApplications: () => safeRead<Application[]>(APPS_KEY, []),
  addApplication: (license: License) => {
    const apps = safeRead<Application[]>(APPS_KEY, []);
    const app: Application = {
      id: `APP-${Math.floor(Math.random() * 900000 + 100000)}`,
      licenseId: license.id,
      licenseName: license.name,
      authority: license.authority,
      submittedAt: new Date().toISOString(),
      status: "processing",
    };
    safeWrite(APPS_KEY, [app, ...apps]);
    store.addNotification({
      title: "تم استلام طلبك",
      body: `تم استلام طلب "${license.name}" ورقم الطلب ${app.id}.`,
    });
    return app;
  },

  getNotifications: () =>
    safeRead<Notification[]>(NOTIFS_KEY, [
      {
        id: "n0",
        title: "حيّاك الله في نسير",
        body: "جاهزين نسير معك خطوة بخطوة في مشروعك.",
        at: new Date().toISOString(),
        read: false,
        kind: "info",
        emoji: "👋",
      },
    ]),
  addNotification: (n: Omit<Notification, "id" | "at" | "read">) => {
    const list = store.getNotifications();
    const item: Notification = {
      id: `N-${Date.now()}`,
      at: new Date().toISOString(),
      read: false,
      ...n,
    };
    safeWrite(NOTIFS_KEY, [item, ...list]);
    return item;
  },
  markAllRead: () => {
    const list = store.getNotifications().map((n) => ({ ...n, read: true }));
    safeWrite(NOTIFS_KEY, list);
    // also mark all smart notifications read
    const smart = generateSmartNotifications();
    const readIds = new Set(safeRead<string[]>(SMART_READ_KEY, []));
    smart.forEach((n) => readIds.add(n.id));
    safeWrite(SMART_READ_KEY, Array.from(readIds));
  },

  getSmartNotifications: (): Notification[] => {
    const smart = generateSmartNotifications();
    const readIds = new Set(safeRead<string[]>(SMART_READ_KEY, []));
    const marked = smart.map((n) => ({ ...n, read: readIds.has(n.id) }));
    return [...marked, ...store.getNotifications()].sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
    );
  },
  getUnreadCount: (): number => store.getSmartNotifications().filter((n) => !n.read).length,
};

const SMART_READ_KEY = "naseer.smartRead";

function generateSmartNotifications(): Notification[] {
  const apps = safeRead<Application[]>(APPS_KEY, []);
  const user = safeRead<NaseerUser | null>(USER_KEY, null);
  const out: Notification[] = [];
  const now = new Date().toISOString();

  if (apps.length === 0) {
    out.push({
      id: "smart-start",
      title: "ابدأ رحلتك التجارية",
      body: "اختر نشاطك التجاري وقدّم أول طلب ترخيص خلال دقائق.",
      at: now,
      read: false,
      kind: "reminder",
      emoji: "🚀",
    });
    if (!user) {
      out.push({
        id: "smart-register",
        title: "أكمل تسجيل حسابك",
        body: "سجّل بياناتك الشخصية عشان نقدر نجهّز طلباتك بشكل أسرع.",
        at: now,
        read: false,
        kind: "urgent",
        emoji: "⚠️",
      });
    }
    return out;
  }

  const total = apps.length;
  const issued = apps.filter((a) => a.status === "issued" || a.status === "approved").length;
  const awaiting = apps.filter((a) => a.status === "awaiting");
  const processing = apps.filter((a) => a.status === "processing");
  const rejected = apps.filter((a) => a.status === "rejected");
  const progress = total > 0 ? Math.round((issued / total) * 100) : 0;

  // Missing CR
  const hasCR = apps.some((a) => a.licenseId === "cr");
  if (!hasCR) {
    out.push({
      id: "smart-cr",
      title: "لا تنسَ السجل التجاري",
      body: "لا زلت تحتاج إلى تحميل / تقديم السجل التجاري لإكمال ملف مشروعك.",
      at: now,
      read: false,
      kind: "urgent",
      emoji: "📄",
    });
  }

  // Awaiting docs
  awaiting.forEach((a) => {
    out.push({
      id: `smart-await-${a.id}`,
      title: `متطلبات ${a.licenseName} غير مكتملة`,
      body: `طلب "${a.licenseName}" ينتظر استكمال البيانات من طرفك.`,
      at: a.submittedAt,
      read: false,
      kind: "reminder",
      emoji: "📑",
    });
  });

  // Rejected
  rejected.forEach((a) => {
    out.push({
      id: `smart-rej-${a.id}`,
      title: `طلب ${a.licenseName} مرفوض`,
      body: `تم رفض الطلب. يرجى مراجعة المتطلبات وإعادة التقديم.`,
      at: a.submittedAt,
      read: false,
      kind: "urgent",
      emoji: "⚠️",
    });
  });

  // Progress
  out.push({
    id: `smart-progress-${progress}`,
    title: `أنجزت ${progress}% من رحلتك التجارية`,
    body:
      progress >= 80
        ? "ممتاز! قربت تخلّص كل التراخيص المطلوبة."
        : `أكملت ${issued} من أصل ${total} تراخيص. كمل طريقك مع نسير.`,
    at: now,
    read: false,
    kind: progress >= 80 ? "success" : "info",
    emoji: progress >= 80 ? "✅" : "📊",
  });

  // Next step recommendation
  const next = processing[0] || awaiting[0];
  if (next) {
    out.push({
      id: `smart-next-${next.id}`,
      title: `الخطوة الموصى بها: ${next.licenseName}`,
      body: `تابع طلب "${next.licenseName}" مع ${next.authority} لإنهاء الإجراء.`,
      at: now,
      read: false,
      kind: "ai",
      emoji: "🚀",
    });
  }

  // Estimated time
  if (processing.length > 0) {
    const days = Math.min(14, 3 + processing.length * 2);
    out.push({
      id: `smart-eta-${processing.length}`,
      title: `المدة المتوقعة لإنهاء طلباتك`,
      body: `على حسب حالة طلباتك، المتوقع تخلّص خلال ${days} أيام تقريباً.`,
      at: now,
      read: false,
      kind: "info",
      emoji: "⏳",
    });
  }

  // AI recommendation based on activity types
  const hasFood = apps.some((a) => ["health", "food", "civil"].includes(a.licenseId));
  if (hasFood) {
    out.push({
      id: "smart-ai-safety",
      title: "توصية ذكية من مساعد نسير",
      body: "أغلب المتقدمين لنشاطك ينسون رفع شهادة السلامة — تأكد من إرفاقها لتجنّب التأخير.",
      at: now,
      read: false,
      kind: "ai",
      emoji: "💡",
    });
  }

  return out;
}


export const STATUS_META: Record<
  Application["status"],
  { label: string; color: string; dot: string; step: number }
> = {
  processing: { label: "قيد المعالجة", color: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-500", step: 1 },
  awaiting: { label: "بانتظار استكمال البيانات", color: "bg-blue-100 text-blue-800", dot: "bg-blue-500", step: 2 },
  approved: { label: "تمت الموافقة", color: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500", step: 3 },
  issued: { label: "تم الإصدار", color: "bg-emerald-100 text-emerald-900", dot: "bg-emerald-600", step: 4 },
  rejected: { label: "مرفوض", color: "bg-red-100 text-red-800", dot: "bg-red-500", step: 0 },
};
