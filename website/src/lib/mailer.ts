import "server-only";
import { Resend } from "resend";

let resend: Resend | null = null;

/** Resend client from RESEND_API_KEY. Returns null when email isn't configured yet. */
export function getMailer() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  resend ??= new Resend(key);
  return resend;
}

/** Sender address. Must be on a domain verified in Resend (scikit.com.au). */
export const mailFrom = () => process.env.CONTACT_FROM_EMAIL || "info@scikit.com.au";
export const mailTo = () => process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
