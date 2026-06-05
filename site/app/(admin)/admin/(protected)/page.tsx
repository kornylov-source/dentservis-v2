import Link from "next/link";

const SECTIONS = [
  { href: "/admin/doctors", title: "Лікарі", desc: "Фото, біографії, спеціалізація команди" },
  { href: "/admin/services", title: "Послуги", desc: "Опис послуг, етапи, FAQ, ціни" },
  { href: "/admin/reviews", title: "Відгуки", desc: "Відгуки пацієнтів на головній" },
  { href: "/admin/trust", title: "Цифри (trust-bar)", desc: "Показники довіри: пацієнти, досвід, ліцензія" },
  { href: "/admin/contacts", title: "Контакти", desc: "Телефони, адреса, графік — для сайту й AI-чату" },
  { href: "/admin/blog", title: "Блог", desc: "Статті: заголовок, фото, SEO, категорія, FAQ" },
];

export default function AdminHome() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Керування контентом</h1>
      <p className="mt-1 text-slate-500">Оберіть розділ для редагування</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow"
          >
            <div className="text-lg font-semibold text-slate-900">{s.title}</div>
            <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
