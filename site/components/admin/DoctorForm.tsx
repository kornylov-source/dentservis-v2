"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import PhotoUpload from "./PhotoUpload";
import {
  saveDoctorDraft,
  createDoctor,
  publishDoctor,
} from "@/app/(admin)/admin/(protected)/doctors/actions";

type Highlight = { title: string; description: string };

export type DoctorFormData = {
  fullName: string;
  shortName: string;
  position: string;
  experience: string;
  specialty: string;
  photo: string;
  cardSpecialty: string;
  cardExperienceList: string;
  cardExperienceCarousel: string;
  bio: string[];
  highlights: Highlight[];
  training: string[];
  expertise: string;
  quote: string;
  hobby: string;
};

export const EMPTY_DOCTOR: DoctorFormData = {
  fullName: "",
  shortName: "",
  position: "",
  experience: "",
  specialty: "",
  photo: "",
  cardSpecialty: "",
  cardExperienceList: "",
  cardExperienceCarousel: "",
  bio: [""],
  highlights: [],
  training: [],
  expertise: "",
  quote: "",
  hobby: "",
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

export default function DoctorForm({
  mode,
  id,
  slug: initialSlug,
  initial,
}: {
  mode: "new" | "edit";
  id?: string;
  slug?: string;
  initial?: DoctorFormData;
}) {
  const router = useRouter();
  const [data, setData] = useState<DoctorFormData>(initial ?? EMPTY_DOCTOR);
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof DoctorFormData>(k: K, v: DoctorFormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function buildPayload() {
    const training = data.training.map((s) => s.trim()).filter(Boolean);
    const highlights = data.highlights.filter(
      (h) => h.title.trim() || h.description.trim(),
    );
    return {
      fullName: data.fullName,
      shortName: data.shortName,
      position: data.position,
      experience: data.experience,
      specialty: data.specialty,
      photoCard: data.photo,
      photoDetail: data.photo,
      cardSpecialty: data.cardSpecialty,
      cardExperienceList: data.cardExperienceList,
      cardExperienceCarousel: data.cardExperienceCarousel,
      bio: data.bio.map((s) => s.trim()).filter(Boolean),
      highlights: highlights.length ? highlights : null,
      training: training.length ? training : null,
      expertise: data.expertise.trim() || null,
      quote: data.quote.trim() || null,
      hobby: data.hobby.trim() || null,
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
      const res = await createDoctor(slug, buildPayload());
      if (!res.ok) {
        setTopError(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
        return;
      }
      router.push("/admin/doctors");
      router.refresh();
    });
  }

  function onSaveDraft() {
    run(async () => {
      const res = await saveDoctorDraft(id!, buildPayload());
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
      const saved = await saveDoctorDraft(id!, buildPayload());
      if (!saved.ok) {
        setTopError(saved.error);
        if (saved.fieldErrors) setErrors(saved.fieldErrors);
        return;
      }
      const pub = await publishDoctor(id!);
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
    const saved = await saveDoctorDraft(id!, buildPayload());
    if (!saved.ok) {
      setTopError(saved.error);
      if (saved.fieldErrors) setErrors(saved.fieldErrors);
      return;
    }
    window.open(`/admin/preview?slug=${slug}`, "_blank", "noopener");
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

      {/* Фото */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Фото лікаря</h2>
        <PhotoUpload value={data.photo} onChange={(url) => set("photo", url)} />
        {errors.photoCard && (
          <p className="mt-2 text-xs text-red-600">{errors.photoCard}</p>
        )}
      </section>

      {/* Основне */}
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <h2 className="col-span-full text-sm font-semibold text-slate-900">
          Основна інформація
        </h2>
        {mode === "new" && (
          <Field
            label="Slug (адреса сторінки)"
            hint="латиницею, напр. zhmakov → /likari/zhmakov"
            error={errors.slug}
          >
            <input
              className={inputCls}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="zhmakov"
            />
          </Field>
        )}
        <Field label="Повне ім'я" error={errors.fullName}>
          <input
            className={inputCls}
            value={data.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Жмаков Олександр Анатолійович"
          />
        </Field>
        <Field label="Скорочене ім'я" hint="для хлібних крихт" error={errors.shortName}>
          <input
            className={inputCls}
            value={data.shortName}
            onChange={(e) => set("shortName", e.target.value)}
            placeholder="Жмаков О. А."
          />
        </Field>
        <Field label="Посада" error={errors.position}>
          <input
            className={inputCls}
            value={data.position}
            onChange={(e) => set("position", e.target.value)}
            placeholder="Медичний директор, хірург-імплантолог"
          />
        </Field>
        <Field label="Досвід" error={errors.experience}>
          <input
            className={inputCls}
            value={data.experience}
            onChange={(e) => set("experience", e.target.value)}
            placeholder="36 років досвіду"
          />
        </Field>
        <Field label="Спеціалізація" error={errors.specialty}>
          <input
            className={inputCls}
            value={data.specialty}
            onChange={(e) => set("specialty", e.target.value)}
            placeholder="Дентальна імплантація, All-on-4"
          />
        </Field>
      </section>

      {/* Текст карток */}
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Текст на картках (список і карусель)
        </h2>
        <Field label="Підпис у картці" error={errors.cardSpecialty}>
          <input
            className={inputCls}
            value={data.cardSpecialty}
            onChange={(e) => set("cardSpecialty", e.target.value)}
            placeholder="Засновник, хірург-імплантолог, ортопед"
          />
        </Field>
        <Field
          label="Рядок досвіду — у списку лікарів"
          error={errors.cardExperienceList}
        >
          <input
            className={inputCls}
            value={data.cardExperienceList}
            onChange={(e) => set("cardExperienceList", e.target.value)}
            placeholder="30+ років практики. Імплантація, складна хірургія."
          />
        </Field>
        <Field
          label="Рядок досвіду — у каруселі на головній"
          hint="коротший варіант"
          error={errors.cardExperienceCarousel}
        >
          <input
            className={inputCls}
            value={data.cardExperienceCarousel}
            onChange={(e) => set("cardExperienceCarousel", e.target.value)}
            placeholder="30+ років практики"
          />
        </Field>
      </section>

      {/* Біографія */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">
          Біографія (абзаци)
        </h2>
        {errors.bio && <p className="mb-2 text-xs text-red-600">{errors.bio}</p>}
        <div className="space-y-2">
          {data.bio.map((para, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                className={inputCls}
                rows={2}
                value={para}
                onChange={(e) => {
                  const next = [...data.bio];
                  next[i] = e.target.value;
                  set("bio", next);
                }}
              />
              <button
                type="button"
                onClick={() =>
                  set(
                    "bio",
                    data.bio.filter((_, idx) => idx !== i),
                  )
                }
                className="shrink-0 rounded-md border border-slate-300 px-2 text-slate-500 hover:bg-slate-50"
                aria-label="Видалити абзац"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => set("bio", [...data.bio, ""])}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          + Додати абзац
        </button>
      </section>

      {/* Переваги (highlights) */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-slate-900">
          Переваги (необов'язково)
        </h2>
        <p className="mb-3 text-xs text-slate-400">
          Блоки «заголовок + опис», що показуються на сторінці лікаря.
        </p>
        <div className="space-y-3">
          {data.highlights.map((h, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Перевага {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "highlights",
                      data.highlights.filter((_, idx) => idx !== i),
                    )
                  }
                  className="text-xs text-red-500 hover:underline"
                >
                  Видалити
                </button>
              </div>
              <input
                className={`${inputCls} mb-2`}
                placeholder="Заголовок"
                value={h.title}
                onChange={(e) => {
                  const next = [...data.highlights];
                  next[i] = { ...next[i], title: e.target.value };
                  set("highlights", next);
                }}
              />
              <textarea
                className={inputCls}
                rows={2}
                placeholder="Опис"
                value={h.description}
                onChange={(e) => {
                  const next = [...data.highlights];
                  next[i] = { ...next[i], description: e.target.value };
                  set("highlights", next);
                }}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            set("highlights", [...data.highlights, { title: "", description: "" }])
          }
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          + Додати перевагу
        </button>
      </section>

      {/* Навчання (training) */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">
          Навчання / курси (необов'язково)
        </h2>
        <div className="space-y-2">
          {data.training.map((t, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputCls}
                value={t}
                onChange={(e) => {
                  const next = [...data.training];
                  next[i] = e.target.value;
                  set("training", next);
                }}
              />
              <button
                type="button"
                onClick={() =>
                  set(
                    "training",
                    data.training.filter((_, idx) => idx !== i),
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
          onClick={() => set("training", [...data.training, ""])}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          + Додати курс
        </button>
      </section>

      {/* Додатково */}
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Додатково (необов'язково)
        </h2>
        <Field label="Експертиза">
          <textarea
            className={inputCls}
            rows={3}
            value={data.expertise}
            onChange={(e) => set("expertise", e.target.value)}
          />
        </Field>
        <Field label="Цитата лікаря">
          <textarea
            className={inputCls}
            rows={2}
            value={data.quote}
            onChange={(e) => set("quote", e.target.value)}
          />
        </Field>
        <Field label="Хобі">
          <input
            className={inputCls}
            value={data.hobby}
            onChange={(e) => set("hobby", e.target.value)}
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
            {pending ? "Створюємо…" : "Створити лікаря (чернетка)"}
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
