import type { Metadata } from "next";

import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import { getPublishedClinic } from "@/lib/data/clinic";

export const metadata: Metadata = {
  title: "Політика конфіденційності — Дент-Сервіс",
  description:
    "Як медичний центр «Дент-Сервіс» обробляє ваші персональні дані: збір, зберігання, AI-помічник, ваші права.",
};

export default async function PrivacyPolicyPage() {
  const clinic = await getPublishedClinic();
  return (
    <>
      <HtmlSection file="header.html" />

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
                <span className="caption text-white"> / </span>
              </li>
              <li className="breadcrumbs-item">
                <span className="caption text-white">Політика конфіденційності</span>
              </li>
            </ul>
            <h1 className="text-center text-white">Політика конфіденційності</h1>
          </div>
        </div>
      </section>

      <section className="section-default">
        <div className="w-layout-blockcontainer container w-container">
          <div
            style={{
              maxWidth: "780px",
              margin: "0 auto",
              padding: "32px 0",
              lineHeight: 1.7,
              color: "#2c2c2c",
            }}
          >
            <p>
              <strong>{clinic.legalName}</strong> ({clinic.name}), далі «Клініка»,
              поважає вашу конфіденційність та обробляє персональні дані відповідно
              до Закону України «Про захист персональних даних».
            </p>

            <h2>Які дані ми збираємо</h2>
            <p>
              <strong>Контактні дані</strong>, які ви добровільно залишаєте через
              форми на сайті: ім&apos;я, телефон, електронна пошта, повідомлення.
              Ми використовуємо їх виключно для зв&apos;язку щодо вашого запису
              чи запиту.
            </p>
            <p>
              <strong>Технічні дані</strong>: IP-адреса, тип браузера, сторінки,
              які ви відвідали. Збираються анонімно для аналітики й безпеки сайту.
            </p>

            <h2>Cookies</h2>
            <p>
              Сайт використовує cookies для коректної роботи інтерфейсу та
              збору анонімної статистики. Ви можете заборонити cookies у
              налаштуваннях браузера.
            </p>

            <h2>AI-помічник на сайті</h2>
            <p>
              На сайті працює AI-помічник на базі Claude API (компанія
              Anthropic, США). Коли ви надсилаєте повідомлення в чат, ваш текст
              передається на сервери Anthropic для генерації відповіді.
            </p>
            <p>
              Anthropic зберігає переписку <strong>не більше 7 днів</strong> для
              забезпечення безпеки і <strong>не використовує ваші дані для
              навчання AI-моделей</strong>. Жодних персональних або медичних
              даних AI-помічник не передає третім сторонам.
            </p>
            <p>
              <strong>Ми не рекомендуємо</strong> вводити в чат особисті медичні
              дані, реквізити карток або іншу конфіденційну інформацію. AI-помічник
              надає лише довідкову інформацію про клініку — він не лікар і не
              замінює медичну консультацію.
            </p>
            <p>
              Детальніше про політику обробки даних Anthropic:{" "}
              <a
                href="https://privacy.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3083FF" }}
              >
                privacy.anthropic.com
              </a>
            </p>

            <h2>Зберігання та захист</h2>
            <p>
              Ваші контактні дані зберігаються на захищених серверах і
              використовуються лише уповноваженим персоналом клініки. Ми не
              передаємо ваші дані третім сторонам без вашої згоди, окрім випадків
              передбачених законодавством.
            </p>

            <h2>Ваші права</h2>
            <ul>
              <li>Отримати інформацію про оброблювані дані</li>
              <li>Виправити неточні дані</li>
              <li>Вимагати видалення ваших даних</li>
              <li>Відкликати згоду на обробку</li>
            </ul>

            <h2>Контакти для запитів</h2>
            <p>
              Якщо у вас є питання щодо обробки ваших персональних даних —
              зателефонуйте: <a href={`tel:${clinic.phoneIntl}`} style={{ color: "#3083FF" }}>{clinic.phone}</a>.
            </p>
            <p>
              Адреса клініки: {clinic.address}.
            </p>
          </div>
        </div>
      </section>

      <HtmlSection file="footer.html" />
      <WebflowInit />
    </>
  );
}
