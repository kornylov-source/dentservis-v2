import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiting для AI-чату. Захищає від абʼюзу — без цього спам бот'ом
 * швидко з'їсть Anthropic budget.
 *
 * Підтримуємо обидва набори env vars:
 * - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (новий стандарт)
 * - KV_REST_API_URL / KV_REST_API_TOKEN (legacy від Vercel KV → Upstash migration)
 *
 * Якщо жоден не налаштований (локальна розробка без Redis) — proxy
 * просто пропускає запити, лог попереджає.
 */

function makeRedis(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = makeRedis();

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
      prefix: "dent-chat",
    })
  : null;

export async function proxy(req: NextRequest): Promise<NextResponse> {
  if (!ratelimit) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[proxy] rate limit DISABLED — Redis env vars missing");
    }
    return NextResponse.next();
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous";

  const { success, limit, remaining, reset } = await ratelimit.limit(
    `chat:${ip}`,
  );

  if (!success) {
    return new NextResponse(
      JSON.stringify({
        error: "Забагато запитів. Зачекайте хвилину.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
        },
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/chat"],
};
