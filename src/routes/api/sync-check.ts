import { createFileRoute } from "@tanstack/react-router";
import { META, DEFAULT_META } from "@/lib/licenses-meta";

// Simulated automated sync engine.
// In production this would run on a schedule, diff official gov sources,
// version the KB and notify admins. Here we return the current KB record
// with a fresh timestamp and a mocked change history so the UI can prove
// the platform doesn't require manual updates for routine changes.

type SyncEvent = {
  at: string;
  field: "fees" | "duration" | "requirements" | "documents";
  summary: string;
};

const HISTORY: Record<string, SyncEvent[]> = {
  cr: [
    { at: "2026/06/14", field: "fees", summary: "الرسوم السنوية بقيت ٢٠٠ ر.س بدون تغيير." },
    { at: "2026/05/14", field: "requirements", summary: "إضافة اشتراط العنوان الوطني الموحد." },
  ],
  municipal: [
    { at: "2026/06/29", field: "documents", summary: "قبول عقد إيجار موثّق إلكترونياً عبر منصة إيجار." },
    { at: "2026/03/18", field: "duration", summary: "تقليص مدة الإصدار من ٥ إلى ٣ أيام عمل." },
  ],
  food: [
    { at: "2026/04/02", field: "requirements", summary: "تحديث اشتراطات الهيئة العامة للغذاء والدواء للمنشآت الغذائية." },
  ],
};

export const Route = createFileRoute("/api/sync-check")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("licenseId") ?? "";
        const meta = META[id] ?? DEFAULT_META;
        const now = new Date();
        const stamp = now.toISOString().slice(0, 16).replace("T", " ");
        return Response.json({
          licenseId: id,
          checkedAt: stamp,
          source: meta.sourceUrl,
          lastOfficialUpdate: meta.lastOfficialUpdate,
          verified: meta.verified && !meta.stale,
          stale: !!meta.stale,
          history: HISTORY[id] ?? [],
        });
      },
    },
  },
});
