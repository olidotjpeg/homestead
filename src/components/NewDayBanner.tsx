import { useEffect } from "react";
import type { NewDayBannerProps } from "@/types";
import { P, serif, sans } from "@/constants/theme";

const AUTO_DISMISS_MS = 5000;

export function NewDayBanner({ yesterdayCount, onDismiss }: NewDayBannerProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(252,232,238,.95),rgba(232,248,232,.95))",
      border: `1px solid ${P.cardBorder}`,
      borderRadius: "16px",
      padding: "12px 16px",
      marginBottom: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      animation: "newDayIn 5s ease forwards",
      backdropFilter: "blur(8px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "20px" }}>🌅</span>
        <div>
          <div style={{ fontFamily: serif, fontSize: "13px", color: P.bark, fontStyle: "italic" }}>
            Good morning — a fresh garden awaits
          </div>
          {yesterdayCount > 0 && (
            <div style={{ fontSize: "11px", color: P.bark3, fontFamily: sans, marginTop: "2px" }}>
              Yesterday you tended {yesterdayCount} plant{yesterdayCount !== 1 ? "s" : ""} 🌸
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "16px", color: P.bark3, flexShrink: 0, lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
