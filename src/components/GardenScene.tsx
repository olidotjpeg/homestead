import type { GardenSceneProps } from "@/types";
import { PLANTS } from "@/constants/plants";
import { serif } from "@/constants/theme";
import { PlantSVG } from "./PlantSVG";

export function GardenScene({ tasks, burstId }: GardenSceneProps) {
  const doneCount = tasks.filter((t) => t.done).length;
  const allDone   = doneCount === tasks.length && tasks.length > 0;

  return (
    <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 8px 40px rgba(180,100,120,.15)" }}>
      {/* Sky */}
      <div style={{
        position: "relative",
        background: allDone
          ? "linear-gradient(180deg,#fff0f5 0%,#fce0e8 45%,#f5d8e0 100%)"
          : "linear-gradient(180deg,#f0faf2 0%,#e2f4e4 50%,#d8eeda 100%)",
        transition: "background 2s ease",
        padding: "16px 12px 0",
        minHeight: "170px",
      }}>
        {/* Warm glow when all done */}
        {allDone && (
          <div style={{
            position: "absolute", top: "10px", right: "20px",
            width: "44px", height: "44px", borderRadius: "50%",
            background: "radial-gradient(circle,#ffd8e8,#ffb0c8)",
            boxShadow: "0 0 36px 14px rgba(255,180,200,.4)",
            animation: "shimmer 2.8s ease-in-out infinite",
          }} />
        )}

        {/* Floating blossoms */}
        {doneCount > 2 && [...Array(doneCount - 2)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${10 + i * 12}%`, top: `${8 + (i % 3) * 10}%`,
            fontSize: "10px", opacity: .45, pointerEvents: "none",
            animation: `float ${2.5 + i * .4}s ease-in-out infinite`,
            animationDelay: `${i * .3}s`,
          }}>🌸</div>
        ))}

        {/* Clouds */}
        {([{ l: "5%", t: "10%", s: .6 }, { l: "50%", t: "6%", s: .8 }, { l: "74%", t: "16%", s: .55 }]).map((c, i) => (
          <div key={i} style={{
            position: "absolute", left: c.l, top: c.t,
            fontSize: "18px", opacity: .4, transform: `scale(${c.s})`,
            animation: `float ${3 + i * .9}s ease-in-out infinite`,
            animationDelay: `${i * .55}s`,
          }}>☁️</div>
        ))}

        {/* Plants */}
        <div style={{
          display: "grid", gridTemplateColumns: `repeat(${tasks.length},1fr)`,
          gap: "3px", alignItems: "flex-end",
          height: "140px", position: "relative", zIndex: 2,
        }}>
          {tasks.map((t, i) => {
            const plant = PLANTS[i];
            return (
              <div key={plant.id} style={{
                height: "100%", display: "flex",
                alignItems: "flex-end", justifyContent: "center",
                position: "relative",
              }}>
                <div style={{
                  width: "100%", maxWidth: "56px",
                  height: t.done ? "130px" : "28px",
                  transition: "height .8s cubic-bezier(.34,1.15,.64,1)",
                }}>
                  <PlantSVG plant={plant} done={t.done} bursting={burstId === plant.id} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Soil strip */}
      <div style={{
        background: "linear-gradient(180deg,#c8906a 0%,#a07050 55%,#7a5030 100%)",
        padding: "10px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(180deg,#d4a880,transparent)" }} />

        {/* Grass tufts */}
        {[6,15,25,35,46,56,67,77,88].map((l, i) => (
          <div key={i} style={{
            position: "absolute", bottom: "9px", left: `${l}%`,
            fontSize: "11px", opacity: .6,
            animation: `sway ${2 + i * .22}s ease-in-out infinite`,
            animationDelay: `${i * .15}s`,
          }}>🌿</div>
        ))}

        <div style={{ fontSize: "11px", fontFamily: serif, fontStyle: "italic", color: "rgba(255,235,220,.85)", zIndex: 1 }}>
          {doneCount === 0
            ? "The garden is resting 🌱"
            : allDone
            ? "✨ Every bloom is tended ✨"
            : `${doneCount} of ${tasks.length} plants lovingly tended`}
        </div>

        <div style={{ display: "flex", gap: "5px", zIndex: 1 }}>
          {tasks.map((t, i) => (
            <div key={i} style={{
              width: "9px", height: "9px", borderRadius: "50%",
              background: t.done ? PLANTS[i].petal : "rgba(255,255,255,.18)",
              boxShadow: t.done ? `0 0 7px ${PLANTS[i].petal}` : "none",
              transition: "all .5s ease",
              transform: t.done ? "scale(1.25)" : "scale(1)",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
