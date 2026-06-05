import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/** Вимикає draft-режим і повертає в адмінку. */
export async function GET() {
  const dm = await draftMode();
  dm.disable();
  redirect("/admin/doctors");
}
