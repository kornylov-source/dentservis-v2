import { getPublishedServices } from "@/lib/services";

// Three featured services on the homepage. The card copy (titles, blurbs)
// is bespoke and shorter than the DB content, so it stays here; only the
// image is pulled from the database by slug, so uploading a new photo for
// a service in the admin updates both its detail page and this block.
const FEATURED = [
  {
    slug: "parodontolohiia",
    title: "Пародонтологія",
    description:
      "Лікування захворювань ясен, кюретаж та пластика — здоров’я ясен як основа здорової посмішки.",
    fallback: "/images/services/parodontolohiia.webp",
  },
  {
    slug: "implantatsiia",
    title: "Дентальна імплантація",
    description:
      "Відновлення зубів за цифровим протоколом — імпланти з гарантією, які служать десятиліттями.",
    fallback: "/images/services/implantatsiia.webp",
  },
  {
    slug: "estetychna",
    title: "Естетична стоматологія",
    description:
      "Вініри, реставрації та Digital Smile Design — створюємо посмішку вашої мрії.",
    fallback: "/images/services/estetychna.webp",
  },
] as const;

export default async function ServicesThree() {
  const services = await getPublishedServices();
  const imageBySlug = new Map(services.map((s) => [s.slug, s.image]));

  return (
    <section className="services-section">
      <div className="w-layout-blockcontainer container w-container">
        <div className="services-section-contents">
          <div className="full-width-section-header-wrapper">
            <div className="full-width-section-header-contents">
              <h2>
                Послуги, які <span className="text-color">ми надаємо</span> у Дніпрі
              </h2>
              <p className="paragraph-no-margin">
                Повний спектр стоматологічних послуг — від профілактики до складної
                імплантації. Усе на сучасному обладнанні з цифровим протоколом.
              </p>
            </div>
            <a href="/poslugy" className="primary-button w-inline-block">
              <div className="primary-button-main-contents">
                <div className="primary-button-text">Усі послуги</div>
              </div>
            </a>
          </div>
          <div className="w-layout-grid services-grid">
            {FEATURED.map((s) => (
              <div key={s.slug} className="services-box">
                <div className="service-name">{s.title}</div>
                <p className="service-description">{s.description}</p>
                <img
                  sizes="100vw"
                  alt={s.title}
                  src={imageBySlug.get(s.slug) || s.fallback}
                  loading="lazy"
                  className="services-image"
                />
                <div className="service-image-overlay"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
