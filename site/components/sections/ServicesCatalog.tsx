import { getServices } from "@/lib/services";

export default async function ServicesCatalog() {
  const visibleServices = await getServices();
  return (
    <section className="services-catalog-section">
      <div className="w-layout-blockcontainer container w-container">
        <div className="full-width-section-header-wrapper" style={{ marginBottom: "3rem" }}>
          <div className="full-width-section-header-contents">
            <h2>
              {visibleServices.length} напрямків — <span className="text-color">повний спектр</span> стоматології
            </h2>
            <p className="paragraph-no-margin">
              Від профілактичної гігієни до складної імплантації All-on-4. Один медичний центр,
              цифровий протокол, прозорий план лікування. Оберіть напрям, який вас цікавить — і
              запишіться на консультацію.
            </p>
          </div>
        </div>

        <div className="services-catalog-grid">
          {visibleServices.map((service) => (
            <a
              key={service.slug}
              href={`/poslugy/${service.slug}`}
              className="service-catalog-card"
            >
              <div className="service-catalog-image-wrap">
                <img
                  src={service.image}
                  alt={service.name}
                  loading="lazy"
                  className="service-catalog-image"
                />
                <div className="service-catalog-image-overlay" />
              </div>
              <div className="service-catalog-body">
                <h3 className="service-catalog-title">{service.name}</h3>
                <p className="service-catalog-description">{service.short}</p>
                <div className="service-catalog-cta">
                  <span>Детальніше</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.4297 6.42993L20.4997 12.4999L14.4297 18.5699"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 12.5H20.33"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
