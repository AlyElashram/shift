import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";
import { checkRateLimit, recordFailedAttempt, clearRateLimit } from "@/lib/rate-limit";

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const rateLimitCheck = checkRateLimit(ip);
  if (!rateLimitCheck.allowed) {
    return NextResponse.json(
      { error: `Too many login attempts. Try again in ${rateLimitCheck.retryAfterSeconds} seconds.` },
      { status: 429 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result && typeof result === "string") {
      clearRateLimit(ip);
      return NextResponse.json({ success: true, redirectUrl: result });
    }

    clearRateLimit(ip);
    return NextResponse.json({ success: true });
  } catch {
    const lockout = recordFailedAttempt(ip);
    if (lockout.locked) {
      return NextResponse.json(
        { error: `Too many failed attempts. Account locked for ${Math.ceil(lockout.retryAfterSeconds! / 60)} minutes.` },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
}
