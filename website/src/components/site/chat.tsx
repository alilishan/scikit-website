"use client";

import { createContext, useContext, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MailIcon } from "lucide-react";
import { site, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

type ChatContextValue = { open: boolean; setOpen: (open: boolean) => void };
const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // Remember the page the chat was opened on, so it closes itself after navigating (as in the design).
  const pathname = usePathname();
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);
  return <ChatContext.Provider value={{ open, setOpen }}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}

/** Any button elsewhere on the page that opens the chat panel. */
export function OpenChatButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { setOpen } = useChat();
  return (
    <button type="button" onClick={() => setOpen(true)} className={cn("cursor-pointer", className)}>
      {children}
    </button>
  );
}

export function ChatWidget() {
  const { open, setOpen } = useChat();
  if (!site.showChat) return null;

  return (
    <div className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <div
          id="chat-panel"
          role="dialog"
          aria-label="Chat with Scikit"
          className="w-[300px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[14px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08),0_24px_50px_-20px_rgba(0,0,0,0.35)]"
        >
          <div className="flex items-center gap-3 bg-charcoal px-5 py-[18px] text-offwhite">
            <Image src="/logos/icon-dark.svg" alt="" width={40} height={40} className="-m-1" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-semibold">Scikit</span>
              <span className="text-xs text-[#B5B5B5]">Usually replies within a business day</span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 px-5 py-[18px]">
            <div className="rounded-[10px] bg-offwhite px-3.5 py-3 text-sm leading-normal">
              Hi! Tell us what you&apos;re working on and Hassan or Ali will get back to you.
            </div>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] p-3 text-sm font-medium text-white shadow-button hover:bg-[#1EBE5A]"
              >
                <WhatsAppIcon className="size-4" />
                Message on WhatsApp
              </a>
            )}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className={
                whatsappHref
                  ? "flex items-center justify-center gap-2 rounded-full border border-warm-400 p-[11px] text-sm font-medium hover:border-charcoal"
                  : "flex items-center justify-center gap-2 rounded-full bg-charcoal p-3 text-sm font-medium text-offwhite shadow-button hover:bg-orange hover:text-white"
              }
            >
              <MailIcon aria-hidden className="size-4" />
              Email us
            </Link>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="chat-panel"
        className="flex cursor-pointer items-center gap-2.5 rounded-full bg-orange-deep px-5 py-3.5 text-[15px] font-medium text-white shadow-[0_14px_30px_-12px_rgba(201,68,14,0.7)]"
      >
        {open ? "Close" : "Chat with us"}
      </button>
    </div>
  );
}

/** WhatsApp glyph (Lucide has no brand icons). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 1 1 7.99 4.42Zm8.03-17.46A11.3 11.3 0 0 0 12.05.7C5.8.7.72 5.78.72 12.03c0 2 .52 3.95 1.52 5.67L.62 23.3l5.73-1.5a11.3 11.3 0 0 0 5.7 1.45h.01c6.25 0 11.33-5.08 11.33-11.33 0-3.03-1.18-5.87-3.31-8.01Z" />
    </svg>
  );
}
