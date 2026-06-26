import type { Metadata } from "next";

import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";

export const metadata: Metadata = {
  title: "Договір публічної оферти — Дентсервіс",
  description:
    "Договір публічної оферти медичного центру «Дентсервіс» у Дніпрі. Ознайомтеся з умовами надання стоматологічних послуг.",
};

export default function PublicOfferPage() {
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
                <span className="caption text-white">Договір публічної оферти</span>
              </li>
            </ul>
            <h1 className="text-center text-white">Договір публічної оферти</h1>
          </div>
        </div>
      </section>

      <section className="section-default">
        <div className="w-layout-blockcontainer container w-container">
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              padding: "32px 0",
            }}
          >
            <p
              style={{
                marginBottom: "24px",
                lineHeight: 1.7,
                color: "#2c2c2c",
              }}
            >
              Ознайомтеся з умовами договору публічної оферти медичного центру
              «Дентсервіс». Документ наведено нижче для перегляду.
            </p>

            <a
              href="/dohovir-oferty.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button w-button offer-open-button"
              style={{
                display: "inline-block",
                marginBottom: "20px",
              }}
            >
              Відкрити документ повністю
            </a>

            {/* Inline preview: hidden on mobile because iOS Safari only renders
                the first page of a PDF inside an iframe. On phones the button
                above opens the full multi-page PDF in the native viewer. */}
            <div
              className="offer-pdf-frame"
              style={{
                position: "relative",
                width: "100%",
                height: "80vh",
                minHeight: "600px",
                border: "1px solid #e2e2e2",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#f5f5f5",
              }}
            >
              <iframe
                src="/dohovir-oferty.pdf#toolbar=0&navpanes=0&view=FitH"
                title="Договір публічної оферти"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <HtmlSection file="footer.html" />
      <WebflowInit />
    </>
  );
}
