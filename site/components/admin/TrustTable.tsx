"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  publishTrust,
  deleteTrust,
} from "@/app/(admin)/admin/(protected)/trust/actions";

type State = "published" | "draft" | "unpublished_changes";
type Item = {
  id: string;
  slug: string;
  number: string;
  label: string;
  state: State;
};

const STATE_BADGE: Record<State, { label: string; cls: string }> = {
  published: { label: "Опубліковано", cls: "bg-green-100 text-green-800" },
  draft: { label: "Чернетка", cls: "bg-slate-100 text-slate-700" },
  unpublished_changes: {
    label: "Незбережені зміни",
    cls: "bg-amber-100 text-amber-800",
  },
};

export default function TrustTable({ items }: { items: Item[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onPublish(id: string) {
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      const res = await publishTrust(id);
      setBusyId(null);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function onDelete(id: string, label: string) {
    if (!confirm(`Видалити «${label}»? Цю дію не можна скасувати.`)) return;
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      const res = await deleteTrust(id);
      setBusyId(null);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Число</th>
              <th className="px-4 py-3 font-medium">Підпис</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 text-right font-medium">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((it) => {
              const badge = STATE_BADGE[it.state];
              const isBusy = busyId === it.id && pending;
              return (
                <tr key={it.id}>
                  <td className="px-4 py-3">
                    <div className="text-lg font-semibold text-slate-900">
                      {it.number}
                    </div>
                    <div className="text-xs text-slate-400">{it.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{it.label}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <a
                        href={`/admin/trust/${it.id}`}
                        className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50"
                      >
                        Редагувати
                      </a>
                      {it.state !== "published" && (
                        <button
                          onClick={() => onPublish(it.id)}
                          disabled={isBusy}
                          className="rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700 disabled:opacity-60"
                        >
                          {isBusy ? "…" : "Опублікувати"}
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(it.id, it.label)}
                        disabled={isBusy}
                        className="rounded-md border border-red-300 px-3 py-1 text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
