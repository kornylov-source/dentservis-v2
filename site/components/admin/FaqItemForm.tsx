"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createFaqItem,
  saveFaqItemDraft,
  publishFaqItem,
} from "@/app/(admin)/admin/(protected)/faq/actions";

export type FaqItemFormData = {
  question: string;
  answer: string;
};

export const EMPTY_ITEM: FaqItemFormData = { question: "", answer: "" };

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

export default function FaqItemForm({
  mode,
  groupId,
  id,
  initial,
}: {
  mode: "new" | "edit";
  groupId: string;
  id?: string;
  initial?: FaqItemFormData;
}) {
  const router = useRouter();
  const [data, setData] = useState<FaqItemFormData>(initial ?? EMPTY_ITEM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const backUrl = `/admin/faq/${groupId}`;

  function set<K extends keyof FaqItemFormData>(k: K, v: FaqItemFormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function buildPayload() {
    return { question: data.question, answer: data.answer };
  }

  function run(fn: () => Promise<void>) {
    setErrors({});
    setTopError(null);
    setOkMsg(null);
    startTransition(fn);
  }

  function fail(res: { error: string; fieldErrors?: Record<string, string> }) {
    setTopError(res.error);
    if (res.fieldErrors) setErrors(res.fieldErrors);
  }

  function onCreate() {
    run(async () => {
      const res = await createFaqItem(groupId, buildPayload());
      if (!res.ok) return fail(res);
      router.push(backUrl);
      router.refresh();
    });
  }

  function onSaveDraft() {
    run(async () => {
      const res = await saveFaqItemDraft(id!, buildPayload());
      if (!res.ok) return fail(res);
      setOkMsg("Чернетку збережено.");
      router.refresh();
    });
  }

  function onPublish() {
    run(async () => {
      const saved = await saveFaqItemDraft(id!, buildPayload());
      if (!saved.ok) return fail(saved);
      const pub = await publishFaqItem(id!);
      if (!pub.ok) return fail(pub);
      setOkMsg("Опубліковано! Зміни вже на сторінці /faq.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {topError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{topError}</div>
      )}
      {okMsg && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{okMsg}</div>
      )}

      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <Field label="Питання" error={errors.question}>
          <input
            className={inputCls}
            value={data.question}
            onChange={(e) => set("question", e.target.value)}
            placeholder="Як записатися на консультацію?"
          />
        </Field>
        <Field label="Відповідь" error={errors.answer}>
          <textarea
            className={inputCls}
            rows={8}
            value={data.answer}
            onChange={(e) => set("answer", e.target.value)}
          />
        </Field>
      </section>

      <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-slate-200 bg-slate-50 py-4">
        {mode === "new" ? (
          <button
            onClick={onCreate}
            disabled={pending}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {pending ? "Створюємо…" : "Створити питання (чернетка)"}
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
