import { useEffect } from "react";
import type { TaskRowProps } from "@/types";
import { MICRO_STEPS } from "@/constants/microSteps";
import { P, serif, sans } from "@/constants/theme";

/** Converts a hex colour like "#f4a7b9" to "244,167,185" */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export function TaskRow({
  task,
  plant,
  onToggle,
  expanded,
  onExpand,
  microDone,
  onMicroToggle,
}: TaskRowProps) {
  const rgb   = hexToRgb(plant.petal);
  const steps = MICRO_STEPS[task.id] ?? [];
  const allMicroDone = steps.length > 0 && steps.every((_, i) => microDone[i]);

  // Auto-complete task when every micro-step is ticked
  useEffect(() => {
    if (allMicroDone && !task.done) onToggle(task.id);
  }, [allMicroDone, task.done, task.id, onToggle]);

  return (
    <div style={{
      borderRadius: "14px", overflow: "hidden",
      border: `1.5px solid ${task.done ? `rgba(${rgb},.38)` : "rgba(240,195,210,.4)"}`,
      transition: "border-color .25s ease",
    }}>
      {/* ── Main row ── */}
      <div
        onClick={() => onToggle(task.id)}
        style={{
          display: "flex", alignItems: "center", gap: "11px",
          padding: "11px 14px", cursor: "pointer",
          background: task.done ? `rgba(${rgb},.1)` : "rgba(255,255,255,.55)",
          backdropFilter: "blur(6px)", userSelect: "none",
          transition: "background .25s ease",
        }}
      >
        {/* Check circle */}
        <div style={{
          width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${task.done ? plant.petal : "#e8c0cc"}`,
          background: task.done ? plant.petal : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", color: "#fff",
          transition: "all .25s ease",
          boxShadow: task.done ? `0 0 10px rgba(${rgb},.4)` : "none",
          animation: task.done ? "tickIn .4s ease" : "none",
        }}>
          {task.done && "✓"}
        </div>

        {/* Plant icon bubble */}
        <div style={{
          width: "30px", height: "30px", flexShrink: 0,
          background: task.done ? `rgba(${rgb},.1)` : "rgba(240,230,235,.4)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "15px",
          border: `1px solid ${task.done ? `rgba(${rgb},.25)` : "rgba(220,190,200,.35)"}`,
          transition: "all .3s ease",
        }}>
          {task.done ? "🌸" : "🌱"}
        </div>

        {/* Labels */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: sans, fontSize: "13.5px", fontWeight: "500",
            color: task.done ? P.sage : P.bark,
            textDecoration: task.done ? "line-through" : "none",
            opacity: task.done ? .75 : 1,
            transition: "all .25s ease",
          }}>
            {task.label}
          </div>
          <div style={{ fontSize: "11px", fontFamily: serif, fontStyle: "italic", color: task.done ? P.sage : P.bark3, marginTop: "1px" }}>
            tends the {plant.name}
          </div>
        </div>

        {task.done && <div style={{ fontSize: "15px", animation: "bloom .5s ease", flexShrink: 0 }}>🌸</div>}
      </div>

      {/* ── Micro-steps (only when task not done) ── */}
      {!task.done && (
        <div style={{ borderTop: "1px solid rgba(240,195,210,.3)", background: "rgba(253,245,248,.5)" }}>
          {/* Trigger button */}
          <button
            onClick={(e) => { e.stopPropagation(); onExpand(task.id); }}
            style={{
              width: "100%", padding: "7px 14px",
              background: "none", border: "none", cursor: "pointer",
              fontFamily: sans, fontSize: "11px", color: P.bark3,
              textAlign: "left", display: "flex", alignItems: "center", gap: "6px",
              transition: "color .2s ease",
            }}
          >
            <span style={{ fontSize: "13px" }}>{expanded ? "🌿" : "🌱"}</span>
            <span style={{ fontStyle: "italic" }}>
              {expanded ? "hide steps" : "I'm finding this hard — show me tiny steps"}
            </span>
          </button>

          {/* Steps panel */}
          {expanded && (
            <div className="steps" style={{ padding: "4px 14px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {steps.map((step, i) => (
                <div
                  key={i}
                  onClick={(e) => { e.stopPropagation(); onMicroToggle(task.id, i); }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "9px",
                    cursor: "pointer", padding: "5px 0", userSelect: "none",
                  }}
                >
                  {/* Micro check circle */}
                  <div style={{
                    width: "16px", height: "16px", borderRadius: "50%",
                    flexShrink: 0, marginTop: "1px",
                    border: `1.5px solid ${microDone[i] ? plant.petal : "rgba(232,160,176,.5)"}`,
                    background: microDone[i] ? plant.petal : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "9px", color: "#fff",
                    transition: "all .2s ease",
                  }}>
                    {microDone[i] && "✓"}
                  </div>

                  <span style={{
                    fontFamily: sans, fontSize: "12px",
                    color: microDone[i] ? P.sage : P.bark2,
                    textDecoration: microDone[i] ? "line-through" : "none",
                    opacity: microDone[i] ? .7 : 1,
                    lineHeight: "1.4",
                    transition: "all .2s ease",
                  }}>
                    {step}
                  </span>
                </div>
              ))}

              <div style={{ fontSize: "10px", color: P.bark3, fontStyle: "italic", fontFamily: serif, marginTop: "2px", paddingLeft: "25px" }}>
                tick them off one at a time — no rush 🌸
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
