import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/** SMTP settings from environment variables. Returns null when mail isn't configured yet. */
function smtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT ?? 587);
  return {
    host,
    port,
    // true for port 465 (implicit TLS); false for 587 (STARTTLS).
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user, pass },
  };
}

let transporter: Transporter | null = null;

export function getMailer() {
  const config = smtpConfig();
  if (!config) return null;
  transporter ??= nodemailer.createTransport(config);
  return transporter;
}

export const mailFrom = () => process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || "";
export const mailTo = () => process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
