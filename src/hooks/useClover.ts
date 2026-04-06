import { useState, useCallback } from "react";
import type { Message, Task, MoodValue } from "@/types";
import {
  SYSTEM_PROMPT,
  ANTHROPIC_API_URL,
  ANTHROPIC_MODEL,
  ANTHROPIC_VERSION,
  WATER_GOAL,
} from "@/constants/config";
import { PLANTS } from "@/constants/plants";

interface UseCloverOptions {
  apiKey: string;
  tasks: Task[];
  water: number;
  mood: MoodValue | null;
  lowSpoon: boolean;
}

interface UseCloverReturn {
  messages: Message[];
  thinking: boolean;
  input: string;
  setInput: (v: string) => void;
  send: (override?: string) => Promise<void>;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Good morning 🌸 The garden is soft and quiet, waiting for you. How are you feeling today?",
};

export function useClover({
  apiKey,
  tasks,
  water,
  mood,
  lowSpoon,
}: UseCloverOptions): UseCloverReturn {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");

  const buildContext = useCallback((): string => {
    const done = tasks.filter((t) => t.done).length;
    const tended = tasks
      .filter((t) => t.done)
      .map((t) => PLANTS.find((p) => p.id === t.id)?.name)
      .filter(Boolean)
      .join(", ");

    return (
      `[Garden: ${done}/${tasks.length} plants tended. ` +
      `Water: ${water}/${WATER_GOAL}. ` +
      `Mood: ${mood ?? "not set"}. ` +
      `Low spoon: ${lowSpoon}. ` +
      `Tended: ${tended || "none yet"}.]\n\n`
    );
  }, [tasks, water, mood, lowSpoon]);

  const send = useCallback(
    async (override?: string): Promise<void> => {
      const text = (override ?? input).trim();
      if (!text) return;

      setInput("");

      const userMsg: Message = { role: "user", content: text };
      const next = [...messages, userMsg];
      setMessages(next);
      setThinking(true);

      const ctx = buildContext();

      // Prepend context to first user message in the thread
      const apiMessages = next.map((m, i) => ({
        role: m.role,
        content: i === 0 && m.role === "user" ? ctx + m.content : m.content,
      }));

      try {
        const res = await fetch(ANTHROPIC_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": ANTHROPIC_VERSION,
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: ANTHROPIC_MODEL,
            max_tokens: 300,
            system: SYSTEM_PROMPT,
            messages: apiMessages,
          }),
        });

        const data = await res.json();

        if (data.error) throw new Error(data.error.message as string);

        const reply: string =
          (data.content as Array<{ type: string; text: string }>)?.[0]?.text ??
          "🌸 Something rustled in the leaves. Try again?";

        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `🌿 ${message}` },
        ]);
      } finally {
        setThinking(false);
      }
    },
    [input, messages, apiKey, buildContext]
  );

  return { messages, thinking, input, setInput, send };
}
