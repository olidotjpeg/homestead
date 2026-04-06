import { useState, useEffect, useRef } from "react";
import { PICKER_LISTS } from "@/constants/randomLists";
import { P, serif, sans } from "@/constants/theme";

type Phase = "idle" | "spinning" | "done";

export function RandomPicker() {
  const [listId, setListId]     = useState(PICKER_LISTS[0].id);
  const [phase,  setPhase]      = useState<Phase>("idle");
  const [displayed, setDisplayed] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const list = PICKER_LISTS.find((l) => l.id === listId)!;

  // Recursive tick: fast at first, slows down, lands on the real pick
  const runTicks = (remaining: number, pick: string) => {
    const delay = remaining > 8 ? 75 : remaining > 4 ? 130 : remaining > 1 ? 210 : 320;
    const rand  = list.items[Math.floor(Math.random() * list.items.length)];
    setDisplayed(remaining === 0 ? pick : rand);

    if (remaining === 0) {
      setPhase("done");
      return;
    }
    timeoutRef.current = setTimeout(() => runTicks(remaining - 1, pick), delay);
  };

  const spin = () => {
    if (phase === "spinning") return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const pick = list.items[Math.floor(Math.random() * list.items.length)];
    setPhase("spinning");
    runTicks(16, pick);
  };

  // Reset when list changes
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase("idle");
    setDisplayed("");
  }, [listId]);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <div style={{
      background: P.cardBg, borderRadius: "20px", padding: "16px",
      border: `1.5px solid ${P.cardBorder}`, backdropFilter: "blur(10px)",
      marginBottom: "14px",
    }}>

      {/* Header */}
      <div style={{ fontFamily: serif, fontSize: "14px", fontStyle: "italic", color: P.bark2, marginBottom: "12px" }}>
        🎲 choose for me
      </div>

      {/* List tabs */}
      <div style={{ display: "flex", gap: "7px", marginBottom: "14px", flexWrap: "wrap" }}>
        {PICKER_LISTS.map((l) => (
          <button
            key={l.id}
            onClick={() => setListId(l.id)}
            style={{
              padding: "6px 14px", borderRadius: "20px",
              border: `1.5px solid ${listId === l.id ? P.roseSoft : "rgba(240,195,210,.4)"}`,
              background: listId === l.id ? "rgba(244,184,200,.18)" : "rgba(255,255,255,.4)",
              cursor: "pointer", fontFamily: sans, fontSize: "12px",
              color: listId === l.id ? P.rose : P.bark3,
              transition: "all .2s ease",
            }}
          >
            {l.emoji} {l.label}
          </button>
        ))}
      </div>

      {/* Result area */}
      <div style={{
        minHeight: "58px",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "14px",
      }}>
        {phase === "idle" && (
          <div style={{ fontFamily: serif, fontSize: "13px", fontStyle: "italic", color: P.bark3 }}>
            press the button and I'll decide for you
          </div>
        )}
        {phase !== "idle" && (
          <div style={{
            fontFamily: serif,
            fontSize: listId === "coin" ? "28px" : "20px",
            color: phase === "done" ? P.bark : P.bark3,
            textAlign: "center",
            letterSpacing: "-.2px",
            animation: phase === "done" ? "appear .35s ease" : "none",
            transition: "color .25s ease",
          }}>
            {displayed}
          </div>
        )}
      </div>

      {/* Button */}
      <button
        onClick={spin}
        disabled={phase === "spinning"}
        style={{
          width: "100%", padding: "12px 16px", borderRadius: "14px",
          border: `1.5px solid ${phase === "done" ? "rgba(174,212,168,.6)" : P.roseSoft}`,
          background: phase === "spinning"
            ? "rgba(244,184,200,.06)"
            : phase === "done"
            ? "linear-gradient(135deg, rgba(174,212,168,.2), rgba(200,230,200,.15))"
            : "linear-gradient(135deg, rgba(244,184,200,.2), rgba(174,212,168,.15))",
          cursor: phase === "spinning" ? "default" : "pointer",
          fontFamily: serif, fontSize: "15px", fontStyle: "italic",
          color: phase === "spinning" ? P.bark3 : P.bark,
          transition: "all .25s ease",
          letterSpacing: "-.1px",
        }}
      >
        {phase === "spinning"
          ? "choosing…"
          : phase === "done"
          ? "choose again"
          : `choose my ${list.label.toLowerCase()}`}
      </button>

    </div>
  );
}
