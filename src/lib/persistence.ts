import type { Task, MicroDone, PersistedState, LoadedState } from "@/types";
import { PLANTS } from "@/constants/plants";
import { MICRO_STEPS } from "@/constants/microSteps";
import { STORAGE_KEY_STATE } from "@/constants/config";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const todayKey = (): string =>
  new Date().toISOString().slice(0, 10); // "2025-03-15"

export const freshTasks = (): Task[] =>
  PLANTS.map((p) => ({ id: p.id, label: p.taskLabel, done: false }));

export const freshMicro = (): MicroDone =>
  Object.fromEntries(
    PLANTS.map((p) => [
      p.id,
      Object.fromEntries((MICRO_STEPS[p.id] ?? []).map((_, i) => [i, false])),
    ])
  );

// ─── Load ─────────────────────────────────────────────────────────────────────

export const loadState = (): LoadedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATE);
    if (!raw) return null;

    const saved = JSON.parse(raw) as PersistedState;

    if (saved.date !== todayKey()) {
      return { isNewDay: true, yesterday: saved };
    }

    return { isNewDay: false, ...saved };
  } catch {
    return null;
  }
};

// ─── Save ─────────────────────────────────────────────────────────────────────

export const saveState = (state: Omit<PersistedState, "date">): void => {
  try {
    const toSave: PersistedState = { date: todayKey(), ...state };
    localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(toSave));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded, etc.)
  }
};
