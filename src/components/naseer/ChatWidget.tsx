import { useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/i18n";

type ChatMessage = { role: "user" | "bot"; text: string };

export function ChatWidget() {
  const { lang, tr } = useLang();
  const [open, setOpen] = useState(false);

  const greeting = tr(
    "حيّاك الله 👋 أنا مساعد نسير. إذا عندك أي استفسار عن مشروعك أو التراخيص أو الإجراءات الحكومية، أنا حاضر وبنمشي معك خطوة بخطوة.",
    "Hello 👋 I'm the Naseer Assistant. Ask me anything about your business, licenses, or government procedures — I'll walk you through it step by step.",
  );
  const botReply = tr(
    "تمام 👌 خلّ الباقي علينا — نجيبك خطوة خطوة. (هذي إجابة تجريبية، في النسخة الكاملة بنوصلك بمساعد ذكي.)",
    "Got it 👌 leave the rest to us — we'll guide you step by step. (This is a demo reply; the full version connects to an AI assistant.)",
  );
  const suggestions =
    lang === "en"
      ? [
          "I want to open a coffee shop. Where do I start?",
          "How much is the commercial registration fee?",
          "Where do I apply?",
          "What's the status of my application?",
        ]
      : [
          "أبي أفتح كوفي. وش أول خطوة؟",
          "كم رسوم السجل التجاري؟",
          "وين أقدم؟",
          "وش حالة طلبي؟",
        ];

  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "bot", text: greeting }]);
  const [input, setInput] = useState("");

  // Refresh greeting when language changes (only if no user interaction yet)
  if (messages.length === 1 && messages[0].role === "bot" && messages[0].text !== greeting) {
    setMessages([{ role: "bot", text: greeting }]);
  }

  const send = (text: string) => {
    const v = text.trim();
    if (!v) return;
    setMessages((m) => [...m, { role: "user", text: v }, { role: "bot", text: botReply }]);
    setInput("");
  };

  const posClass = lang === "en" ? "right-6" : "left-6";
  const panelPos = lang === "en" ? "right-6 left-6 sm:left-auto sm:w-[380px]" : "left-6 right-6 sm:right-auto sm:w-[380px]";

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={tr("مساعد نسير", "Naseer Assistant")}
        className={`fixed bottom-6 ${posClass} z-40 group`}
      >
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        <span className="relative flex items-center gap-2 h-14 px-5 rounded-full bg-primary text-primary-foreground shadow-card hover:scale-105 transition-transform">
          {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          <span className="font-semibold text-sm hidden sm:inline">{tr("مساعد نسير", "Naseer Assistant")}</span>
        </span>
      </button>

      {open && (
        <div className={`fixed bottom-24 ${panelPos} z-40 animate-fade-in`}>
          <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden flex flex-col max-h-[70vh]">
            <div
              className="relative px-5 py-4 text-white"
              style={{ background: "linear-gradient(135deg, var(--saudi) 0%, var(--saudi-deep) 100%)" }}
            >
              <div className="absolute inset-0 pattern-bg opacity-20" aria-hidden />
              <div className="relative flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-bold">{tr("مساعد نسير", "Naseer Assistant")}</div>
                  <div className="text-xs opacity-80">
                    {tr("مع نسير… طريقك يسير", "With Naseer… your path is smooth")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[85%] text-sm leading-relaxed px-4 py-2.5 rounded-2xl ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-bl-sm"
                        : "bg-white border border-border rounded-br-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {messages.length <= 1 && (
                <div className="pt-2 space-y-2">
                  <div className="text-[11px] text-muted-foreground px-1">
                    {tr("أسئلة مقترحة:", "Suggested questions:")}
                  </div>
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="block w-full text-start text-xs px-3 py-2 rounded-xl border border-border bg-white hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-border bg-card flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={tr("اكتب سؤالك…", "Type your question…")}
                className="h-10 rounded-xl text-start"
              />
              <Button type="submit" size="icon" className="h-10 w-10 rounded-xl shrink-0">
                <Send className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
