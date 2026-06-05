import Link from "next/link";
import { notFound } from "next/navigation";
import TrustForm, {
  EMPTY_TRUST,
  type TrustFormData,
} from "@/components/admin/TrustForm";
import { getTrustAdmin } from "@/lib/admin/trust-admin";

export const dynamic = "force-dynamic";

export default async function EditTrustPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getTrustAdmin(id);
  if (!row) notFound();

  const p = row.draft ?? row.published;
  const initial: TrustFormData = p
    ? { number: p.number, label: p.label }
    : EMPTY_TRUST;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/admin/trust" className="text-sm text-slate-500 hover:underline">
        ← Усі показники
      </Link>
      <h1 className="mb-1 mt-2 text-2xl font-semibold tracking-tight">
        {p?.number ?? "Показник"}
      </h1>
      <p className="mb-6 text-sm text-slate-500">{row.slug}</p>
      <TrustForm mode="edit" id={row.id} slug={row.slug} initial={initial} />
    </main>
  );
}
