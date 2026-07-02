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


export type Regulation = {
  id: string;
  title: string;
  authority: string;
  date: string;
  summary: string;
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
    date: "٢٠٢٦/٠٥/١٤",
    summary:
      "توحيد السجل التجاري لكل الأنشطة تحت رقم واحد، مع إلغاء الحاجة لتجديد الفروع بشكل منفصل.",
    url: "https://mc.gov.sa",
  },
  {
    id: "2",
    title: "تسهيلات جديدة لتراخيص المنشآت الغذائية",
    authority: "هيئة الغذاء والدواء",
    date: "٢٠٢٦/٠٤/٠٢",
    summary: "تقليل مدة إصدار ترخيص سلامة الغذاء إلى ٧ أيام عمل، مع منصة رقمية موحدة.",
    url: "https://sfda.gov.sa",
  },
  {
    id: "3",
    title: "منصة بلدي: خدمات جديدة للرخص البلدية",
    authority: "وزارة الشؤون البلدية والقروية",
    date: "٢٠٢٦/٠٣/١٨",
    summary:
      "إطلاق مسار سريع لإصدار الرخص البلدية للمنشآت الصغيرة، مع دفع إلكتروني مباشر.",
    url: "https://balady.gov.sa",
  },
];

// ------- localStorage-backed demo store -------

const APPS_KEY = "naseer.applications";
const NOTIFS_KEY = "naseer.notifications";
const USER_KEY = "naseer.user";

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
  },
};

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
