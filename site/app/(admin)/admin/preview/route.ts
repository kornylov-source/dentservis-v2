import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";

/** Вмикає draft-режим і веде на публічну сторінку лікаря (показує чернетку). */
export async function GET(request: Request) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");

  const dm = await draftMode();
  dm.enable();

  // Відгуки і trust-bar — на головній; контакти — на сторінці контактів.
  if (type === "review" || type === "trust") redirect("/");
  if (type === "contacts") redirect("/kontakty");

  const base = type === "service" ? "/poslugy" : "/likari";
  redirect(slug ? `${base}/${slug}` : base);
}
