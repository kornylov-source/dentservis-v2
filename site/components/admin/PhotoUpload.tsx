"use client";

import { useState } from "react";
import { uploadDoctorPhoto } from "@/app/(admin)/admin/(protected)/doctors/actions";

export default function PhotoUpload({
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
    const res = await uploadDoctorPhoto(fd);
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
          className="h-[128px] w-[102px] rounded-lg border border-slate-200 object-cover"
        />
      ) : (
        <div className="flex h-[128px] w-[102px] items-center justify-center rounded-lg border border-dashed border-slate-300 text-center text-xs text-slate-400">
          Немає фото
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
          JPG, PNG або WEBP, до 5 МБ. Сайт сам обріже фото під картку та сторінку
          лікаря.
        </p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
