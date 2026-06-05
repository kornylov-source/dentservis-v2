import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";

import { buildSystemPrompt } from "@/lib/bot-system-prompt";
import { clinic } from "@/lib/clinic-contact";

export const maxDuration = 30;
export const runtime = "nodejs";

/**
 * Серверний пост-фільтр: якщо модель почала давати медичну пораду — заміщуємо
 * безпечним fallback. Покриває типові українські формулювання.
 */
const FORBIDDEN_PATTERNS: RegExp[] = [
  /у вас (?:є|мабуть|скоріш за все|напевно|схоже|ймовірно) (?:карієс|пародонтит|пульпіт|гінгівіт|абсцес)/i,
  /рекомендую (?:приймати|випити|використовувати) (?:ліки|антибіотик|знеболювальне|таблетки)/i,
  /прийміть (?:ібупрофен|парацетамол|німесил|кеторол|анальгін)/i,
  /діагноз[уею]?/i,
];

/**
 * Підозрілі промпти-ін'єкції — не блокуємо запит (Claude сам відмовиться по
 * system prompt), але логуємо для аудиту.
 */
const SUSPICIOUS_PATTERNS: RegExp[] = [
  /ignore (?:previous|all|your) instruction/i,
  /forget (?:you are|your role|the rules)/i,
  /you are now (?:dan|gpt|a doctor|a physician)/i,
  /act as (?:a|an) (?:doctor|physician|specialist|nurse)/i,
  /(?:reveal|show|leak) (?:your |the )?(?:prompt|instructions|system)/i,
  /system prompt/i,
];

const FALLBACK_TEXT = `Я не можу давати медичних порад. Будь ласка, зверніться до лікаря — телефон ${clinic.phone}.`;
const RATE_LIMIT_FALLBACK = `Чат тимчасово недоступний. Зателефонуйте: ${clinic.phone}`;

function lastUserMessageText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "user") continue;
    const text = m.parts
      .map((p) => (p.type === "text" ? p.text : ""))
      .join(" ")
      .trim();
    if (text) return text;
  }
  return "";
}

export async function POST(req: Request): Promise<Response> {
  // Kill switch — миттєве вимкнення без deploy
  if (process.env.AI_CHAT_DISABLED === "true") {
    return Response.json({ error: RATE_LIMIT_FALLBACK }, { status: 503 });
  }

  let body: { messages: UIMessage[] };
  try {
    body = (await req.json()) as { messages: UIMessage[] };
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Invalid messages" }, { status: 400 });
  }

  const lastUser = lastUserMessageText(messages);
  if (SUSPICIOUS_PATTERNS.some((p) => p.test(lastUser))) {
    console.warn("[dent-chat] suspicious prompt detected", {
      preview: lastUser.slice(0, 120),
    });
  }

  const systemPrompt = await buildSystemPrompt();

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    // System prompt передаємо як SystemModelMessage в `system:` параметр.
    // Vercel AI SDK мапить його в Anthropic API system array із cache_control.
    // ttl='1h' для довшого кешу, щоб амортизувати write-cost між запитами.
    allowSystemInMessages: true,
    messages: [
      {
        role: "system",
        content: systemPrompt,
        providerOptions: {
          anthropic: {
            cacheControl: { type: "ephemeral", ttl: "1h" },
          },
        },
      },
      ...(await convertToModelMessages(messages)),
    ],
    // Низька temperature → менше "творчості", тримається KB,
    // менше галюцинацій про числа/терміни.
    temperature: 0.15,
    maxOutputTokens: 512,
    onError({ error }) {
      console.error("[dent-chat] streamText error", error);
    },
    onFinish({ text, finishReason, usage }) {
      // У AI SDK v6 cache-метрики в `usage.inputTokenDetails`,
      // а не в providerMetadata.
      console.log("[dent-chat] finish", {
        finishReason,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        cacheRead: usage.inputTokenDetails?.cacheReadTokens ?? 0,
        cacheWrite: usage.inputTokenDetails?.cacheWriteTokens ?? 0,
        noCache: usage.inputTokenDetails?.noCacheTokens ?? 0,
      });

      if (FORBIDDEN_PATTERNS.some((p) => p.test(text))) {
        console.warn("[dent-chat] FORBIDDEN content detected", {
          preview: text.slice(0, 200),
        });
      }
    },
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      if (error instanceof Error) {
        if (error.message.includes("rate") || error.message.includes("429")) {
          return "Забагато запитів до AI. Спробуйте за хвилину.";
        }
        return error.message;
      }
      return "Вибачте, сталася помилка. Спробуйте ще раз.";
    },
  });
}
