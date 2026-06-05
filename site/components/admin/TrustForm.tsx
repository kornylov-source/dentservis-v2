"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveTrustDraft,
  createTrust,
  publishTrust,
} from "@/app/(admin)/admin/(protected)/trust/actions";

export type TrustFormData = {
  number: string;
  label: string;
};

export const EMPTY_TRUST: TrustFormData = {
  number: "",
  label: "",
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

export default function TrustForm({
  mode,
  id,
  slug: initialSlug,
  initial,
}: {
  mode: "new" | "edit";
  id?: string;
  slug?: string;
  initial?: TrustFormData;
}) {
  const router = useRouter();
  const [data, setData] = useState<TrustFormData>(initial ?? EMPTY_TRUST);
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof TrustFormData>(k: K, v: TrustFormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function buildPayload() {
    return {
      number: data.number,
      label: data.label,
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
      const res = await createTrust(slug, buildPayload());
      if (!res.ok) {
        setTopError(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
        return;
      }
      router.push("/admin/trust");
      router.refresh();
    });
  }

  function onSaveDraft() {
    run(async () => {
      const res = await saveTrustDraft(id!, buildPayload());
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
      const saved = await saveTrustDraft(id!, buildPayload());
      if (!saved.ok) {
        setTopError(saved.error);
        if (saved.fieldErrors) setErrors(saved.fieldErrors);
        return;
      }
      const pub = await publishTrust(id!);
      if (!pub.ok) {
        setTopError(pub.error);
        if (pub.fieldErrors) setErrors(pub.fieldErrors);
        return;
      }
      setOkMsg("Опубліковано! Зміни вже на сайті.");
      router.refresh();
    });
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

      {/* Основне */}
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Показник</h2>
        {mode === "new" && (
          <Field
            label="Slug (адреса)"
            hint="латиницею, напр. patients"
            error={errors.slug}
          >
            <input
              className={inputCls}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="patients"
            />
          </Field>
        )}
        <Field
          label="Число"
          hint="напр. 20 000+, 85, МОЗ"
          error={errors.number}
        >
          <input
            className={inputCls}
            value={data.number}
            onChange={(e) => set("number", e.target.value)}
            placeholder="20 000+"
          />
        </Field>
        <Field label="Підпис" error={errors.label}>
          <input
            className={inputCls}
            value={data.label}
            onChange={(e) => set("label", e.target.value)}
            placeholder="пацієнтів з 2003 року"
          />
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
            {pending ? "Створюємо…" : "Створити (чернетка)"}
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
