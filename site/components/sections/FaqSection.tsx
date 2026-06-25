import type { FaqGroup } from "@/lib/data/faq";

/**
 * Сторінка /faq. Відтворює DOM зі сниппета faq-page.html 1-в-1 (класи Webflow,
 * акордеони .w-dropdown, обидві іконки open/close), щоб стилі й поведінка лишилися
 * ідентичні. Дані тягнуться з Supabase замість захардкодженого HTML.
 * Акордеони оживляє <WebflowInit /> на сторінці за класами .w-dropdown.
 */

// Виділяє останнє слово заголовка кольоровим span — як у вихідній верстці.
function GroupTitle({ title }: { title: string }) {
  const parts = title.trim().split(/\s+/);
  if (parts.length <= 1) {
    return (
      <h2>
        <span className="text-color">{title}</span>
      </h2>
    );
  }
  const last = parts[parts.length - 1];
  const head = parts.slice(0, -1).join(" ");
  return (
    <h2>
      {head} <span className="text-color">{last}</span>
    </h2>
  );
}

function AccordionIconClose() {
  return (
    <div style={{ display: "none" }} className="icon close w-embed">
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 13.25H6C5.59 13.25 5.25 12.91 5.25 12.5C5.25 12.09 5.59 11.75 6 11.75H18C18.41 11.75 18.75 12.09 18.75 12.5C18.75 12.91 18.41 13.25 18 13.25Z"
          fill="black"
        />
      </svg>
    </div>
  );
}

function AccordionIconOpen() {
  return (
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
  );
}

export default function FaqSection({ groups }: { groups: FaqGroup[] }) {
  return (
    <section className="faq-page-section">
      <div className="w-layout-blockcontainer container w-container">
        {groups.map((group) => (
          <div key={group.id} className="faq-group">
            <div className="faq-group-header">
              <div className="faq-group-badge">{group.badge}</div>
              <GroupTitle title={group.title} />
            </div>
            <div className="accordions">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  data-delay="0"
                  data-hover="false"
                  className="accordion w-dropdown"
                >
                  <div className="faq-dropdown w-dropdown-toggle">
                    <div className="heading-5">{item.question}</div>
                    <AccordionIconClose />
                    <AccordionIconOpen />
                  </div>
                  <nav
                    style={{ width: "100%", height: "0rem" }}
                    className="accordion-answer-wrapper w-dropdown-list"
                  >
                    <p className="accordion-answer">{item.answer}</p>
                  </nav>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
