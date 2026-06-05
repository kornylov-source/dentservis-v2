import type { TrustStat } from "@/lib/data/trust";

/**
 * Trust-bar (цифри довіри). Відтворює DOM зі сниппета trust-bar.html 1-в-1.
 * Дані — з Supabase.
 */
export default function TrustBar({ stats }: { stats: TrustStat[] }) {
  return (
    <section className="trust-bar-section">
      <div className="w-layout-blockcontainer container w-container">
        <div className="trust-bar-grid">
          {stats.map((s) => (
            <div key={s.slug} className="trust-item">
              <div className="trust-number">{s.number}</div>
              <div className="trust-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
