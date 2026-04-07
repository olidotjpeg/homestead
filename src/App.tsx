import { useState, useEffect, useCallback } from "react";
import type { Task, MicroDone, MoodValue, Mood } from "@/types";
import { PLANTS } from "@/constants/plants";
import { MOODS } from "@/constants/moods";
import { WATER_GOAL } from "@/constants/config";
// import { STORAGE_KEY_APIKEY, DEV_SKIP_KEY } from "@/constants/config"; // re-enable with Clover
import { MICRO_STEPS } from "@/constants/microSteps";
import { P, serif, sans } from "@/constants/theme";
import { loadState, saveState, freshTasks, freshMicro } from "@/lib/persistence";
// import { useClover } from "@/hooks/useClover"; // re-enable with Clover

import { GardenScene }   from "@/components/GardenScene";
import { WaterTracker }  from "@/components/WaterTracker";
import { TaskRow }       from "@/components/TaskRow";
import { MoodPicker }    from "@/components/MoodPicker";
// import { CloverChat }    from "@/components/CloverChat"; // re-enable with Clover
import { NewDayBanner }  from "@/components/NewDayBanner";
// import { ApiKeyScreen }  from "@/components/ApiKeyScreen";
import { RandomPicker }  from "@/components/RandomPicker";

// ─── Helpers (disabled with Clover) ───────────────────────────────────────────
// const getApiKey = (): string => { try { return localStorage.getItem(STORAGE_KEY_APIKEY) ?? ""; } catch { return ""; } };
// const setApiKey = (key: string): void => { try { localStorage.setItem(STORAGE_KEY_APIKEY, key); } catch {} };
// const removeApiKey = (): void => { try { localStorage.removeItem(STORAGE_KEY_APIKEY); } catch {} };

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  // ── API key (disabled for now) ──
  // const [apiKey, setApiKeyState] = useState<string>(() => getApiKey());
  // const handleSaveKey = (key: string) => { setApiKey(key); setApiKeyState(key); };
  // const handleClearKey = () => { removeApiKey(); setApiKeyState(""); };

  // ── Restore from localStorage (or start fresh) ──
  const saved = loadState();
  const isNewDay = saved?.isNewDay ?? false;

  const [tasks,     setTasks]     = useState<Task[]>(() => (!saved || saved.isNewDay) ? freshTasks() : saved.tasks);
  const [water,     setWater]     = useState<number>(() => (!saved || saved.isNewDay) ? 0 : saved.water);
  const [mood,      setMood]      = useState<MoodValue | null>(() => (!saved || saved.isNewDay) ? null : saved.mood);
  const [microDone, setMicroDone] = useState<MicroDone>(() => (!saved || saved.isNewDay) ? freshMicro() : (saved.microDone ?? freshMicro()));

  const [showNewDay,  setShowNewDay]  = useState<boolean>(isNewDay);
  const [yesterCount] = useState<number>(() =>
    saved?.isNewDay ? (saved.yesterday?.tasks.filter((t) => t.done).length ?? 0) : 0
  );

  const [burstId,  setBurstId]  = useState<number | null>(null);
  const [lowSpoon, setLowSpoon] = useState(false);
  const [showList, setShowList] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  // ── Clover chat (disabled for now) ──
  // const { messages, thinking, input, setInput, send } = useClover({ apiKey, tasks, water, mood, lowSpoon });

  // ── Persist on every relevant change ──
  useEffect(() => {
    saveState({ tasks, water, mood, microDone });
  }, [tasks, water, mood, microDone]);

  // ── Task helpers ──
  const toggleTask = useCallback((id: number) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (task && !task.done) {
        setBurstId(id);
        setTimeout(() => setBurstId(null), 900);
      }
      return prev.map((t) => t.id === id ? { ...t, done: !t.done } : t);
    });
    // Reset micro-steps when un-ticking
    setMicroDone((prev) => ({
      ...prev,
      [id]: Object.fromEntries((MICRO_STEPS[id] ?? []).map((_, i) => [i, false])),
    }));
    setExpanded(null);
  }, []);

  const toggleMicro = useCallback((taskId: number, stepIdx: number) => {
    setMicroDone((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], [stepIdx]: !prev[taskId]?.[stepIdx] },
    }));
  }, []);

  const handleExpand = useCallback((id: number) => {
    setExpanded((e) => (e === id ? null : id));
  }, []);

  // ── Mood ──
  // const cloverEnabled = apiKey !== DEV_SKIP_KEY; // re-enable with Clover

  const pickMood = (m: Mood) => {
    setMood(m.value as MoodValue);
    if (m.value === "struggling") setLowSpoon(true);
    // if (cloverEnabled) send(`My mood today is: ${m.label} ${m.emoji}`); // re-enable with Clover
  };

  const moodObj = MOODS.find((m) => m.value === mood);
  const done    = tasks.filter((t) => t.done).length;
  const shown   = lowSpoon ? tasks.slice(0, 3) : tasks;

  // ── Gate: API key screen (disabled for now — uncomment to re-enable) ──
  // if (!apiKey) return <ApiKeyScreen onSave={handleSaveKey} />;

  return (
    <div style={{ minHeight: "100vh", background: P.pageBg, fontFamily: sans }}>
      <div style={{ maxWidth: "660px", margin: "0 auto", padding: "20px 14px 48px" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "18px", animation: "appear .6s ease" }}>
          <div style={{ fontSize: "10px", letterSpacing: ".28em", color: P.rose, textTransform: "uppercase", marginBottom: "4px", fontWeight: "600" }}>
            welcome to
          </div>
          <h1 style={{ fontFamily: serif, fontSize: "30px", color: P.bark, margin: 0, letterSpacing: "-.2px" }}>
            The Homestead Garden
          </h1>
          <div style={{ fontFamily: serif, fontSize: "12px", fontStyle: "italic", color: P.bark3, marginTop: "3px" }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "8px", opacity: .5 }}>
            {["🌸","🌿","🌸","🌿","🌸"].map((e, i) => <span key={i} style={{ fontSize: "12px" }}>{e}</span>)}
          </div>
          <button
            onClick={() => {}} /* onClick={handleClearKey} — re-enable with Clover */
            style={{ marginTop: "6px", background: "none", border: "none", cursor: "pointer", fontFamily: sans, fontSize: "10px", color: P.bark3, opacity: .5 }}
          >
            change api key
          </button>
        </div>

        {/* ── New day banner ── */}
        {showNewDay && (
          <NewDayBanner
            yesterdayCount={yesterCount}
            onDismiss={() => setShowNewDay(false)}
          />
        )}

        {/* ── Garden ── */}
        <div style={{ marginBottom: "16px" }}>
          <GardenScene tasks={tasks} burstId={burstId} />
        </div>

        {/* ── Mood / status ── */}
        {!mood ? (
          <div style={{ marginBottom: "14px" }}>
            <MoodPicker onPick={pickMood} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "stretch", gap: "12px", marginBottom: "14px" }}>
            {/* Mood pill */}
            <div style={{
              background: P.cardBg, borderRadius: "18px", padding: "12px 16px",
              border: `1.5px solid ${P.cardBorder}`, backdropFilter: "blur(10px)",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "4px", minWidth: "80px", textAlign: "center",
            }}>
              <div style={{ fontSize: "22px" }}>{moodObj?.emoji}</div>
              <div style={{ fontFamily: serif, fontSize: "11px", color: P.bark2, fontStyle: "italic" }}>
                {moodObj?.label}
              </div>
              <button
                onClick={() => setMood(null)}
                style={{ fontSize: "10px", color: P.bark3, background: "none", border: "none", cursor: "pointer", fontFamily: sans, marginTop: "2px" }}
              >
                change
              </button>
            </div>

            {/* Progress card */}
            <div style={{
              flex: 1, background: P.cardBg, borderRadius: "18px", padding: "14px 16px",
              border: `1.5px solid ${P.cardBorder}`, backdropFilter: "blur(10px)",
            }}>
              <div style={{ fontFamily: serif, fontSize: "12px", fontStyle: "italic", color: P.bark2, marginBottom: "7px" }}>
                Today's blooms 🌸
              </div>
              <div style={{ fontFamily: serif, fontSize: "26px", fontWeight: "400", color: P.bark, lineHeight: 1, marginBottom: "8px" }}>
                {done}
                <span style={{ fontSize: "14px", color: P.bark3, fontWeight: "300" }}>/{tasks.length}</span>
              </div>
              <div style={{ height: "7px", borderRadius: "4px", background: "rgba(232,160,176,.2)", overflow: "hidden", marginBottom: "10px" }}>
                <div style={{
                  height: "100%",
                  width: `${(done / tasks.length) * 100}%`,
                  background: `linear-gradient(90deg,${P.roseSoft},${P.sageSoft})`,
                  borderRadius: "4px", transition: "width .7s ease",
                  boxShadow: "0 0 8px rgba(244,184,200,.6)",
                }} />
              </div>
              <button
                onClick={() => { setLowSpoon((s) => !s); /* if (!lowSpoon) send("I'm feeling overwhelmed today."); */ }}
                style={{
                  padding: "5px 12px", borderRadius: "14px",
                  border: `1px dashed ${lowSpoon ? "rgba(122,170,120,.6)" : "rgba(232,160,176,.45)"}`,
                  background: lowSpoon ? "rgba(168,212,168,.15)" : "rgba(255,255,255,.4)",
                  cursor: "pointer", fontFamily: sans, fontSize: "11px",
                  color: lowSpoon ? P.sage : P.bark3, transition: "all .2s ease",
                }}
              >
                {lowSpoon ? "🍃 low spoon mode — 3 gentle tasks" : "🍃 low spoon mode"}
              </button>
            </div>
          </div>
        )}

        {/* ── Water ── */}
        {mood && (
          <div style={{ marginBottom: "14px" }}>
            <WaterTracker
              count={water}
              onAdd={() => setWater((c) => Math.min(c + 1, WATER_GOAL))}
            />
          </div>
        )}

        {/* ── Task list ── */}
        {mood && (
          <div style={{
            background: P.cardBg, borderRadius: "20px", padding: "14px",
            border: `1.5px solid ${P.cardBorder}`, backdropFilter: "blur(10px)",
            marginBottom: "14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ fontFamily: serif, fontSize: "14px", fontStyle: "italic", color: P.bark2 }}>
                {lowSpoon ? "🍃 Three gentle things" : "🌱 Today's garden tasks"}
              </div>
              <button
                onClick={() => setShowList((s) => !s)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", color: P.bark3, fontFamily: sans }}
              >
                {showList ? "hide" : "show"}
              </button>
            </div>

            {showList && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {shown.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    plant={PLANTS.find((p) => p.id === t.id)!}
                    onToggle={toggleTask}
                    expanded={expanded === t.id}
                    onExpand={handleExpand}
                    microDone={microDone[t.id] ?? {}}
                    onMicroToggle={toggleMicro}
                  />
                ))}
                {lowSpoon && (
                  <button
                    onClick={() => setLowSpoon(false)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", color: P.rose, fontFamily: sans, fontStyle: "italic", textAlign: "left", padding: "3px 2px" }}
                  >
                    + show all plants
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Random picker ── */}
        {mood && <RandomPicker />}

        {/* ── Clover chat (disabled for now) ── */}
        {/* {mood && cloverEnabled && (
          <CloverChat
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={send}
            thinking={thinking}
          />
        )} */}

        {/* ── Footer ── */}
        <div style={{
          textAlign: "center", marginTop: "20px",
          fontFamily: serif, fontSize: "11px", fontStyle: "italic",
          color: "rgba(180,120,140,.5)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        }}>
          <span>🌸</span>
          <span>Every petal you tend is enough</span>
          <span>🌿</span>
        </div>
      </div>
    </div>
  );
}
