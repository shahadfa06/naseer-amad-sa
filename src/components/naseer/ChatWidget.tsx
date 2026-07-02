import { useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatMessage = { role: "user" | "bot"; text: string };

const SUGGESTIONS = [
  "أبي أفتح كوفي. وش أول خطوة؟",
  "كم رسوم السجل التجاري؟",
  "وين أقدم؟",
  "وش حالة طلبي؟",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "حيّاك الله 👋 أنا مساعد نسير. إذا عندك أي استفسار عن مشروعك أو التراخيص أو الإجراءات الحكومية، أنا حاضر وبنمشي معك خطوة بخطوة.",
    },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    const v = text.trim();
    if (!v) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: v },
      {
        role: "bot",
        text: "تمام 👌 خلّ الباقي علينا — نجيبك خطوة خطوة. (هذي إجابة تجريبية، في النسخة الكاملة بنوصلك بمساعد ذكي.)",
      },
    ]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="مساعد نسير"
        className="fixed bottom-6 left-6 z-40 group"
      >
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        <span className="relative flex items-center gap-2 h-14 px-5 rounded-full bg-primary text-primary-foreground shadow-card hover:scale-105 transition-transform">
          {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          <span className="font-semibold text-sm hidden sm:inline">مساعد نسير</span>
        </span>
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 right-6 sm:right-auto sm:w-[380px] z-40 animate-fade-in">
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
                  <div className="font-display font-bold">مساعد نسير</div>
                  <div className="text-xs opacity-80">مع نسير… طريقك يسير</div>
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
                  <div className="text-[11px] text-muted-foreground px-1">أسئلة مقترحة:</div>
                  {SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="block w-full text-right text-xs px-3 py-2 rounded-xl border border-border bg-white hover:border-primary/40 hover:bg-primary/5 transition-colors"
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
                placeholder="اكتب سؤالك…"
                className="h-10 rounded-xl text-right"
              />
              <Button type="submit" size="icon" className="h-10 w-10 rounded-xl shrink-0">
                <Send className="w-4 h-4 rotate-180" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
