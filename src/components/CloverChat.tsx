import { useEffect, useRef } from "react";
import type { CloverChatProps } from "@/types";
import { P, serif, sans } from "@/constants/theme";

const QUICK_PROMPTS = [
  "I'm struggling today 🍃",
  "What should I eat?",
  "I tended a plant! 🌸",
  "Feeling overwhelmed",
] as const;

export function CloverChat({ messages, input, setInput, onSend, thinking }: CloverChatProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div style={{
      background: P.cardBg, borderRadius: "20px",
      border: `1.5px solid ${P.cardBorder}`,
      backdropFilter: "blur(10px)", overflow: "hidden",
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: "10px 14px",
        borderBottom: "1px solid rgba(240,195,210,.3)",
        display: "flex", alignItems: "center", gap: "8px",
        background: "rgba(255,245,248,.4)",
      }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%",
          background: "rgba(244,183,200,.25)",
          border: "1px solid rgba(232,144,176,.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px",
          animation: thinking ? "owlNod .7s ease-in-out infinite" : "float 4s ease-in-out infinite",
        }}>
          🦉
        </div>
        <div>
          <div style={{ fontFamily: serif, fontSize: "13px", color: P.bark2, fontStyle: "italic" }}>Clover</div>
          <div style={{ fontSize: "10px", color: P.bark3, fontFamily: sans }}>
            {thinking ? "tending thoughts…" : "garden companion"}
          </div>
        </div>

        {thinking && (
          <div style={{ marginLeft: "auto", display: "flex", gap: "3px", alignItems: "center" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: "5px", height: "5px", borderRadius: "50%", background: P.roseSoft,
                animation: `dotPulse .9s ease-in-out ${i * .18}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <div style={{
        padding: "14px", maxHeight: "220px", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: "9px",
      }}>
        {messages.map((m, i) => (
          <div key={i} className="msg" style={{
            display: "flex", alignItems: "flex-end", gap: "6px",
            flexDirection: m.role === "user" ? "row-reverse" : "row",
          }}>
            {m.role === "assistant" && (
              <div style={{
                width: "20px", height: "20px", borderRadius: "50%",
                background: "rgba(244,183,200,.3)",
                border: "1px solid rgba(232,144,176,.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", flexShrink: 0,
              }}>
                🦉
              </div>
            )}
            <div style={{
              maxWidth: "78%", padding: "8px 12px",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
              background: m.role === "user"
                ? "linear-gradient(135deg,#f0b8cc,#e090aa)"
                : "rgba(255,255,255,.82)",
              color: m.role === "user" ? "#fff" : P.bark,
              fontSize: "13px", lineHeight: "1.55", fontFamily: sans,
              border: m.role === "assistant" ? "1px solid rgba(240,195,210,.4)" : "none",
              boxShadow: "0 2px 10px rgba(180,100,120,.07)",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* ── Quick prompts ── */}
      <div style={{ padding: "0 13px 10px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {QUICK_PROMPTS.map((p) => (
          <button key={p} onClick={() => onSend(p)} style={{
            padding: "4px 10px", borderRadius: "14px",
            border: "1px solid rgba(232,160,184,.35)",
            background: "rgba(255,255,255,.55)",
            cursor: "pointer", fontFamily: sans, fontSize: "11px",
            color: "#c07090", fontStyle: "italic",
          }}>
            {p}
          </button>
        ))}
      </div>

      {/* ── Input ── */}
      <div style={{
        padding: "10px 13px",
        borderTop: "1px solid rgba(240,195,210,.3)",
        display: "flex", gap: "8px", alignItems: "flex-end",
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Say anything to Clover…"
          rows={1}
          style={{
            flex: 1, resize: "none",
            border: "1.5px solid rgba(240,195,210,.45)",
            borderRadius: "11px", padding: "8px 11px",
            fontFamily: sans, fontSize: "13px", color: P.bark,
            background: "rgba(255,255,255,.65)",
            lineHeight: "1.5", minHeight: "38px", maxHeight: "80px",
          }}
        />
        <button
          onClick={() => onSend()}
          disabled={!input.trim() || thinking}
          style={{
            padding: "8px 14px", borderRadius: "11px", border: "none",
            background: input.trim() && !thinking
              ? "linear-gradient(135deg,#f0b8cc,#e090aa)"
              : "rgba(240,195,210,.3)",
            color: input.trim() && !thinking ? "#fff" : "#d4a8b8",
            cursor: input.trim() && !thinking ? "pointer" : "default",
            fontFamily: sans, fontSize: "13px", fontWeight: "600",
            transition: "all .2s ease", flexShrink: 0, height: "38px",
            boxShadow: input.trim() && !thinking ? "0 3px 14px rgba(224,144,170,.4)" : "none",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
