"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  publishReview,
  deleteReview,
} from "@/app/(admin)/admin/(protected)/reviews/actions";

type State = "published" | "draft" | "unpublished_changes";
type Item = {
  id: string;
  slug: string;
  author: string;
  avatar: string;
  stars: number;
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

export default function ReviewsTable({ items }: { items: Item[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onPublish(id: string) {
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      const res = await publishReview(id);
      setBusyId(null);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function onDelete(id: string, author: string) {
    if (!confirm(`Видалити відгук «${author}»?`)) return;
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      const res = await deleteReview(id);
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
              <th className="px-4 py-3 font-medium">Аватар</th>
              <th className="px-4 py-3 font-medium">Автор</th>
              <th className="px-4 py-3 font-medium">Зірки</th>
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
                    {it.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.avatar}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-slate-100" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{it.author}</div>
                    <div className="text-xs text-slate-400">{it.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-amber-500">{"★".repeat(it.stars)}</span>
                  </td>
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
                        href={`/admin/reviews/${it.id}`}
                        className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50"
                      >
                        Редагувати
                      </a>
                      <a
                        href="/admin/preview?type=review"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50"
                      >
                        Переглянути
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
                        onClick={() => onDelete(it.id, it.author)}
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
