import type { Service } from "@/lib/services";
import { doctors } from "@/lib/data/doctors";

interface Props {
  service: Service;
}

export default function ServiceDetail({ service }: Props) {
  const serviceDoctors = doctors.filter((d) => service.doctors.includes(d.slug));

  return (
    <>
      {/* Banner */}
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
                <a href="/poslugy" className="caption text-white">
                  Послуги
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
                <a href={`/poslugy/${service.slug}`} aria-current="page" className="caption text-white w--current">
                  {service.name}
                </a>
              </li>
            </ul>
            <h1 className="text-center text-white">{service.hero.headline}</h1>
          </div>
        </div>
      </section>

      {/* Hero with image + intro + benefits */}
      <section className="service-hero-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="service-hero-grid">
            <div className="service-hero-content">
              <h2>
                {service.heroTitle ? (
                  service.heroTitle
                ) : (
                  <>
                    {service.name} <span className="text-color">з гарантією</span>
                  </>
                )}
              </h2>
              <p className="paragraph-no-margin">{service.hero.intro}</p>
              <ul className="service-benefits-list">
                {service.hero.benefits.map((benefit, idx) => (
                  <li key={idx}>
                    <span className="service-benefit-check">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 13L9 17L19 7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <a href="/kontakty" className="primary-button w-inline-block">
                <div className="primary-button-main-contents">
                  <div className="primary-button-icon-wrapper">
                    <div className="icon w-embed">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.45 22.75C16.32 22.75 15.13 22.48 13.9 21.96C12.7 21.45 11.49 20.75 10.31 19.9C9.14 19.04 8.01 18.08 6.94 17.03C5.88 15.96 4.92 14.83 4.07 13.67C3.21 12.47 2.52 11.27 2.03 10.11C1.51 8.87 1.25 7.67 1.25 6.54C1.25 5.76 1.39 5.02 1.66 4.33C1.94 3.62 2.39 2.96 3 2.39C3.77 1.63 4.65 1.25 5.59 1.25C5.98 1.25 6.38 1.34 6.72 1.5C7.11 1.68 7.44 1.95 7.68 2.31L10 5.58C10.21 5.87 10.37 6.15 10.48 6.43C10.61 6.73 10.68 7.03 10.68 7.32C10.68 7.7 10.57 8.07 10.36 8.42C10.21 8.69 9.98 8.98 9.69 9.27L9.01 9.98C9.02 10.01 9.03 10.03 9.04 10.05C9.16 10.26 9.4 10.62 9.86 11.16C10.35 11.72 10.81 12.23 11.27 12.7C11.86 13.28 12.35 13.74 12.81 14.12C13.38 14.6 13.75 14.84 13.97 14.95L13.95 15L14.68 14.28C14.99 13.97 15.29 13.74 15.58 13.59C16.13 13.25 16.83 13.19 17.53 13.48C17.79 13.59 18.07 13.74 18.37 13.95L21.69 16.31C22.06 16.56 22.33 16.88 22.49 17.26C22.64 17.64 22.71 17.99 22.71 18.34C22.71 18.82 22.6 19.3 22.39 19.75C22.18 20.2 21.92 20.59 21.59 20.95C21.02 21.58 20.4 22.03 19.68 22.32C18.99 22.6 18.24 22.75 17.45 22.75ZM5.59 2.75C5.04 2.75 4.53 2.99 4.04 3.47C3.58 3.9 3.26 4.37 3.06 4.88C2.85 5.4 2.75 5.95 2.75 6.54C2.75 7.47 2.97 8.48 3.41 9.52C3.86 10.58 4.49 11.68 5.29 12.78C6.09 13.88 7 14.95 8 15.96C9 16.95 10.08 17.87 11.19 18.68C12.27 19.47 13.38 20.11 14.48 20.57C16.19 21.3 17.79 21.47 19.11 20.92C19.62 20.71 20.07 20.39 20.48 19.93C20.71 19.68 20.89 19.41 21.04 19.09C21.16 18.84 21.22 18.58 21.22 18.32C21.22 18.16 21.19 18 21.11 17.82C21.08 17.76 21.02 17.65 20.83 17.52L17.51 15.16C17.31 15.02 17.13 14.92 16.96 14.85C16.74 14.76 16.65 14.67 16.31 14.88C16.11 14.98 15.93 15.13 15.73 15.33L14.97 16.08C14.58 16.46 13.98 16.55 13.52 16.38L13.25 16.26C12.84 16.04 12.36 15.7 11.83 15.25C11.35 14.84 10.83 14.36 10.2 13.74C9.71 13.24 9.22 12.71 8.71 12.12C8.24 11.57 7.9 11.1 7.69 10.71L7.57 10.41C7.51 10.18 7.49 10.05 7.49 9.91C7.49 9.55 7.62 9.23 7.87 8.98L8.62 8.2C8.82 8 8.97 7.81 9.07 7.64C9.15 7.51 9.18 7.4 9.18 7.3C9.18 7.22 9.15 7.1 9.1 6.98C9.03 6.82 8.92 6.64 8.78 6.45L6.46 3.17C6.36 3.03 6.24 2.93 6.09 2.86C5.93 2.79 5.76 2.75 5.59 2.75ZM13.95 15.01L13.79 15.69L14.06 14.99C14.01 14.98 13.97 14.99 13.95 15.01Z" fill="black" />
                        <path d="M18.5 9.75C18.09 9.75 17.75 9.41 17.75 9C17.75 8.64 17.39 7.89 16.79 7.25C16.2 6.62 15.55 6.25 15 6.25C14.59 6.25 14.25 5.91 14.25 5.5C14.25 5.09 14.59 4.75 15 4.75C15.97 4.75 16.99 5.27 17.88 6.22C18.71 7.11 19.25 8.2 19.25 9C19.25 9.41 18.91 9.75 18.5 9.75Z" fill="black" />
                        <path d="M22 9.75C21.59 9.75 21.25 9.41 21.25 9C21.25 5.55 18.45 2.75 15 2.75C14.59 2.75 14.25 2.41 14.25 2C14.25 1.59 14.59 1.25 15 1.25C19.27 1.25 22.75 4.73 22.75 9C22.75 9.41 22.41 9.75 22 9.75Z" fill="black" />
                      </svg>
                    </div>
                  </div>
                  <div className="primary-button-text">Записатись на консультацію</div>
                </div>
                <div className="primary-button-hover-bg">
                  <div className="primary-button-icon-wrapper">
                    <div className="icon w-embed">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.45 22.75C16.32 22.75 15.13 22.48 13.9 21.96C12.7 21.45 11.49 20.75 10.31 19.9C9.14 19.04 8.01 18.08 6.94 17.03C5.88 15.96 4.92 14.83 4.07 13.67C3.21 12.47 2.52 11.27 2.03 10.11C1.51 8.87 1.25 7.67 1.25 6.54C1.25 5.76 1.39 5.02 1.66 4.33C1.94 3.62 2.39 2.96 3 2.39C3.77 1.63 4.65 1.25 5.59 1.25C5.98 1.25 6.38 1.34 6.72 1.5C7.11 1.68 7.44 1.95 7.68 2.31L10 5.58C10.21 5.87 10.37 6.15 10.48 6.43C10.61 6.73 10.68 7.03 10.68 7.32C10.68 7.7 10.57 8.07 10.36 8.42C10.21 8.69 9.98 8.98 9.69 9.27L9.01 9.98C9.02 10.01 9.03 10.03 9.04 10.05C9.16 10.26 9.4 10.62 9.86 11.16C10.35 11.72 10.81 12.23 11.27 12.7C11.86 13.28 12.35 13.74 12.81 14.12C13.38 14.6 13.75 14.84 13.97 14.95L13.95 15L14.68 14.28C14.99 13.97 15.29 13.74 15.58 13.59C16.13 13.25 16.83 13.19 17.53 13.48C17.79 13.59 18.07 13.74 18.37 13.95L21.69 16.31C22.06 16.56 22.33 16.88 22.49 17.26C22.64 17.64 22.71 17.99 22.71 18.34C22.71 18.82 22.6 19.3 22.39 19.75C22.18 20.2 21.92 20.59 21.59 20.95C21.02 21.58 20.4 22.03 19.68 22.32C18.99 22.6 18.24 22.75 17.45 22.75ZM5.59 2.75C5.04 2.75 4.53 2.99 4.04 3.47C3.58 3.9 3.26 4.37 3.06 4.88C2.85 5.4 2.75 5.95 2.75 6.54C2.75 7.47 2.97 8.48 3.41 9.52C3.86 10.58 4.49 11.68 5.29 12.78C6.09 13.88 7 14.95 8 15.96C9 16.95 10.08 17.87 11.19 18.68C12.27 19.47 13.38 20.11 14.48 20.57C16.19 21.3 17.79 21.47 19.11 20.92C19.62 20.71 20.07 20.39 20.48 19.93C20.71 19.68 20.89 19.41 21.04 19.09C21.16 18.84 21.22 18.58 21.22 18.32C21.22 18.16 21.19 18 21.11 17.82C21.08 17.76 21.02 17.65 20.83 17.52L17.51 15.16C17.31 15.02 17.13 14.92 16.96 14.85C16.74 14.76 16.65 14.67 16.31 14.88C16.11 14.98 15.93 15.13 15.73 15.33L14.97 16.08C14.58 16.46 13.98 16.55 13.52 16.38L13.25 16.26C12.84 16.04 12.36 15.7 11.83 15.25C11.35 14.84 10.83 14.36 10.2 13.74C9.71 13.24 9.22 12.71 8.71 12.12C8.24 11.57 7.9 11.1 7.69 10.71L7.57 10.41C7.51 10.18 7.49 10.05 7.49 9.91C7.49 9.55 7.62 9.23 7.87 8.98L8.62 8.2C8.82 8 8.97 7.81 9.07 7.64C9.15 7.51 9.18 7.4 9.18 7.3C9.18 7.22 9.15 7.1 9.1 6.98C9.03 6.82 8.92 6.64 8.78 6.45L6.46 3.17C6.36 3.03 6.24 2.93 6.09 2.86C5.93 2.79 5.76 2.75 5.59 2.75ZM13.95 15.01L13.79 15.69L14.06 14.99C14.01 14.98 13.97 14.99 13.95 15.01Z" fill="black" />
                        <path d="M18.5 9.75C18.09 9.75 17.75 9.41 17.75 9C17.75 8.64 17.39 7.89 16.79 7.25C16.2 6.62 15.55 6.25 15 6.25C14.59 6.25 14.25 5.91 14.25 5.5C14.25 5.09 14.59 4.75 15 4.75C15.97 4.75 16.99 5.27 17.88 6.22C18.71 7.11 19.25 8.2 19.25 9C19.25 9.41 18.91 9.75 18.5 9.75Z" fill="black" />
                        <path d="M22 9.75C21.59 9.75 21.25 9.41 21.25 9C21.25 5.55 18.45 2.75 15 2.75C14.59 2.75 14.25 2.41 14.25 2C14.25 1.59 14.59 1.25 15 1.25C19.27 1.25 22.75 4.73 22.75 9C22.75 9.41 22.41 9.75 22 9.75Z" fill="black" />
                      </svg>
                    </div>
                  </div>
                  <div className="primary-button-text-hover">Записатись на консультацію</div>
                </div>
              </a>
            </div>
            <div className="service-hero-image-wrap">
              <img src={service.image} alt={service.name} className="service-hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Problems we solve */}
      <section className="service-problems-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="full-width-section-header-wrapper">
            <div className="full-width-section-header-contents">
              <h2>
                Які <span className="text-color">проблеми</span> вирішуємо
              </h2>
              <p className="paragraph-no-margin">
                Найчастіші ситуації, з якими пацієнти приходять у напрям «{service.name.toLowerCase()}». Якщо вашого
                випадку немає у списку — телефонуйте, обговоримо.
              </p>
            </div>
          </div>
          <div className="service-problems-grid">
            {service.problems.map((problem, idx) => (
              <div key={idx} className="service-problem-card">
                <div className="faq-group-badge">{String(idx + 1).padStart(2, "0")}</div>
                <h3 className="heading-5">{problem.title}</h3>
                <p className="paragraph-no-margin">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment stages */}
      <section className="service-stages-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="full-width-section-header-wrapper">
            <div className="full-width-section-header-contents">
              <h2>
                Як <span className="text-color">проходить</span> лікування
              </h2>
              <p className="paragraph-no-margin">
                Покрокова послідовність — щоб ви знали, чого очікувати на кожному етапі. Без сюрпризів.
              </p>
            </div>
          </div>
          <div className="service-stages-list">
            {service.stages.map((stage) => (
              <div key={stage.number} className="service-stage-row">
                <div className="faq-group-badge">{stage.number}</div>
                <div className="service-stage-content">
                  <h3 className="heading-5">{stage.title}</h3>
                  <p className="paragraph-no-margin">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="service-standards-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="full-width-section-header-wrapper">
            <div className="full-width-section-header-contents">
              <h2>
                Наші <span className="text-color">стандарти</span> для цієї послуги
              </h2>
            </div>
          </div>
          <div className="service-standards-grid">
            {service.standards.map((standard, idx) => (
              <div key={idx} className="service-standard-item">
                <div className="service-standard-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13L9 17L19 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="paragraph-no-margin">{standard}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors */}
      {serviceDoctors.length > 0 && (
        <section className="service-doctors-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="full-width-section-header-wrapper">
              <div className="full-width-section-header-contents">
                <h2>
                  Хто <span className="text-color">проводить</span> лікування
                </h2>
                <p className="paragraph-no-margin">
                  Лікарі нашої клініки, які приймають пацієнтів за цим напрямом.
                </p>
              </div>
            </div>
            <div className="service-doctors-grid">
              {serviceDoctors.map((doctor) => (
                <a key={doctor.slug} href={`/likari/${doctor.slug}`} className="service-doctor-card">
                  <div className="service-doctor-image-wrap">
                    <img src={doctor.photo} alt={doctor.fullName} className="service-doctor-image" />
                  </div>
                  <div className="service-doctor-body">
                    <h3 className="heading-5">{doctor.shortName}</h3>
                    <p className="caption">{doctor.position}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ — Webflow accordion style (matches /faq page) */}
      <section className="faq-page-section service-faq-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="full-width-section-header-wrapper">
            <div className="full-width-section-header-contents">
              <h2>
                Часті <span className="text-color">питання</span>
              </h2>
              <p className="paragraph-no-margin">Те, що запитують найчастіше про напрям «{service.name.toLowerCase()}».</p>
            </div>
          </div>
          <div className="faq-group">
            <div className="accordions">
              {service.faq.map((item, idx) => (
                <div key={idx} data-delay="0" data-hover="false" className="accordion w-dropdown">
                  <div className="faq-dropdown w-dropdown-toggle">
                    <div className="heading-5">{item.question}</div>
                    <div style={{ display: "none" }} className="icon close w-embed">
                      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M18 13.25H6C5.59 13.25 5.25 12.91 5.25 12.5C5.25 12.09 5.59 11.75 6 11.75H18C18.41 11.75 18.75 12.09 18.75 12.5C18.75 12.91 18.41 13.25 18 13.25Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div style={{ display: "flex" }} className="icon open w-embed">
                      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M18 13.25H6C5.59 13.25 5.25 12.91 5.25 12.5C5.25 12.09 5.59 11.75 6 11.75H18C18.41 11.75 18.75 12.09 18.75 12.5C18.75 12.91 18.41 13.25 18 13.25Z"
                          fill="black"
                        />
                        <path
                          d="M12 19.25C11.59 19.25 11.25 18.91 11.25 18.5V6.5C11.25 6.09 11.59 5.75 12 5.75C12.41 5.75 12.75 6.09 12.75 6.5V18.5C12.75 18.91 12.41 19.25 12 19.25Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                  </div>
                  <nav style={{ width: "100%", height: "0rem" }} className="accordion-answer-wrapper w-dropdown-list">
                    <p className="accordion-answer">{item.answer}</p>
                  </nav>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
