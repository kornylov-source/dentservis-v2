"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ReviewAvatarUpload from "./ReviewAvatarUpload";
import {
  saveReviewDraft,
  createReview,
  publishReview,
} from "@/app/(admin)/admin/(protected)/reviews/actions";

export type ReviewFormData = {
  author: string;
  text: string;
  avatar: string;
  stars: number;
};

export const EMPTY_REVIEW: ReviewFormData = {
  author: "",
  text: "",
  avatar: "",
  stars: 5,
};

// --- маленькі поля ---
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

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

export default function ReviewForm({
  mode,
  id,
  slug: initialSlug,
  initial,
}: {
  mode: "new" | "edit";
  id?: string;
  slug?: string;
  initial?: ReviewFormData;
}) {
  const router = useRouter();
  const [data, setData] = useState<ReviewFormData>(initial ?? EMPTY_REVIEW);
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof ReviewFormData>(k: K, v: ReviewFormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function buildPayload() {
    return {
      author: data.author,
      text: data.text,
      avatar: data.avatar,
      stars: Number(data.stars),
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
      const res = await createReview(slug, buildPayload());
      if (!res.ok) {
        setTopError(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
        return;
      }
      router.push("/admin/reviews");
      router.refresh();
    });
  }

  function onSaveDraft() {
    run(async () => {
      const res = await saveReviewDraft(id!, buildPayload());
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
      const saved = await saveReviewDraft(id!, buildPayload());
      if (!saved.ok) {
        setTopError(saved.error);
        if (saved.fieldErrors) setErrors(saved.fieldErrors);
        return;
      }
      const pub = await publishReview(id!);
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
    const saved = await saveReviewDraft(id!, buildPayload());
    if (!saved.ok) {
      setTopError(saved.error);
      if (saved.fieldErrors) setErrors(saved.fieldErrors);
      return;
    }
    window.open("/admin/preview?type=review", "_blank", "noopener");
  }

  return (
    <div className="space-y-6">
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

      {/* Аватар */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Аватар</h2>
        <ReviewAvatarUpload
          value={data.avatar}
          onChange={(url) => set("avatar", url)}
        />
        {errors.avatar && (
          <p className="mt-2 text-xs text-red-600">{errors.avatar}</p>
        )}
      </section>

      {/* Основне */}
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Основна інформація
        </h2>
        {mode === "new" && (
          <Field
            label="Slug (адреса)"
            hint="латиницею, напр. starodubets"
            error={errors.slug}
          >
            <input
              className={inputCls}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="starodubets"
            />
          </Field>
        )}
        <Field label="Ім'я автора" error={errors.author}>
          <input
            className={inputCls}
            value={data.author}
            onChange={(e) => set("author", e.target.value)}
            placeholder="Олена Стародубець"
          />
        </Field>
        <Field label="Текст відгуку" error={errors.text}>
          <textarea
            className={inputCls}
            rows={5}
            value={data.text}
            onChange={(e) => set("text", e.target.value)}
          />
        </Field>
        <Field label="Зірок" error={errors.stars}>
          <select
            className={inputCls}
            value={data.stars}
            onChange={(e) => set("stars", Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
      </section>

      {/* Кнопки */}
      <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-slate-200 bg-slate-50 py-4">
        {mode === "new" ? (
          <button
            onClick={onCreate}
            disabled={pending}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {pending ? "Створюємо…" : "Створити відгук (чернетка)"}
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
  );
}
