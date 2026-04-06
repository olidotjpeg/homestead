// ─── Domain types ─────────────────────────────────────────────────────────────

export interface Plant {
  id: number;
  name: string;
  taskLabel: string;
  petal: string;
  stem: string;
  leaf: string;
}

export interface Task {
  id: number;
  label: string;
  done: boolean;
}

export interface Mood {
  value: MoodValue;
  label: string;
  emoji: string;
}

export type MoodValue = "blooming" | "okay" | "wilting" | "struggling";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

// micro-step completion: taskId → stepIndex → done
export type MicroDone = Record<number, Record<number, boolean>>;

// ─── Persistence types ────────────────────────────────────────────────────────

export interface PersistedState {
  date: string;
  tasks: Task[];
  water: number;
  mood: MoodValue | null;
  microDone: MicroDone;
}

export type LoadedState =
  | { isNewDay: false } & PersistedState
  | { isNewDay: true; yesterday: PersistedState }
  | null;

// ─── API types ────────────────────────────────────────────────────────────────

export interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
  error?: { message: string };
}

// ─── Component prop types ─────────────────────────────────────────────────────

export interface PlantSVGProps {
  plant: Plant;
  done: boolean;
  bursting: boolean;
}

export interface GardenSceneProps {
  tasks: Task[];
  burstId: number | null;
}

export interface WaterTrackerProps {
  count: number;
  onAdd: () => void;
}

export interface TaskRowProps {
  task: Task;
  plant: Plant;
  onToggle: (id: number) => void;
  expanded: boolean;
  onExpand: (id: number) => void;
  microDone: Record<number, boolean>;
  onMicroToggle: (taskId: number, stepIdx: number) => void;
}

export interface MoodPickerProps {
  onPick: (mood: Mood) => void;
}

export interface CloverChatProps {
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  onSend: (override?: string) => void;
  thinking: boolean;
}

export interface NewDayBannerProps {
  yesterdayCount: number;
  onDismiss: () => void;
}

export interface ApiKeyScreenProps {
  onSave: (key: string) => void;
}
