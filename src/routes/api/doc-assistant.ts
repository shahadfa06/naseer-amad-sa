import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type Action = "generate" | "review" | "validate" | "suggest";

type Body = {
  action?: Action;
  licenseName?: string;
  authority?: string;
  documentName?: string;
  documentContent?: string;
  requirements?: string[];
  userInfo?: Record<string, string>;
  lang?: "ar" | "en";
};

const SYSTEM = `You are Naseer's AI Document Assistant for Saudi business licensing. You help entrepreneurs prepare, review and validate official documents required by Saudi government authorities (Ministry of Commerce, Balady, SFDA, Civil Defense, MoH, Chamber of Commerce, Maroof).

Rules:
- Reply in the same language as the user's request (Arabic or English). Default to Arabic.
- Be precise, concise, and use markdown.
- Never fabricate official templates or article numbers; when unsure, state that verified information is unavailable and recommend consulting the official authority.
- For "generate": produce a clean, professional draft document with clear sections and placeholders like [الاسم] where actual values are missing.
- For "review": return a structured markdown checklist covering: Missing attachments, Expired items, Formatting issues, Inconsistent information, Improvement suggestions. Include an overall verdict (Pass / Needs work / Fail).
- For "validate": determine if the document satisfies the listed official requirements. Return a checklist with ✅/❌ per requirement and a final compliance percentage.
- For "suggest": return a short bullet list of concrete improvement suggestions.`;

function buildPrompt(b: Body): string {
  const lang = b.lang === "en" ? "English" : "Arabic";
  const base = `License: ${b.licenseName ?? "N/A"}\nAuthority: ${b.authority ?? "N/A"}\nDocument: ${b.documentName ?? "N/A"}\nRespond in: ${lang}\n`;
  const reqs = b.requirements?.length ? `\nOfficial requirements:\n- ${b.requirements.join("\n- ")}\n` : "";
  const user = b.userInfo && Object.keys(b.userInfo).length
    ? `\nApplicant info:\n${Object.entries(b.userInfo).map(([k, v]) => `- ${k}: ${v}`).join("\n")}\n`
    : "";
  const content = b.documentContent ? `\nCurrent document content:\n"""\n${b.documentContent}\n"""\n` : "";

  switch (b.action) {
    case "generate":
      return `${base}${reqs}${user}\nTask: Generate a professional draft of the "${b.documentName}" document ready to be submitted to ${b.authority}. Use placeholders for missing applicant data. Output only the document body in markdown.`;
    case "review":
      return `${base}${reqs}${content}\nTask: Review the document. Return a markdown report with sections: Missing attachments, Expired items, Formatting issues, Inconsistent information, Improvement suggestions, Overall verdict.`;
    case "validate":
      return `${base}${reqs}${content}\nTask: Check whether the document satisfies each official requirement. Return a checklist (✅/❌ requirement — short reason) then "Compliance: NN%".`;
    case "suggest":
      return `${base}${reqs}${content}\nTask: Provide 3-6 concrete suggestions to improve this document for official submission. Bullet list only.`;
    default:
      return `${base}${content}\nTask: Help the user with their document.`;
  }
}

export const Route = createFileRoute("/api/doc-assistant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Body;
        try { body = (await request.json()) as Body; } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
        if (!body.action) return Response.json({ error: "action required" }, { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return Response.json({ error: "Missing LOVABLE_API_KEY" }, { status: 500 });

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const { text } = await generateText({
            model: gateway("openai/gpt-5.5"),
            system: SYSTEM,
            prompt: buildPrompt(body),
            providerOptions: { lovable: { service_tier: "priority" } },
          });
          return Response.json({ text });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "AI error";
          const status = /rate|429/i.test(msg) ? 429 : /402|credit/i.test(msg) ? 402 : 500;
          return Response.json({ error: msg }, { status });
        }
      },
    },
  },
});
