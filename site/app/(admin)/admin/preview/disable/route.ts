import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";

/** Вимикає draft-режим і повертає в адмінку. Тільки для авторизованих (симетрично з enable). */
export async function GET() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const dm = await draftMode();
  dm.disable();
  redirect("/admin");
}
