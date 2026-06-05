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
  const base = type === "service" ? "/poslugy" : "/likari";

  const dm = await draftMode();
  dm.enable();

  redirect(slug ? `${base}/${slug}` : base);
}
