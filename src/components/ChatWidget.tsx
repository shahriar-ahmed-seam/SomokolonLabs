"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, animate, motion, useDragControls, useMotionValue } from "framer-motion";
import { ArrowUp, MessageCircle, Minus, RotateCcw, X } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import styles from "./ChatWidget.module.css";

/**
 * Floating website assistant, messenger style.
 *
 *  - The launcher bubble can be dragged anywhere and snaps to the nearest
 *    side, like a chat head. The panel opens on that side.
 *  - On desktop the panel can also be dragged by its header. On phones it
 *    opens full screen.
 *  - Replies stream from /api/chat. The conversation survives page changes
 *    for the tab's lifetime (sessionStorage) and is never stored server-side.
 *  - Escape minimises; focus returns to the launcher.
 */

type Msg = { role: "user" | "assistant"; content: string; local?: boolean; error?: boolean };

const STORAGE_KEY = "somo-chat-v1";
const MAX_INPUT = 800;
const BUBBLE = 60; // launcher size, px
const EDGE = 20; // gap from the viewport edge, px

const GREETING: Msg = {
  role: "assistant",
  local: true,
  content:
    "Hi, I'm Somo, the Somokolon Labs assistant. Ask me about our services, the products we've built, or how a project gets started.",
};

const SUGGESTIONS = ["What do you build?", "Show me a live demo", "How does a project start?"];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"left" | "right">("right");
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [nudge, setNudge] = useState(false);

  const boundsRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const dragged = useRef(false);

  // Launcher position is an offset from its resting spot (bottom-right).
  const bx = useMotionValue(0);
  const by = useMotionValue(0);
  const panelDrag = useDragControls();

  // Restore the conversation after mount (never during render: hydration).
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      const parsed = saved ? (JSON.parse(saved) as Msg[]) : null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from storage
      if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
    } catch {
      /* storage unavailable or corrupt: start fresh */
    }
  }, []);

  useEffect(() => {
    if (pending) return; // save settled turns, not every streamed token
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore quota / private mode */
    }
  }, [messages, pending]);

  // One gentle nudge per session, if the visitor hasn't opened the chat.
  useEffect(() => {
    if (sessionStorage.getItem(`${STORAGE_KEY}-nudged`)) return;
    const show = window.setTimeout(() => setNudge(true), 6000);
    const hide = window.setTimeout(() => setNudge(false), 14000);
    sessionStorage.setItem(`${STORAGE_KEY}-nudged`, "1");
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Return focus to the launcher after it is visible again (it is hidden
  // while the panel is open on phones, so focusing synchronously fails).
  const returnFocus = useRef(false);
  useEffect(() => {
    if (!open && returnFocus.current) {
      returnFocus.current = false;
      launcherRef.current?.focus();
    }
  }, [open]);

  const minimise = useCallback(() => {
    returnFocus.current = true;
    setOpen(false);
  }, []);

  // Escape minimises while the panel is open, even if focus has fallen back
  // to the page (e.g. a suggestion chip that removed itself on click).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      const active = document.activeElement;
      const panel = document.getElementById("somo-chat-panel");
      const inPanel = !!panel && !!active && panel.contains(active);
      const onPage = !active || active === document.body || active === launcherRef.current;
      if (inPanel || onPage) minimise();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, minimise]);

  const reset = () => {
    abortRef.current?.abort();
    setPending(false);
    setMessages([GREETING]);
    setInput("");
    inputRef.current?.focus();
  };

  const send = async (text: string) => {
    const content = text.trim().slice(0, MAX_INPUT);
    if (!content || pending) return;

    const history: Msg[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setPending(true);
    // Suggestion chips unmount once a turn starts; keep focus in the composer.
    inputRef.current?.focus();

    const controller = new AbortController();
    abortRef.current = controller;

    const write = (update: (current: string) => string, error = false) =>
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: update(last.content), error };
        return next;
      });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: history
            .filter((m) => !m.local && !m.error)
            .map(({ role, content: c }) => ({ role, content: c })),
        }),
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        write(() => data?.error ?? "Something went wrong. You can reach us through the contact page.", true);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        write((current) => current + chunk);
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      write(() => "I couldn't connect just now. You can reach us through the contact page.", true);
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setPending(false);
      }
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onInputKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(input);
    }
  };

  /** Snap the bubble to whichever side it was dropped nearer. */
  const onBubbleDragEnd = () => {
    const el = launcherRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const toLeft = rect.left + rect.width / 2 < window.innerWidth / 2;
    const travel = window.innerWidth - BUBBLE - EDGE * 2;
    setSide(toLeft ? "left" : "right");
    animate(bx, toLeft ? -travel : 0, { type: "spring", stiffness: 420, damping: 34 });
    // Let the click that ends a drag be ignored, then re-arm.
    window.setTimeout(() => (dragged.current = false), 0);
  };

  const lastIsEmptyAssistant =
    pending && messages[messages.length - 1]?.role === "assistant" && !messages[messages.length - 1].content;

  return (
    <>
      {/* Drag bounds for both the bubble and the panel. */}
      <div ref={boundsRef} aria-hidden="true" className="pointer-events-none fixed inset-3 z-[69]" />

      {/* Launcher */}
      <motion.div
        className={`fixed bottom-5 right-5 z-[70] ${open ? "max-sm:hidden" : ""}`}
        style={{ x: bx, y: by }}
        drag
        dragMomentum={false}
        dragElastic={0.12}
        dragConstraints={boundsRef}
        onDragStart={() => {
          dragged.current = true;
          setNudge(false);
        }}
        onDragEnd={onBubbleDragEnd}
      >
        <AnimatePresence>
          {nudge && !open && (
            <motion.button
              type="button"
              onClick={() => {
                setNudge(false);
                setOpen(true);
              }}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              className={`absolute bottom-full mb-3 w-max max-w-[15rem] rounded-2xl bg-white px-4 py-3 text-left text-sm font-medium text-ink shadow-[0_16px_40px_-16px_rgba(11,21,36,0.45)] ring-1 ring-border ${
                side === "right" ? "right-0" : "left-0"
              }`}
            >
              Questions about a project? Ask Somo.
            </motion.button>
          )}
        </AnimatePresence>

        <button
          ref={launcherRef}
          type="button"
          aria-label={open ? "Minimise chat" : "Chat with Somokolon Labs"}
          aria-expanded={open}
          aria-controls="somo-chat-panel"
          onClick={() => {
            if (dragged.current) return;
            setNudge(false);
            setOpen((v) => !v);
          }}
          className="relative flex touch-none items-center justify-center rounded-[14px] bg-accent text-white shadow-[0_18px_40px_-12px_rgba(217,45,32,0.75)] transition-[background-color,transform] hover:bg-accent-dark active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          style={{ width: BUBBLE, height: BUBBLE }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex"
            >
              {open ? <X size={24} aria-hidden="true" /> : <MessageCircle size={26} aria-hidden="true" />}
            </motion.span>
          </AnimatePresence>
          {!open && (
            <span className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" aria-hidden="true" />
          )}
        </button>
      </motion.div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="somo-chat-panel"
            role="dialog"
            aria-label="Chat with Somokolon Labs"
            aria-modal="false"
            drag
            dragListener={false}
            dragControls={panelDrag}
            dragMomentum={false}
            dragConstraints={boundsRef}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-0 z-[71] flex flex-col overflow-hidden bg-white sm:inset-auto sm:bottom-24 sm:h-[min(600px,calc(100svh-8rem))] sm:w-[380px] sm:rounded-3xl sm:shadow-[0_40px_100px_-30px_rgba(11,21,36,0.55)] sm:ring-1 sm:ring-black/5 ${
              side === "right" ? "sm:right-5" : "sm:left-5"
            }`}
          >
            {/* Header doubles as the drag handle on desktop */}
            <div
              onPointerDown={(e) => {
                if (window.matchMedia("(min-width: 640px)").matches && !(e.target as HTMLElement).closest("button")) {
                  panelDrag.start(e);
                }
              }}
              className="flex cursor-default items-center gap-3 bg-ink px-4 py-3.5 text-white sm:cursor-grab sm:active:cursor-grabbing"
            >
              <LogoMark className="h-10 w-10 shrink-0" onDark title="" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Somo</p>
                <p className="flex items-center gap-1.5 truncate text-xs text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  AI assistant · Somokolon Labs
                </p>
              </div>
              <HeaderButton label="Start over" onClick={reset}>
                <RotateCcw size={16} aria-hidden="true" />
              </HeaderButton>
              <HeaderButton label="Minimise chat" onClick={minimise}>
                <Minus size={18} aria-hidden="true" />
              </HeaderButton>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              role="log"
              aria-live="polite"
              aria-busy={pending}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-background-soft px-4 py-5"
            >
              {messages.map((m, i) =>
                lastIsEmptyAssistant && i === messages.length - 1 ? null : (
                  <Bubble key={i} message={m} onNavigate={() => setOpen(false)} />
                )
              )}
              {lastIsEmptyAssistant && <Typing />}

              {messages.length === 1 && !pending && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="rounded-md border border-ink/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form onSubmit={onSubmit} className="border-t border-border bg-white p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-border bg-background-soft p-1.5 pl-3.5 focus-within:border-ink/30">
                <label htmlFor="somo-input" className="sr-only">
                  Type your message
                </label>
                <textarea
                  id="somo-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_INPUT}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="Type your message…"
                  className="max-h-32 min-h-[2.25rem] flex-1 resize-none bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-soft/70 [field-sizing:content]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || pending}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-ink/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <ArrowUp size={18} aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 px-1 text-[11px] leading-snug text-ink-soft">
                AI replies can be wrong. Messages are sent to DeepSeek to write
                replies, so please don&apos;t share personal details (
                <Link href="/privacy" className="font-semibold text-ink underline underline-offset-2" onClick={() => setOpen(false)}>
                  privacy
                </Link>
                ). For anything binding,{" "}
                <Link href="/contact" className="font-semibold text-ink underline underline-offset-2" onClick={() => setOpen(false)}>
                  contact us
                </Link>
                .
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HeaderButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-md text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {children}
    </button>
  );
}

function Typing() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-sm ring-1 ring-border">
      <span className="sr-only">Somo is typing</span>
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          aria-hidden="true"
          className={`${styles.typingDot} h-1.5 w-1.5 rounded-full bg-ink-soft`}
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </div>
  );
}

function Bubble({ message, onNavigate }: { message: Msg; onNavigate: () => void }) {
  const mine = message.role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          mine
            ? "whitespace-pre-wrap rounded-br-md bg-ink text-white"
            : message.error
              ? "rounded-bl-md bg-accent/10 text-ink ring-1 ring-accent/20"
              : "rounded-bl-md bg-white text-ink shadow-sm ring-1 ring-border"
        }`}
      >
        {mine ? message.content : <Rich text={message.content} onNavigate={onNavigate} />}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ Rich text
