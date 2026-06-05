"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveServiceDraft,
  createService,
  publishService,
  uploadServiceImage,
} from "@/app/(admin)/admin/(protected)/services/actions";
import { ICON_TYPES, ICON_LABELS } from "@/lib/admin/service-schema";

type Pair = { title: string; description: string };
type Stage = { number: string; title: string; description: string };
type Faq = { question: string; answer: string };

export type ServiceFormData = {
  name: string;
  short: string;
  image: string;
  iconType: (typeof ICON_TYPES)[number];
  hidden: boolean;
  heroTitle: string;
  heroAccent: string;
  heroHeadline: string;
  heroIntro: string;
  benefits: string[];
  problems: Pair[];
  stages: Stage[];
  standards: string[];
  doctors: string[];
  doctorRoles: Record<string, string>;
  faq: Faq[];
};

export const EMPTY_SERVICE: ServiceFormData = {
  name: "",
  short: "",
  image: "",
  iconType: "implant",
  hidden: false,
  heroTitle: "",
  heroAccent: "",
  heroHeadline: "",
  heroIntro: "",
  benefits: [""],
  problems: [],
  stages: [],
  standards: [],
  doctors: [],
  doctorRoles: {},
  faq: [],
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

export default function ServiceForm({
  mode,
  id,
  slug: initialSlug,
  initial,
  availableDoctors,
}: {
  mode: "new" | "edit";
  id?: string;
  slug?: string;
  initial?: ServiceFormData;
  availableDoctors: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [data, setData] = useState<ServiceFormData>(initial ?? EMPTY_SERVICE);
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof ServiceFormData>(k: K, v: ServiceFormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadServiceImage(fd);
    setUploading(false);
    e.target.value = "";
    if (!res.ok) setTopError(res.error);
    else set("image", res.url);
  }

  function toggleDoctor(s: string) {
    set(
      "doctors",
      data.doctors.includes(s)
        ? data.doctors.filter((x) => x !== s)
        : [...data.doctors, s],
    );
  }

  function buildPayload() {
    const roles: Record<string, string> = {};
    for (const s of data.doctors) {
      const r = (data.doctorRoles[s] ?? "").trim();
      if (r) roles[s] = r;
    }
    return {
      name: data.name,
      short: data.short,
      image: data.image,
      iconType: data.iconType,
      heroTitle: data.heroTitle.trim() || null,
      heroAccent: data.heroAccent.trim() || null,
      hero: {
        headline: data.heroHeadline,
        intro: data.heroIntro,
        benefits: data.benefits.map((s) => s.trim()).filter(Boolean),
      },
      problems: data.problems.filter(
        (p) => p.title.trim() || p.description.trim(),
      ),
      stages: data.stages
        .filter((s) => s.title.trim() || s.description.trim())
        .map((s, i) => ({
          number: s.number.trim() || String(i + 1).padStart(2, "0"),
          title: s.title,
          description: s.description,
        })),
      standards: data.standards.map((s) => s.trim()).filter(Boolean),
      doctors: data.doctors,
      doctorRoles: Object.keys(roles).length ? roles : null,
      faq: data.faq.filter((f) => f.question.trim() || f.answer.trim()),
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
      const res = await createService(slug, buildPayload(), data.hidden);
      if (!res.ok) {
        setTopError(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
        return;
      }
      router.push("/admin/services");
      router.refresh();
    });
  }

  function onSaveDraft() {
    run(async () => {
      const res = await saveServiceDraft(id!, buildPayload(), data.hidden);
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
      const saved = await saveServiceDraft(id!, buildPayload(), data.hidden);
      if (!saved.ok) {
        setTopError(saved.error);
        if (saved.fieldErrors) setErrors(saved.fieldErrors);
        return;
      }
      const pub = await publishService(id!);
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
    const saved = await saveServiceDraft(id!, buildPayload(), data.hidden);
    if (!saved.ok) {
      setTopError(saved.error);
      if (saved.fieldErrors) setErrors(saved.fieldErrors);
      return;
    }
    window.open(`/admin/preview?type=service&slug=${slug}`, "_blank", "noopener");
  }

  // невеликий редактор масиву рядків
  function StringList({
    field,
    addLabel,
  }: {
    field: "benefits" | "standards";
    addLabel: string;
  }) {
    return (
      <div>
        <div className="space-y-2">
          {data[field].map((v, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputCls}
                value={v}
                onChange={(e) => {
                  const next = [...data[field]];
                  next[i] = e.target.value;
                  set(field, next);
                }}
              />
              <button
                type="button"
                onClick={() =>
                  set(
                    field,
                    data[field].filter((_, idx) => idx !== i),
                  )
                }
                className="shrink-0 rounded-md border border-slate-300 px-2 text-slate-500 hover:bg-slate-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => set(field, [...data[field], ""])}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          {addLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {topError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{topError}</div>
      )}
      {okMsg && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{okMsg}</div>
      )}

      <Section title="Основне">
        <div className="grid gap-4 sm:grid-cols-2">
          {mode === "new" && (
            <Field
              label="Slug (адреса)"
              hint="латиницею, напр. implantatsiia → /poslugy/implantatsiia"
              error={errors.slug}
            >
              <input
                className={inputCls}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </Field>
          )}
          <Field label="Назва послуги" error={errors.name}>
            <input
              className={inputCls}
              value={data.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Іконка" hint="тип іконки в каталозі">
            <select
              className={inputCls}
              value={data.iconType}
              onChange={(e) =>
                set("iconType", e.target.value as ServiceFormData["iconType"])
              }
            >
              {ICON_TYPES.map((t) => (
                <option key={t} value={t}>
                  {ICON_LABELS[t]}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Короткий опис"
            hint="у картці каталогу"
            error={errors.short}
          >
            <textarea
              className={inputCls}
              rows={2}
              value={data.short}
              onChange={(e) => set("short", e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.hidden}
              onChange={(e) => set("hidden", e.target.checked)}
              className="h-4 w-4"
            />
            Прихована (не показувати на сайті)
          </label>
        </div>
        <div className="mt-4">
          <span className="text-sm font-medium text-slate-700">
            Зображення послуги
          </span>
          {errors.image && (
            <p className="text-xs text-red-600">{errors.image}</p>
          )}
          <div className="mt-2 flex items-center gap-4">
            {data.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.image}
                alt=""
                className="h-20 w-28 rounded-lg border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-20 w-28 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                Немає
              </div>
            )}
            <label className="inline-block cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
              {uploading ? "Завантаження…" : "Завантажити"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onImage}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </Section>

      <Section title="Hero (верх сторінки послуги)">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Заголовок hero (heroTitle)" hint="необов'язково">
              <input
                className={inputCls}
                value={data.heroTitle}
                onChange={(e) => set("heroTitle", e.target.value)}
              />
            </Field>
            <Field label="Акцент hero (heroAccent)" hint="необов'язково">
              <input
                className={inputCls}
                value={data.heroAccent}
                onChange={(e) => set("heroAccent", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Headline" error={errors["hero.headline"]}>
            <input
              className={inputCls}
              value={data.heroHeadline}
              onChange={(e) => set("heroHeadline", e.target.value)}
            />
          </Field>
          <Field label="Вступний текст" error={errors["hero.intro"]}>
            <textarea
              className={inputCls}
              rows={4}
              value={data.heroIntro}
              onChange={(e) => set("heroIntro", e.target.value)}
            />
          </Field>
          <div>
            <span className="text-sm font-medium text-slate-700">
              Переваги (галочки під hero)
            </span>
            <div className="mt-1">
              <StringList field="benefits" addLabel="+ Додати перевагу" />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Проблеми, які вирішуємо">
        <div className="space-y-3">
          {data.problems.map((p, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Проблема {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "problems",
                      data.problems.filter((_, idx) => idx !== i),
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
                value={p.title}
                onChange={(e) => {
                  const next = [...data.problems];
                  next[i] = { ...next[i], title: e.target.value };
                  set("problems", next);
                }}
              />
              <textarea
                className={inputCls}
                rows={2}
                placeholder="Опис"
                value={p.description}
                onChange={(e) => {
                  const next = [...data.problems];
                  next[i] = { ...next[i], description: e.target.value };
                  set("problems", next);
                }}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            set("problems", [...data.problems, { title: "", description: "" }])
          }
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          + Додати проблему
        </button>
      </Section>

      <Section title="Етапи лікування">
        <div className="space-y-3">
          {data.stages.map((s, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Етап {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "stages",
                      data.stages.filter((_, idx) => idx !== i),
                    )
                  }
                  className="text-xs text-red-500 hover:underline"
                >
                  Видалити
                </button>
              </div>
              <input
                className={`${inputCls} mb-2`}
                placeholder="Назва етапу"
                value={s.title}
                onChange={(e) => {
                  const next = [...data.stages];
                  next[i] = { ...next[i], title: e.target.value };
                  set("stages", next);
                }}
              />
              <textarea
                className={inputCls}
                rows={2}
                placeholder="Опис етапу"
                value={s.description}
                onChange={(e) => {
                  const next = [...data.stages];
                  next[i] = { ...next[i], description: e.target.value };
                  set("stages", next);
                }}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            set("stages", [
              ...data.stages,
              { number: "", title: "", description: "" },
            ])
          }
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          + Додати етап
        </button>
      </Section>

      <Section title="Стандарти">
        <StringList field="standards" addLabel="+ Додати стандарт" />
      </Section>

      <Section title="Лікарі цієї послуги">
        <div className="space-y-2">
          {availableDoctors.map((d) => {
            const checked = data.doctors.includes(d.slug);
            return (
              <div key={d.slug} className="flex items-center gap-3">
                <label className="flex w-56 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDoctor(d.slug)}
                    className="h-4 w-4"
                  />
                  {d.name}
                </label>
                {checked && (
                  <input
                    className={`${inputCls} flex-1`}
                    placeholder="Роль у цій послузі (необов'язково)"
                    value={data.doctorRoles[d.slug] ?? ""}
                    onChange={(e) =>
                      set("doctorRoles", {
                        ...data.doctorRoles,
                        [d.slug]: e.target.value,
                      })
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Часті питання (FAQ)">
        <div className="space-y-3">
          {data.faq.map((f, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex justify-between">
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
          onClick={() =>
            set("faq", [...data.faq, { question: "", answer: "" }])
          }
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
              {pending ? "Створюємо…" : "Створити послугу (чернетка)"}
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
