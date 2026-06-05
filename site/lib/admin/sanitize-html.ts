import "server-only";
import sanitizeHtmlLib from "sanitize-html";

/**
 * Серверна санітизація HTML-тіла статті блогу.
 * Тіло вставляється через dangerouslySetInnerHTML (клас .w-richtext), тож БЕЗ цієї
 * очистки будь-який <script>/onclick у контенті виконався б у браузері пацієнта (XSS).
 *
 * Whitelist підібраний рівно під теги, що реально вживаються в наявних 15 статтях:
 *   p, h2, h3, strong, em, ul, ol, li, a, table/thead/tbody/tr/td/th, blockquote, br.
 * Усе інше (script, style, iframe, on*-атрибути, інлайн-стилі) — вирізається.
 *
 * Посилання: дозволені тільки відносні (/...) і явні http(s)/mailto/tel — без javascript:.
 */

const ALLOWED_TAGS = [
  "p",
  "h2",
  "h3",
  "h4",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "br",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
];

export function sanitizeArticleHtml(dirty: string): string {
  return sanitizeHtmlLib(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      // ta
      table: ["class"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
    },
    // Тільки безпечні схеми. javascript:, data: — заборонені.
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { a: ["http", "https", "mailto", "tel"] },
    // Відносні URL (напр. /kontakty, /blog/...) дозволені.
    allowProtocolRelative: false,
    // Зовнішнім посиланням додаємо безпечні rel; не чіпаємо внутрішні.
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const isExternal = /^https?:\/\//i.test(href);
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            ...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer nofollow" }
              : {}),
          },
        };
      },
    },
    // Прибираємо порожні теги-сміття, але лишаємо <br> і клітинки таблиць.
    nonTextTags: ["script", "style", "textarea", "noscript"],
  });
}
