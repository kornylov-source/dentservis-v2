import type { ClinicInfo } from "@/lib/data/clinic";

/**
 * Секція контактів на /kontakty. Відтворює DOM зі сниппета contact-section.html.
 * Телефони / адреса / графік / посилання на карту беруться з clinic_info (Supabase) —
 * єдине джерело правди разом з AI-ботом. Форма і Google-карта статичні.
 */
export default function ContactSection({ clinic }: { clinic: ClinicInfo }) {
  return (
    <>
      <section className="contactus-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="contactus-centered">
            <h2>
              Запишіться на <span className="text-color">консультацію</span>
            </h2>
            <p className="paragraph-no-margin">
              Залиште свої контакти — ми передзвонимо протягом 15 хвилин у робочий час та підберемо зручний час для прийому.
            </p>

            <div className="work-hours-wrapper">
              <div className="day-wrapper">
                <div className="caption">Понеділок – П&apos;ятниця</div>
                <div className="caption">9:00 – 19:00</div>
              </div>
              <div className="gray-divider"></div>
              <div className="day-wrapper">
                <div className="caption">Субота</div>
                <div className="caption">9:00 – 14:00</div>
              </div>
              <div className="gray-divider"></div>
              <div className="day-wrapper">
                <div className="caption">Неділя</div>
                <div className="caption">Вихідний</div>
              </div>
            </div>

            <p className="paragraph-no-margin contactus-cta-label">
              Напишіть або зателефонуйте нам
            </p>

            <div className="contactus-wrapper">
              <a href={`tel:${clinic.phoneIntl}`} className="contactus-box">
                <div className="icon w-embed">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M23.2665 30.3334C21.7598 30.3334 20.1732 29.9734 18.5332 29.28C16.9332 28.6 15.3198 27.6667 13.7465 26.5334C12.1865 25.3867 10.6798 24.1067 9.25317 22.7067C7.83984 21.28 6.55984 19.7734 5.4265 18.2267C4.27984 16.6267 3.35984 15.0267 2.7065 13.48C2.01317 11.8267 1.6665 10.2267 1.6665 8.72002C1.6665 7.68002 1.85317 6.69335 2.21317 5.77335C2.5865 4.82669 3.1865 3.94669 3.99984 3.18669C5.0265 2.17335 6.19984 1.66669 7.45317 1.66669C7.97317 1.66669 8.5065 1.78669 8.95984 2.00002C9.47984 2.24002 9.91984 2.60002 10.2398 3.08002L13.3332 7.44002C13.6132 7.82669 13.8265 8.20002 13.9732 8.57335C14.1465 8.97335 14.2398 9.37335 14.2398 9.76002C14.2398 10.2667 14.0932 10.76 13.8132 11.2267C13.6132 11.5867 13.3065 11.9734 12.9198 12.36L12.0132 13.3067C12.0265 13.3467 12.0398 13.3734 12.0532 13.4C12.2132 13.68 12.5332 14.16 13.1465 14.88C13.7998 15.6267 14.4132 16.3067 15.0265 16.9334C15.8132 17.7067 16.4665 18.32 17.0798 18.8267C17.8398 19.4667 18.3332 19.7867 18.6265 19.9334L18.5998 20L19.5732 19.04C19.9865 18.6267 20.3865 18.32 20.7732 18.12C21.5065 17.6667 22.4398 17.5867 23.3732 17.9734C23.7198 18.12 24.0932 18.32 24.4932 18.6L28.9198 21.7467C29.4132 22.08 29.7732 22.5067 29.9865 23.0134C30.1865 23.52 30.2798 23.9867 30.2798 24.4534C30.2798 25.0934 30.1332 25.7334 29.8532 26.3334C29.5732 26.9334 29.2265 27.4534 28.7865 27.9334C28.0265 28.7734 27.1998 29.3734 26.2398 29.76C25.3198 30.1334 24.3198 30.3334 23.2665 30.3334Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <div className="heading-5">Зателефонувати</div>
                <div className="caption">{clinic.phone}</div>
                <div className="caption">{clinic.phone2}</div>
              </a>

              <a
                href="https://t.me/dentservicedp"
                target="_blank"
                rel="noopener"
                className="contactus-box"
              >
                <div className="icon w-embed">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M23.91 3.79 20.3 20.84c-.25 1.21-.98 1.5-1.99.93l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56l.38-5.56 10.14-9.17c.44-.39-.1-.61-.68-.22L6.27 13.94l-5.45-1.7c-1.18-.37-1.2-1.18.25-1.75l21.3-8.22c.99-.37 1.85.22 1.54 1.52Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <div className="heading-5">Telegram</div>
                <div className="caption">Написати чи подзвонити</div>
              </a>

              <a
                href={`viber://chat?number=%2B${clinic.phoneIntl.replace("+", "")}`}
                className="contactus-box"
              >
                <div className="icon w-embed">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18.4 3.4C17.55 2.62 14.13 0.13 6.5 0.1 6.5 0.1 -2.49-.43.89 8.92c0 0 1.31 3.69 4.27 5.86.13.1.13.21.13.21l.04 4.74s-.02 1.91 1.24.6l2.83-3.02c2.97.2 5.27-.37 5.53-.46.6-.2 4.02-.64 4.58-5.19.57-4.7-.29-7.67-1.65-9.01ZM18.7 11.7c-.47 3.79-3.24 4.03-3.75 4.2-.22.07-2.24.57-4.78.4 0 0-1.9 2.29-2.49 2.88-.2.2-.42.18-.41-.22 0-.26.01-3.27.01-3.27s-.01-.11-.11-.18c-2.51-1.81-3.61-4.98-3.61-4.98C.6 3.36 7.96 3.8 7.96 3.8c6.45.02 9.34 1.97 10.06 2.62 1.15.94 1.73 3.46 1.18 6.34-.16-.83-.5-1.06-.5-1.06ZM10.7 5.32c-.18 0-.18.27 0 .28 2.13.01 3.89 1.47 3.91 4.14 0 .19.27.18.27 0v-.01c-.02-2.88-1.94-4.51-4.18-4.41Zm2.95 3.5c-.18.01-.18.28 0 .29.55.03.81.32.78.91-.01.19.26.18.27 0 .04-.79-.37-1.24-1.05-1.2h-.01Zm-1.45-1.15c-.18-.01-.19.27-.01.28 1.55.12 2.27.91 2.16 2.6-.01.18.26.18.27 0 .13-1.93-.79-2.74-2.41-2.88Zm-.5 4.5c-.43.24-.92.18-1.51-.08-1.43-.6-2.79-1.93-3.4-3.4-.26-.59-.32-1.08-.08-1.51.13-.24.5-.5.74-.68.36-.27.7-.04.95.29l.59.81c.13.18.22.4.06.66l-.23.34c-.16.24-.14.4.06.65.4.5.86.85 1.42 1.16.27.15.52.13.71-.1l.27-.32c.2-.24.36-.18.6-.05.39.22.74.41.95.55.32.21.5.5.27.93Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <div className="heading-5">Viber</div>
                <div className="caption">Написати чи подзвонити</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-map-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="contact-map-wrapper">
            <iframe
              src="https://www.google.com/maps?q=%D0%94%D0%B5%D0%BD%D1%82-%D0%A1%D0%B5%D1%80%D0%B2%D1%96%D1%81+%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&hl=uk&z=17&output=embed"
              width="100%"
              height={500}
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              title="Дентсервіс на карті Дніпра"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
