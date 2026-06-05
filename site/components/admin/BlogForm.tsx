"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import BlogImageUpload from "./BlogImageUpload";
import {
  saveBlogDraft,
  createBlog,
  publishBlog,
} from "@/app/(admin)/admin/(protected)/blog/actions";

type Faq = { question: string; answer: string };

export type BlogFormData = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  authorSlug: string;
  publishedAt: string;
  updatedAt: string;
  featuredImage: string;
  imageAlt: string;
  readingTimeMin: number;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  faq: Faq[];
};

export const EMPTY_BLOG: BlogFormData = {
  title: "",
  excerpt: "",
  content: "",
  category: "porady",
  authorSlug: "",
  publishedAt: "",
  updatedAt: "",
  featuredImage: "",
  imageAlt: "",
  readingTimeMin: 5,
  metaTitle: "",
  metaDescription: "",
  keywords: [],
  faq: [],
};

// cat → коротка мітка для селектора категорій
const CATEGORY_SHORT: Record<string, string> = {
  implantatsiia: "Імплантація",
  estetyka: "Естетика",
  terapiia: "Терапія",
  parodontolohiia: "Пародонтологія",
  khirurhiia: "Хірургія",
  porady: "Поради",
};

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-slate-400">{hint}</span>}
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

export default function BlogForm({
  mode,
  id,
  slug: initialSlug,
  initial,
}: {
  mode: "new" | "edit";
  id?: string;
  slug?: string;
  initial?: BlogFormData;
}) {
  const router = useRouter();
  const [data, setData] = useState<BlogFormData>(initial ?? EMPTY_BLOG);
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof BlogFormData>(k: K, v: BlogFormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function buildPayload() {
    const keywords = data.keywords.map((s) => s.trim()).filter(Boolean);
    const faq = data.faq.filter((f) => f.question.trim() || f.answer.trim());
    const updatedAt = data.updatedAt.trim();
    return {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      authorSlug: data.authorSlug,
      publishedAt: data.publishedAt,
      ...(updatedAt ? { updatedAt } : {}),
      featuredImage: data.featuredImage,
      imageAlt: data.imageAlt,
      readingTimeMin: Number(data.readingTimeMin),
      seo: {
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords,
      },
      faq,
    };
  }

  function run(fn: () => Promise<void>) {
    setErrors({});
    setTopError(null);
    setOkMsg(null);
    startTransition(fn);
  }

  function onCreate() {
    run(async () => {
      const res = await createBlog(slug, buildPayload());
      if (!res.ok) {
        setTopError(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    });
  }

  function onSaveDraft() {
    run(async () => {
      const res = await saveBlogDraft(id!, buildPayload());
      if (!res.ok) {
        setTopError(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
        return;
      }
      setOkMsg("Чернетку збережено.");
      router.refresh();
    });
  }

  function onPublish() {
    run(async () => {
      const saved = await saveBlogDraft(id!, buildPayload());
      if (!saved.ok) {
        setTopError(saved.error);
        if (saved.fieldErrors) setErrors(saved.fieldErrors);
        return;
      }
      const pub = await publishBlog(id!);
      if (!pub.ok) {
        setTopError(pub.error);
        if (pub.fieldErrors) setErrors(pub.fieldErrors);
        return;
      }
      setOkMsg("Опубліковано! Зміни вже на сайті.");
      router.refresh();
    });
  }

  async function onPreview() {
    if (mode !== "edit") return;
    const saved = await saveBlogDraft(id!, buildPayload());
    if (!saved.ok) {
      setTopError(saved.error);
      if (saved.fieldErrors) setErrors(saved.fieldErrors);
      return;
    }
    window.open(`/admin/preview?type=blog&slug=${slug}`, "_blank", "noopener");
  }

  return (
    <div className="space-y-6 pb-24">
      {topError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {topError}
        </div>
      )}
      {okMsg && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          {okMsg}
        </div>
      )}

      <Section title="Головне зображення">
        <BlogImageUpload
          value={data.featuredImage}
          onChange={(url) => set("featuredImage", url)}
        />
        {errors.featuredImage && (
          <p className="mt-2 text-xs text-red-600">{errors.featuredImage}</p>
        )}
        <div className="mt-4">
          <Field label="Alt зображення (для SEO)" error={errors.imageAlt}>
            <input
              className={inputCls}
              value={data.imageAlt}
              onChange={(e) => set("imageAlt", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="Основне">
        <div className="grid gap-4 sm:grid-cols-2">
          {mode === "new" && (
            <Field
              label="Slug (адреса)"
              hint="латиницею, напр. implantatsiia-haid"
              error={errors.slug}
            >
              <input
                className={inputCls}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </Field>
          )}
          <Field label="Заголовок" error={errors.title}>
            <input
              className={inputCls}
              value={data.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>
          <Field
            label="Короткий опис (превʼю в списку)"
            error={errors.excerpt}
          >
            <textarea
              className={inputCls}
              rows={3}
              value={data.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
            />
          </Field>
          <Field label="Категорія" error={errors.category}>
            <select
              className={inputCls}
              value={data.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {Object.entries(CATEGORY_SHORT).map(([cat, label]) => (
                <option key={cat} value={cat}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Slug автора"
            hint="напр. zhmakov — має збігатися зі slug лікаря"
            error={errors.authorSlug}
          >
            <input
              className={inputCls}
              value={data.authorSlug}
              onChange={(e) => set("authorSlug", e.target.value)}
            />
          </Field>
          <Field
            label="Дата публікації"
            hint="формат 2026-05-01"
            error={errors.publishedAt}
          >
            <input
              className={inputCls}
              type="date"
              value={data.publishedAt}
              onChange={(e) => set("publishedAt", e.target.value)}
            />
          </Field>
          <Field
            label="Дата оновлення (необовʼязково)"
            hint="формат 2026-05-01"
          >
            <input
              className={inputCls}
              value={data.updatedAt}
              onChange={(e) => set("updatedAt", e.target.value)}
            />
          </Field>
          <Field label="Час читання, хв" error={errors.readingTimeMin}>
            <input
              className={inputCls}
              type="number"
              value={data.readingTimeMin}
              onChange={(e) =>
                set("readingTimeMin", Number(e.target.value))
              }
            />
          </Field>
        </div>
      </Section>

      <Section title="Тіло статті">
        {mode === "edit" && data.content ? (
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">
              Тіло статті (редагується згодом окремо)
            </p>
            <div
              className="prose prose-sm max-h-96 max-w-none overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        ) : (
          <Field
            label="Тіло статті (HTML)"
            hint="HTML буде очищено автоматично при збереженні"
            error={errors.content}
          >
            <textarea
              className={`${inputCls} font-mono`}
              rows={12}
              value={data.content}
              onChange={(e) => set("content", e.target.value)}
            />
          </Field>
        )}
      </Section>

      <Section title="SEO">
        <div className="space-y-4">
          <Field label="SEO-заголовок (metaTitle)" error={errors["seo.metaTitle"]}>
            <input
              className={inputCls}
              value={data.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
            />
          </Field>
          <Field
            label="SEO-опис (metaDescription)"
            error={errors["seo.metaDescription"]}
          >
            <textarea
              className={inputCls}
              rows={2}
              value={data.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
            />
          </Field>
          <div>
            <span className="text-sm font-medium text-slate-700">
              Ключові слова
            </span>
            <div className="mt-1 space-y-2">
              {data.keywords.map((v, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputCls}
                    value={v}
                    onChange={(e) => {
                      const next = [...data.keywords];
                      next[i] = e.target.value;
                      set("keywords", next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "keywords",
                        data.keywords.filter((_, idx) => idx !== i),
                      )
                    }
                    className="shrink-0 rounded-md border border-slate-300 px-2 text-slate-500 hover:bg-slate-50"
                    aria-label="Видалити"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => set("keywords", [...data.keywords, ""])}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              + Додати ключове слово
            </button>
          </div>
        </div>
      </Section>

      <Section title="FAQ (необовʼязково)">
        <div className="space-y-3">
          {data.faq.map((f, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Питання {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "faq",
                      data.faq.filter((_, idx) => idx !== i),
                    )
                  }
                  className="text-xs text-red-500 hover:underline"
                >
                  Видалити
                </button>
              </div>
              <input
                className={`${inputCls} mb-2`}
                placeholder="Питання"
                value={f.question}
                onChange={(e) => {
                  const next = [...data.faq];
                  next[i] = { ...next[i], question: e.target.value };
                  set("faq", next);
                }}
              />
              <textarea
                className={inputCls}
                rows={2}
                placeholder="Відповідь"
                value={f.answer}
                onChange={(e) => {
                  const next = [...data.faq];
                  next[i] = { ...next[i], answer: e.target.value };
                  set("faq", next);
                }}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => set("faq", [...data.faq, { question: "", answer: "" }])}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          + Додати питання
        </button>
      </Section>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap gap-3 px-6 py-3">
          {mode === "new" ? (
            <button
              onClick={onCreate}
              disabled={pending}
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {pending ? "Створюємо…" : "Створити статтю (чернетка)"}
            </button>
          ) : (
            <>
              <button
                onClick={onSaveDraft}
                disabled={pending}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2 font-medium hover:bg-slate-50 disabled:opacity-60"
              >
                Зберегти чернетку
              </button>
              <button
                onClick={onPreview}
                disabled={pending}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2 font-medium hover:bg-slate-50 disabled:opacity-60"
              >
                Переглянути
              </button>
              <button
                onClick={onPublish}
                disabled={pending}
                className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-60"
              >
                {pending ? "…" : "Опублікувати"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
