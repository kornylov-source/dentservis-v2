import type { Doctor } from "@/lib/data/doctors";

interface Props {
  doctor: Doctor;
}

export default function DoctorDetail({ doctor }: Props) {
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
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.68172 15.5025C6.53922 15.5025 6.39672 15.45 6.28422 15.3375C6.06672 15.12 6.06672 14.76 6.28422 14.5425L11.1742 9.65251C11.5342 9.29251 11.5342 8.70751 11.1742 8.34751L6.28422 3.45751C6.06672 3.24001 6.06672 2.88001 6.28422 2.66251C6.50172 2.44501 6.86172 2.44501 7.07922 2.66251L11.9692 7.55251C12.3517 7.93501 12.5692 8.45252 12.5692 9.00002C12.5692 9.54751 12.3592 10.065 11.9692 10.4475L7.07922 15.3375C6.96672 15.4425 6.82422 15.5025 6.68172 15.5025Z"
                      fill="#f6f6f6"
                    />
                  </svg>
                </div>
              </li>
              <li className="breadcrumbs-item">
                <a href="/likari" className="caption text-white">
                  Наші лікарі
                </a>
              </li>
              <li>
                <div className="icon w-embed">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.68172 15.5025C6.53922 15.5025 6.39672 15.45 6.28422 15.3375C6.06672 15.12 6.06672 14.76 6.28422 14.5425L11.1742 9.65251C11.5342 9.29251 11.5342 8.70751 11.1742 8.34751L6.28422 3.45751C6.06672 3.24001 6.06672 2.88001 6.28422 2.66251C6.50172 2.44501 6.86172 2.44501 7.07922 2.66251L11.9692 7.55251C12.3517 7.93501 12.5692 8.45252 12.5692 9.00002C12.5692 9.54751 12.3592 10.065 11.9692 10.4475L7.07922 15.3375C6.96672 15.4425 6.82422 15.5025 6.68172 15.5025Z"
                      fill="#f6f6f6"
                    />
                  </svg>
                </div>
              </li>
              <li className="breadcrumbs-item">
                <span className="caption text-white">{doctor.shortName}</span>
              </li>
            </ul>
            <h1 className="text-center text-white">{doctor.fullName}</h1>
          </div>
        </div>
      </section>

      <section className="doctor-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="doctor-section-contents">
            <div className="horizontal-contents-column">
              <div className="doctor-wrapper">
                <h2>{doctor.fullName}</h2>
                <div>{doctor.position}</div>
              </div>

              {doctor.bio.map((paragraph, i) => (
                <p key={i} className="paragraph-no-margin">
                  {paragraph}
                </p>
              ))}

              {doctor.highlights && doctor.highlights.length > 0 && (
                <ul className="doctor-highlights-list">
                  {doctor.highlights.map((h, i) => (
                    <li key={i}>
                      <strong>{h.title}:</strong> {h.description}
                    </li>
                  ))}
                </ul>
              )}

              {doctor.training && doctor.training.length > 0 && (
                <ul className="doctor-training-list">
                  {doctor.training.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}

              {doctor.quote && (
                <div className="doctor-quote-block">
                  <p className="paragraph-no-margin">&ldquo;{doctor.quote}&rdquo;</p>
                </div>
              )}

              <a href="/kontakty" className="primary-button w-inline-block">
                <div className="primary-button-main-contents">
                  <div className="primary-button-icon-wrapper">
                    <div className="icon w-embed">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.45 22.75C16.32 22.75 15.13 22.48 13.9 21.96C12.7 21.45 11.49 20.75 10.31 19.9C9.14 19.04 8.01 18.08 6.94 17.03C5.88 15.96 4.92 14.83 4.07 13.67C3.21 12.47 2.52 11.27 2.03 10.11C1.51 8.87 1.25 7.67 1.25 6.54C1.25 5.76 1.39 5.02 1.66 4.33C1.94 3.62 2.39 2.96 3 2.39C3.77 1.63 4.65 1.25 5.59 1.25C5.98 1.25 6.38 1.34 6.72 1.5C7.11 1.68 7.44 1.95 7.68 2.31L10 5.58C10.21 5.87 10.37 6.15 10.48 6.43C10.61 6.73 10.68 7.03 10.68 7.32C10.68 7.7 10.57 8.07 10.36 8.42C10.21 8.69 9.98 8.98 9.69 9.27L9.01 9.98C9.02 10.01 9.03 10.03 9.04 10.05C9.16 10.26 9.4 10.62 9.86 11.16C10.35 11.72 10.81 12.23 11.27 12.7C11.86 13.28 12.35 13.74 12.81 14.12C13.38 14.6 13.75 14.84 13.97 14.95L13.95 15L14.68 14.28C14.99 13.97 15.29 13.74 15.58 13.59C16.13 13.25 16.83 13.19 17.53 13.48C17.79 13.59 18.07 13.74 18.37 13.95L21.69 16.31C22.06 16.56 22.33 16.88 22.49 17.26C22.64 17.64 22.71 17.99 22.71 18.34C22.71 18.82 22.6 19.3 22.39 19.75C22.18 20.2 21.92 20.59 21.59 20.95C21.02 21.58 20.4 22.03 19.68 22.32C18.99 22.6 18.24 22.75 17.45 22.75Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="primary-button-text">Записатись на прийом</div>
                </div>
                <div className="primary-button-hover-bg">
                  <div className="primary-button-icon-wrapper">
                    <div className="icon w-embed">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.45 22.75C16.32 22.75 15.13 22.48 13.9 21.96C12.7 21.45 11.49 20.75 10.31 19.9C9.14 19.04 8.01 18.08 6.94 17.03C5.88 15.96 4.92 14.83 4.07 13.67C3.21 12.47 2.52 11.27 2.03 10.11C1.51 8.87 1.25 7.67 1.25 6.54C1.25 5.76 1.39 5.02 1.66 4.33C1.94 3.62 2.39 2.96 3 2.39C3.77 1.63 4.65 1.25 5.59 1.25C5.98 1.25 6.38 1.34 6.72 1.5C7.11 1.68 7.44 1.95 7.68 2.31L10 5.58C10.21 5.87 10.37 6.15 10.48 6.43C10.61 6.73 10.68 7.03 10.68 7.32C10.68 7.7 10.57 8.07 10.36 8.42C10.21 8.69 9.98 8.98 9.69 9.27L9.01 9.98C9.02 10.01 9.03 10.03 9.04 10.05C9.16 10.26 9.4 10.62 9.86 11.16C10.35 11.72 10.81 12.23 11.27 12.7C11.86 13.28 12.35 13.74 12.81 14.12C13.38 14.6 13.75 14.84 13.97 14.95L13.95 15L14.68 14.28C14.99 13.97 15.29 13.74 15.58 13.59C16.13 13.25 16.83 13.19 17.53 13.48C17.79 13.59 18.07 13.74 18.37 13.95L21.69 16.31C22.06 16.56 22.33 16.88 22.49 17.26C22.64 17.64 22.71 17.99 22.71 18.34C22.71 18.82 22.6 19.3 22.39 19.75C22.18 20.2 21.92 20.59 21.59 20.95C21.02 21.58 20.4 22.03 19.68 22.32C18.99 22.6 18.24 22.75 17.45 22.75Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="primary-button-text-hover">Записатись на прийом</div>
                </div>
              </a>
            </div>

            <div className="horizontal-image-column">
              <img
                src={doctor.photo}
                alt={doctor.fullName}
                className="doctor-detail-image"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
