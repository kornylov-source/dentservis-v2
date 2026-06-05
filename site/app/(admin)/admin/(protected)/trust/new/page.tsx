import Link from "next/link";
import TrustForm from "@/components/admin/TrustForm";

export const dynamic = "force-dynamic";

export default function NewTrustPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/admin/trust" className="text-sm text-slate-500 hover:underline">
        ← Усі показники
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold tracking-tight">
        Новий показник
      </h1>
      <TrustForm mode="new" />
    </main>
  );
}
