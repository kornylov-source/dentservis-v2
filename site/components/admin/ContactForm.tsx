"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveClinicDraft,
  publishClinic,
} from "@/app/(admin)/admin/(protected)/contacts/actions";

export type ContactFormData = {
  name: string;
  legalName: string;
  city: string;
  address: string;
  phone: string;
  phoneIntl: string;
  phone2: string;
  phone2Intl: string;
  scheduleWeekdays: string;
  scheduleSaturday: string;
  scheduleSunday: string;
  scheduleShort: string;
  parking: string;
  website: string;
  contactsUrl: string;
  mapsUrl: string;
  telegram: string;
  viberPhone: string;
};

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

export default function ContactForm({ initial }: { initial: ContactFormData }) {
  const router = useRouter();
  const [data, setData] = useState<ContactFormData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof ContactFormData>(k: K, v: ContactFormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function buildPayload() {
    return {
      name: data.name,
      legalName: data.legalName,
      city: data.city,
      address: data.address,
      phone: data.phone,
      phoneIntl: data.phoneIntl,
      phone2: data.phone2,
      phone2Intl: data.phone2Intl,
      schedule: {
        weekdays: data.scheduleWeekdays,
        saturday: data.scheduleSaturday,
        sunday: data.scheduleSunday,
      },
      scheduleShort: data.scheduleShort,
      parking: data.parking,
      website: data.website,
      contactsUrl: data.contactsUrl,
      mapsUrl: data.mapsUrl,
      telegram: data.telegram,
      viberPhone: data.viberPhone,
    };
  }

  function run(fn: () => Promise<void>) {
    setErrors({});
    setTopError(null);
    setOkMsg(null);
    startTransition(fn);
  }

  function applyErr(res: {
    ok: false;
    error: string;
    fieldErrors?: Record<string, string>;
  }) {
    setTopError(res.error);
    if (res.fieldErrors) {
      // schedule.weekdays → scheduleWeekdays-сумісність: показуємо як є під полем.
      setErrors(res.fieldErrors);
    }
  }

  function onSaveDraft() {
    run(async () => {
      const res = await saveClinicDraft(buildPayload());
      if (!res.ok) return applyErr(res);
      setOkMsg("Чернетку збережено.");
      router.refresh();
    });
  }

  function onPublish() {
    run(async () => {
      const saved = await saveClinicDraft(buildPayload());
      if (!saved.ok) return applyErr(saved);
      const pub = await publishClinic();
      if (!pub.ok) return applyErr(pub);
      setOkMsg("Опубліковано! Контакти оновлено на сайті та в AI-чаті.");
      router.refresh();
    });
  }

  async function onPreview() {
    const saved = await saveClinicDraft(buildPayload());
    if (!saved.ok) return applyErr(saved);
    window.open("/admin/preview?type=contacts", "_blank", "noopener");
  }

  return (
    <div className="space-y-6">
      {topError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{topError}</div>
      )}
      {okMsg && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{okMsg}</div>
      )}

      <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
        Ці контакти показуються на сайті <b>і</b> їх диктує AI-чат пацієнтам. Змінюйте
        уважно — після публікації стара інформація зникне всюди.
      </div>

      {/* Телефони */}
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <h2 className="col-span-full text-sm font-semibold text-slate-900">Телефони</h2>
        <Field
          label="Основний телефон (як показувати)"
          hint="напр. (050) 593-55-49"
          error={errors.phone}
        >
          <input className={inputCls} value={data.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field
          label="Основний телефон (для дзвінка)"
          hint="міжнародний формат: +380505935549"
          error={errors.phoneIntl}
        >
          <input className={inputCls} value={data.phoneIntl} onChange={(e) => set("phoneIntl", e.target.value)} />
        </Field>
        <Field label="Другий телефон (як показувати)" hint="напр. (068) 356-65-20" error={errors.phone2}>
          <input className={inputCls} value={data.phone2} onChange={(e) => set("phone2", e.target.value)} />
        </Field>
        <Field
          label="Другий телефон (для дзвінка)"
          hint="напр. +380683566520"
          error={errors.phone2Intl}
        >
          <input className={inputCls} value={data.phone2Intl} onChange={(e) => set("phone2Intl", e.target.value)} />
        </Field>
      </section>

      {/* Адреса */}
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Адреса і карта</h2>
        <Field label="Місто" error={errors.city}>
          <input className={inputCls} value={data.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label="Повна адреса" error={errors.address}>
          <input className={inputCls} value={data.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field
          label="Посилання на Google Maps"
          hint="кнопка «Адреса» на сторінці контактів веде сюди"
          error={errors.mapsUrl}
        >
          <input className={inputCls} value={data.mapsUrl} onChange={(e) => set("mapsUrl", e.target.value)} />
        </Field>
        <Field label="Парковка" hint="текст для AI-чату" error={errors.parking}>
          <input className={inputCls} value={data.parking} onChange={(e) => set("parking", e.target.value)} />
        </Field>
      </section>

      {/* Месенджери */}
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <h2 className="col-span-full text-sm font-semibold text-slate-900">Месенджери</h2>
        <Field
          label="Telegram"
          hint="посилання, напр. https://t.me/dentservicedp"
          error={errors.telegram}
        >
          <input className={inputCls} value={data.telegram} onChange={(e) => set("telegram", e.target.value)} />
        </Field>
        <Field
          label="Viber"
          hint="номер у форматі +380…; якщо порожньо — береться основний телефон"
          error={errors.viberPhone}
        >
          <input className={inputCls} value={data.viberPhone} onChange={(e) => set("viberPhone", e.target.value)} />
        </Field>
      </section>

      {/* Графік */}
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Графік роботи</h2>
        <Field label="Понеділок – П'ятниця" hint="напр. ПН-ПТ: 9:00–19:00" error={errors["schedule.weekdays"]}>
          <input className={inputCls} value={data.scheduleWeekdays} onChange={(e) => set("scheduleWeekdays", e.target.value)} />
        </Field>
        <Field label="Субота" hint="напр. СБ: 9:00–14:00" error={errors["schedule.saturday"]}>
          <input className={inputCls} value={data.scheduleSaturday} onChange={(e) => set("scheduleSaturday", e.target.value)} />
        </Field>
        <Field label="Неділя" hint="напр. НД: вихідний" error={errors["schedule.sunday"]}>
          <input className={inputCls} value={data.scheduleSunday} onChange={(e) => set("scheduleSunday", e.target.value)} />
        </Field>
        <Field
          label="Короткий графік (одним рядком)"
          hint="для AI-чату, напр. ПН-ПТ 9:00–19:00, СБ 9:00–14:00, НД — вихідний"
          error={errors.scheduleShort}
        >
          <input className={inputCls} value={data.scheduleShort} onChange={(e) => set("scheduleShort", e.target.value)} />
        </Field>
      </section>

      {/* Назви/сайт */}
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <h2 className="col-span-full text-sm font-semibold text-slate-900">
          Назва та посилання
        </h2>
        <Field label="Назва клініки" error={errors.name}>
          <input className={inputCls} value={data.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Юридична назва" hint="для політики конфіденційності" error={errors.legalName}>
          <input className={inputCls} value={data.legalName} onChange={(e) => set("legalName", e.target.value)} />
        </Field>
        <Field label="Сайт" error={errors.website}>
          <input className={inputCls} value={data.website} onChange={(e) => set("website", e.target.value)} />
        </Field>
        <Field label="URL сторінки контактів" hint="зазвичай /kontakty" error={errors.contactsUrl}>
          <input className={inputCls} value={data.contactsUrl} onChange={(e) => set("contactsUrl", e.target.value)} />
        </Field>
      </section>

      {/* Кнопки */}
      <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-slate-200 bg-slate-50 py-4">
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
      </div>
    </div>
  );
}
