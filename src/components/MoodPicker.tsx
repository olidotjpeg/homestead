import type { MoodPickerProps } from "@/types";
import { MOODS } from "@/constants/moods";
import { P, serif, sans } from "@/constants/theme";

export function MoodPicker({ onPick }: MoodPickerProps) {
  return (
    <div style={{
      background: P.cardBg, borderRadius: "20px", padding: "18px 16px",
      border: `1.5px solid ${P.cardBorder}`, backdropFilter: "blur(10px)",
      animation: "appear .5s ease", textAlign: "center",
    }}>
      <div style={{ fontFamily: serif, fontSize: "15px", fontStyle: "italic", color: P.bark2, marginBottom: "14px" }}>
        How is the gardener feeling today?
      </div>

      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
        {MOODS.map((m) => (
          <button
            key={m.value}
            onClick={() => onPick(m)}
            style={{
              padding: "9px 16px", borderRadius: "22px",
              border: "1.5px solid rgba(232,144,176,.4)",
              background: "rgba(255,255,255,.65)",
              cursor: "pointer", fontFamily: sans, fontSize: "13px", fontWeight: "500",
              color: P.bark, transition: "all .2s ease",
              display: "flex", alignItems: "center", gap: "6px",
              boxShadow: "0 2px 12px rgba(200,140,160,.12)",
            }}
          >
            <span style={{ fontSize: "18px" }}>{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