// A deliberately tiny renderer: markdown links, bare URLs, **bold**, and
// "- " list lines. Everything becomes React elements; nothing is injected as
// HTML. Links are limited to site paths and https URLs.

const INLINE = /\[([^\]]+)\]\(((?:\/|https:\/\/)[^\s)]*)\)|(https:\/\/[^\s)]+[^\s).,;:!?])|\*\*([^*]+)\*\*/g;

function Rich({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  // Collapse runs of blank lines so the model's spacing can't balloon a bubble.
  const lines = text.replace(/\n{3,}/g, "\n\n").split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const bullet = /^\s*[-*•]\s+/.test(line);
        const body = bullet ? line.replace(/^\s*[-*•]\s+/, "") : line;
        if (bullet) {
          return (
            <span key={i} className="flex gap-2">
              <span aria-hidden="true" className="text-accent">
                •
              </span>
              <span>{inline(body, onNavigate)}</span>
            </span>
          );
        }
        return (
          <span key={i} className={body.trim() ? "block" : "block h-2"}>
            {inline(body, onNavigate)}
          </span>
        );
      })}
    </>
  );
}

function inline(text: string, onNavigate: () => void): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const [, label, href, bare, bold] = m;
    const key = `${at}-${m[0].length}`;
    const linkClass = "font-semibold text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent";
    if (bold) {
      out.push(<strong key={key}>{bold}</strong>);
    } else if (href?.startsWith("/")) {
      out.push(
        <Link key={key} href={href} className={linkClass} onClick={onNavigate}>
          {label}
        </Link>
      );
    } else {
      const url = href ?? bare;
      out.push(
        <a key={key} href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {label ?? url.replace(/^https:\/\//, "")}
        </a>
      );
    }
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
