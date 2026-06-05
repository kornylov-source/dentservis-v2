import type { Doctor } from "@/lib/data/doctors";

/**
 * Список лікарів на /likari. Відтворює DOM зі сниппета doctors-list.html 1-в-1
 * (класи Webflow, breadcrumbs, grid), щоб стилі й анімації лишилися ідентичні.
 * Дані тягнуться з Supabase замість захардкодженого HTML.
 */
export default function DoctorsList({ doctors }: { doctors: Doctor[] }) {
  return (
    <>
      <section className="page-banner-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="page-banner-contents">
            <ul role="list" className="breadcrumbs-list">
              <li className="breadcrumbs-item">
                <a href="/" className="caption text-white">
                  Головна
                </a>
              </li>
              <li>
                <div className="icon w-embed">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6.68172 15.5025C6.53922 15.5025 6.39672 15.45 6.28422 15.3375C6.06672 15.12 6.06672 14.76 6.28422 14.5425L11.1742 9.65251C11.5342 9.29251 11.5342 8.70751 11.1742 8.34751L6.28422 3.45751C6.06672 3.24001 6.06672 2.88001 6.28422 2.66251C6.50172 2.44501 6.86172 2.44501 7.07922 2.66251L11.9692 7.55251C12.3517 7.93501 12.5692 8.45252 12.5692 9.00002C12.5692 9.54751 12.3592 10.065 11.9692 10.4475L7.07922 15.3375C6.96672 15.4425 6.82422 15.5025 6.68172 15.5025Z"
                      fill="#f6f6f6"
                    />
                  </svg>
                </div>
              </li>
              <li className="breadcrumbs-item">
                <a href="/likari" aria-current="page" className="caption text-white w--current">
                  Наші лікарі
                </a>
              </li>
            </ul>
            <h1 className="text-center text-white">Наші лікарі</h1>
            <p
              className="paragraph-no-margin text-center text-white"
              style={{ maxWidth: "720px", marginTop: "1rem", opacity: 0.9 }}
            >
              {doctors.length} досвідчених лікарів — кожен з власною спеціалізацією. Натисніть на картку, щоб дізнатися більше.
            </p>
          </div>
        </div>
      </section>
      <section className="team-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="team-section-contents">
            <div className="doctors-page-grid">
              {doctors.map((d) => (
                <a key={d.slug} href={`/likari/${d.slug}`} className="doctor-card">
                  <div className="doctor-card-image-wrapper">
                    <img src={d.photoCard} alt={d.fullName} className="doctor-card-image" />
                  </div>
                  <div className="doctor-card-content">
                    <div className="heading-5">{d.fullName}</div>
                    <p className="paragraph-no-margin doctor-card-specialty">{d.cardSpecialty}</p>
                    <p className="doctor-card-experience">{d.cardExperienceList}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
