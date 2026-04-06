import type { WaterTrackerProps } from "@/types";
import { WATER_GOAL } from "@/constants/config";
import { P, serif, sans } from "@/constants/theme";

function WaterCan({ pct }: { pct: number }) {
  const wy = 48 - 30 * pct;
  return (
    <svg viewBox="0 0 44 58" style={{ width: "38px", height: "50px", flexShrink: 0 }}>
      <path d="M9 15 Q7 15 6 17 L5 47 Q5 51 9 51 L35 51 Q39 51 39 47 L38 17 Q37 15 35 15Z"
        fill="#f8dce8" stroke="#e8a0b8" strokeWidth="1.4" />
      <clipPath id="canClip">
        <path d="M9 15 Q7 15 6 17 L5 47 Q5 51 9 51 L35 51 Q39 51 39 47 L38 17 Q37 15 35 15Z" />
      </clipPath>
      <rect x="5" y={wy} width="34" height={51 - wy}
        fill="#f4a0c0" opacity=".55" clipPath="url(#canClip)"
        style={{ transition: "all .7s ease" }} />
      <path d={`M5 ${wy} Q12 ${wy - 3} 22 ${wy} Q32 ${wy + 3} 39 ${wy}`}
        stroke="#e880a8" strokeWidth="1" fill="none" opacity=".5"
        clipPath="url(#canClip)" style={{ transition: "all .7s ease" }} />
      <path d="M35 20 Q42 17 42 13 Q42 9 37 10 L35 15"
        fill="#f0c8d8" stroke="#e8a0b8" strokeWidth="1.2" />
      <path d="M9 22 Q2 26 2 33 Q2 41 9 44"
        fill="none" stroke="#e8a0b8" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="22" cy="15" rx="14" ry="4.5" fill="#f0c8d8" stroke="#e8a0b8" strokeWidth="1.2" />
      <circle cx="22" cy="15" r="2.5" fill="#f4a0b8" opacity=".7" />
    </svg>
  );
}

export function WaterTracker({ count, onAdd }: WaterTrackerProps) {
  const full = count >= WATER_GOAL;

  return (
    <div style={{
      background: P.cardBg, borderRadius: "18px", padding: "13px 15px",
      border: `1.5px solid ${P.cardBorder}`, backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", gap: "13px",
    }}>
      <WaterCan pct={count / WATER_GOAL} />

      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: serif, fontSize: "12px", fontStyle: "italic", color: P.bark2, marginBottom: "8px" }}>
          Watering the garden 🌸 {count}/{WATER_GOAL}
        </div>

        <div style={{ display: "flex", gap: "5px", alignItems: "center", flexWrap: "wrap" }}>
          {Array.from({ length: WATER_GOAL }).map((_, i) => (
            <div key={i} style={{
              width: "15px", height: "21px", borderRadius: "3px 3px 6px 6px",
              background: i < count ? "linear-gradient(180deg,#f8c0d4,#e898b8)" : "rgba(244,167,185,.18)",
              border: `1px solid ${i < count ? "#e890b0" : "rgba(232,144,176,.25)"}`,
              transition: "all .35s ease",
              transform: i < count ? "scale(1.1)" : "scale(1)",
            }} />
          ))}

          <button
            onClick={onAdd}
            disabled={full}
            style={{
              marginLeft: "4px", padding: "5px 12px", borderRadius: "14px", border: "none",
              background: full ? "rgba(232,160,184,.18)" : "linear-gradient(135deg,#f8c0d4,#e898b8)",
              color: full ? "#d4a0b0" : "#fff",
              fontFamily: sans, fontSize: "11px", fontWeight: "600",
              cursor: full ? "default" : "pointer",
              transition: "all .2s ease",
              boxShadow: full ? "none" : "0 2px 10px rgba(232,144,176,.35)",
            }}
          >
            {full ? "Garden watered 🌸" : "+ Watered"}
          </button>
        </div>
      </div>
    </div>
  );
}
