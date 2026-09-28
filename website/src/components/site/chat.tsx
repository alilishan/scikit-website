"use client";

import { createContext, useContext, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site, smsHref, whatsappHref } from "@/lib/site";
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
              Hi! Tell us what you&apos;re working on and Ali or Hassan will get back to you.
            </div>
            <a
              href={whatsappHref}
              className="flex justify-center rounded-full bg-charcoal p-3 text-sm font-medium text-offwhite hover:bg-orange hover:text-white"
            >
              Message on WhatsApp
            </a>
            <a
              href={smsHref}
              className="flex justify-center rounded-full border border-warm-400 p-[11px] text-sm font-medium hover:border-charcoal"
            >
              Send an SMS
            </a>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="chat-panel"
        className="flex cursor-pointer items-center gap-2.5 rounded-full bg-orange px-5 py-3.5 text-[15px] font-medium text-white shadow-[0_14px_30px_-12px_rgba(255,106,46,0.7)]"
      >
        {open ? "Close" : "Chat with us"}
      </button>
    </div>
  );
}
