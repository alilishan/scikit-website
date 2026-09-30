import "server-only";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Cloudflare Turnstile server-side check (siteverify).
 * Passes only when Cloudflare confirms the token, it was issued for `expectedAction`,
 * and the page it came from is one of TURNSTILE_HOSTNAMES (comma-separated).
 * Fails closed: missing config, a bad token or a siteverify error all return false.
 * Tokens are single-use, so each form submission needs a fresh one.
 */
export async function verifyTurnstile(token: unknown, expectedAction: string, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean)
  );

  if (!secret || expectedHostnames.size === 0) {
    console.error("[turnstile] TURNSTILE_SECRET / TURNSTILE_HOSTNAMES not set; rejecting submission.");
    return false;
  }
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) return false;

  let result: { success?: boolean; action?: string; hostname?: string; "error-codes"?: string[] };
  try {
    const res = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({ secret, response: token, ...(remoteIp && { remoteip: remoteIp }) }),
    });
    if (!res.ok) throw new Error(`siteverify ${res.status}`);
    result = await res.json();
  } catch (err) {
    console.error("[turnstile] siteverify request failed", err);
    return false;
  }

  if (!result.success || result.action !== expectedAction || !result.hostname || !expectedHostnames.has(result.hostname)) {
    console.warn("[turnstile] rejected", { errors: result["error-codes"], action: result.action, hostname: result.hostname });
    return false;
  }
  return true;
}
