"use server";

import { getMailer, mailFrom, mailTo } from "@/lib/mailer";

export type EnquiryState = { status: "idle" | "success" | "error"; message?: string };

const clean = (v: FormDataEntryValue | null, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
// Single-line fields end up in email headers, so collapse any line breaks.
const line = (v: FormDataEntryValue | null, max = 200) => clean(v, max).replace(/\s+/g, " ");

/**
 * Handles the "Start a project" form.
 * Emails the enquiry over SMTP (Nodemailer) using the SMTP_* settings in the environment;
 * if they aren't set, the enquiry is only logged (useful in development).
 */
export async function sendEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // Honeypot: real people never fill this hidden field.
  if (clean(formData.get("company_website"))) return { status: "success" };

  const enquiry = {
    name: line(formData.get("name"), 200),
    business: line(formData.get("business"), 200),
    email: line(formData.get("email"), 200),
    phone: line(formData.get("phone"), 50),
    website: line(formData.get("website"), 300),
    needs: formData.getAll("needs").map((v) => line(v, 50)).filter(Boolean),
    budget: line(formData.get("budget"), 50),
    about: clean(formData.get("about"), 5000),
  };

  if (!enquiry.name || !enquiry.about) {
    return { status: "error", message: "Add your name and a few words about your business, then send again." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    return { status: "error", message: "Enter a valid email address so we can reply." };
  }

  const text = [
    `Name: ${enquiry.name}`,
    `Business: ${enquiry.business || "-"}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || "-"}`,
    `Current website: ${enquiry.website || "-"}`,
    `Needs: ${enquiry.needs.join(", ") || "-"}`,
    `Budget: ${enquiry.budget || "-"}`,
    "",
    enquiry.about,
  ].join("\n");

  const mailer = getMailer();
  const to = mailTo();
  if (!mailer || !to) {
    console.info("[enquiry] SMTP not configured (SMTP_HOST / SMTP_USER / SMTP_PASS / CONTACT_TO_EMAIL). Enquiry received:\n" + text);
    return { status: "success" };
  }

  try {
    await mailer.sendMail({
      from: `"Scikit website" <${mailFrom()}>`,
      to,
      replyTo: `"${enquiry.name.replace(/"/g, "")}" <${enquiry.email}>`,
      subject: `New enquiry: ${enquiry.business || enquiry.name}`,
      text,
    });
  } catch (err) {
    console.error("[enquiry] SMTP send failed", err);
    return { status: "error", message: "Your message didn't send. Try again, or email us directly." };
  }
  return { status: "success" };
}
