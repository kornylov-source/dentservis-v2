"use client";

import { useState } from "react";
import { uploadReviewAvatar } from "@/app/(admin)/admin/(protected)/reviews/actions";

export default function ReviewAvatarUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadReviewAvatar(fd);
    setUploading(false);
    e.target.value = "";
    if (!res.ok) setError(res.error);
    else onChange(res.url);
  }

  return (
    <div className="flex items-start gap-4">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="h-16 w-16 rounded-full border border-slate-200 object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-slate-300 text-center text-xs text-slate-400">
          Немає
        </div>
      )}
      <div>
        <label className="inline-block cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
          {uploading
            ? "Завантаження…"
            : value
              ? "Замінити фото"
              : "Завантажити фото"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFile}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <p className="mt-2 max-w-xs text-xs text-slate-400">
          Фото пацієнта (аватар). JPG, PNG або WEBP, до 5 МБ.
        </p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
