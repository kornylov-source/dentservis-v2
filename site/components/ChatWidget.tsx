"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { clinic } from "@/lib/clinic-contact";

import styles from "./ChatWidget.module.css";

const SUGGESTED_QUESTIONS = [
  "Які послуги ви надаєте?",
  "Скільки коштує імплантація?",
  "Хто ваші лікарі?",
  "Як записатись на прийом?",
];

const DISABLED_PATHS = ["/kontakty"];

/**
 * Простий рендер тексту відповіді: підтримує markdown посилання `[text](url)`
 * і збереження переносів рядків. Більше нічого не парсимо — щоб уникнути
 * залежностей і XSS-ризиків.
 */
function renderMessageText(text: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    const parts: Array<string | { text: string; href: string }> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    linkRegex.lastIndex = 0;
    while ((match = linkRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      parts.push({ text: match[1], href: match[2] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) parts.push(line.slice(lastIndex));

    return (
      <span key={lineIdx}>
        {parts.map((part, partIdx) => {
          if (typeof part === "string") return <span key={partIdx}>{part}</span>;
          const isExternal = /^https?:\/\//.test(part.href);
          const isTel = part.href.startsWith("tel:");
          return (
            <a
              key={partIdx}
              href={part.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={styles.messageLink}
            >
              {part.text}
            </a>
          );
        })}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, regenerate, stop, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError(err) {
      console.error("[ChatWidget]", err);
    },
  });

  const isWorking = status === "submitted" || status === "streaming";
  const showWelcome = messages.length === 0;

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, status]);

  useEffect(() => {
    if (isOpen && !isWorking) {
      inputRef.current?.focus();
    }
  }, [isOpen, isWorking]);

  if (DISABLED_PATHS.includes(pathname ?? "")) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isWorking) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSuggested = (question: string) => {
    if (isWorking) return;
    sendMessage({ text: question });
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.fab} ${isOpen ? styles.fabOpen : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Закрити чат" : "Відкрити чат-помічник"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M21 12c0 4.418-4.03 8-9 8-1.39 0-2.71-.28-3.89-.78L3 21l1.78-5.11C4.28 14.71 4 13.39 4 12c0-4.418 4.03-8 9-8s8 3.582 8 8z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="currentColor"
              fillOpacity="0.15"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className={styles.window}
          role="dialog"
          aria-label="AI-помічник Дент-Сервіс"
        >
          <header className={styles.header}>
            <div className={styles.avatar} aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C9.79 2 8 3.79 8 6v2H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2h-2V6c0-2.21-1.79-4-4-4zm0 2c1.1 0 2 .9 2 2v2h-4V6c0-1.1.9-2 2-2zM7.5 14.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S6 16.83 6 16s.67-1.5 1.5-1.5zm9 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={styles.headerText}>
              <p className={styles.headerTitle}>Помічник Дент-Сервіс</p>
              <p className={styles.headerSubtitle}>AI-довідник по сайту</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={styles.closeBtn}
              aria-label="Закрити чат"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div ref={scrollRef} className={styles.messages}>
            {showWelcome && (
              <div className={styles.welcome}>
                <p className={styles.welcomeText}>
                  Вітаю! 👋 Я допомагаю орієнтуватись по сайту. Питайте про послуги,
                  лікарів чи графік — підкажу.
                </p>
                <p className={styles.disclaimer}>
                  ⚠️ Я — AI-помічник, не лікар. Не вводьте особисті медичні дані.
                </p>
                <div className={styles.suggested}>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSuggested(q)}
                      className={styles.suggestedBtn}
                      disabled={isWorking}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              if (!text) return null;
              return (
                <div
                  key={m.id}
                  className={`${styles.message} ${
                    m.role === "user" ? styles.messageUser : styles.messageBot
                  }`}
                >
                  {m.role === "user" ? text : renderMessageText(text)}
                </div>
              );
            })}

            {status === "submitted" && (
              <div className={`${styles.message} ${styles.messageBot} ${styles.typing}`}>
                <span />
                <span />
                <span />
              </div>
            )}

            {error && (
              <div className={styles.errorBox}>
                <p>Не вдалось отримати відповідь. Спробуйте ще раз або зателефонуйте: {clinic.phone}.</p>
                <button
                  type="button"
                  onClick={() => regenerate()}
                  className={styles.retryBtn}
                >
                  Повторити
                </button>
              </div>
            )}
          </div>

          {status === "streaming" && (
            <button
              type="button"
              onClick={() => stop()}
              className={styles.stopBtn}
            >
              Зупинити
            </button>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Запитайте про наші послуги..."
              className={styles.input}
              disabled={isWorking}
              maxLength={500}
              aria-label="Ваше повідомлення"
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim() || isWorking}
              aria-label="Надіслати"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M3 12L21 4L13 21L11 13L3 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="currentColor"
                  fillOpacity="0.2"
                />
              </svg>
            </button>
          </form>

          <footer className={styles.footer}>
            <span>
              AI-помічник · Claude API ·{" "}
              <a href="/polityka-konfidentsiynosti" className={styles.footerLink}>
                Політика конфіденційності
              </a>
            </span>
          </footer>
        </div>
      )}
    </>
  );
}
