import Link from "next/link";
import FaqGroupForm from "@/components/admin/FaqGroupForm";

export const dynamic = "force-dynamic";

export default function NewFaqGroupPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/admin/faq" className="text-sm text-slate-500 hover:underline">
        ← Усі групи
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold tracking-tight">Нова група</h1>
      <FaqGroupForm mode="new" />
    </main>
  );
}
