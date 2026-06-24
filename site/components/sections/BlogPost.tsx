import {
  BlogPost as BlogPostType,
  CATEGORY_META,
  formatDateUk,
  getRelatedPosts,
} from "@/lib/blog";
import { getPublishedDoctors } from "@/lib/data/doctors";
import { SITE_URL } from "@/lib/site-url";

type Props = {
  post: BlogPostType;
};

function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

export default async function BlogPost({ post }: Props) {
  const cat = CATEGORY_META[post.category];
  const allDoctors = await getPublishedDoctors();
  const author = allDoctors.find((d) => d.slug === post.authorSlug);
  const related = await getRelatedPosts(post.slug, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${post.featuredImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: author
      ? {
          "@type": "Person",
          name: author.fullName,
          jobTitle: author.position,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Дентсервіс",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Головна",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Блог",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cat.shortName,
        item: `${SITE_URL}/blog/category/${post.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };

  const faqSchema =
    post.faq && post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
        />
      )}

      <section className="page-banner-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="page-banner-contents">
            <ul role="list" className="post-breadcrumbs-list">
              <li className="breadcrumbs-item">
                <a href="/" className="caption text-white">
                  Головна
                </a>
              </li>
              <li>
                <div className="icon w-embed">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.68172 15.5025C6.53922 15.5025 6.39672 15.45 6.28422 15.3375C6.06672 15.12 6.06672 14.76 6.28422 14.5425L11.1742 9.65251C11.5342 9.29251 11.5342 8.70751 11.1742 8.34751L6.28422 3.45751C6.06672 3.24001 6.06672 2.88001 6.28422 2.66251C6.50172 2.44501 6.86172 2.44501 7.07922 2.66251L11.9692 7.55251C12.3517 7.93501 12.5692 8.45252 12.5692 9.00002C12.5692 9.54751 12.3592 10.065 11.9692 10.4475L7.07922 15.3375C6.96672 15.4425 6.82422 15.5025 6.68172 15.5025Z" fill="#f6f6f6"/>
                  </svg>
                </div>
              </li>
              <li className="breadcrumbs-item">
                <a href="/blog" className="caption text-white">
                  Блог
                </a>
              </li>
              <li>
                <div className="icon w-embed">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.68172 15.5025C6.53922 15.5025 6.39672 15.45 6.28422 15.3375C6.06672 15.12 6.06672 14.76 6.28422 14.5425L11.1742 9.65251C11.5342 9.29251 11.5342 8.70751 11.1742 8.34751L6.28422 3.45751C6.06672 3.24001 6.06672 2.88001 6.28422 2.66251C6.50172 2.44501 6.86172 2.44501 7.07922 2.66251L11.9692 7.55251C12.3517 7.93501 12.5692 8.45252 12.5692 9.00002C12.5692 9.54751 12.3592 10.065 11.9692 10.4475L7.07922 15.3375C6.96672 15.4425 6.82422 15.5025 6.68172 15.5025Z" fill="#f6f6f6"/>
                  </svg>
                </div>
              </li>
              <li className="breadcrumbs-item">
                <a
                  href={`/blog/category/${post.category}`}
                  className="caption text-white"
                >
                  {cat.shortName}
                </a>
              </li>
            </ul>
            <h1 className="text-center text-white">{post.title}</h1>
            <div className="post-data-wrapper">
              <div className="post-data">
                <div className="icon w-embed">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.66797 4.79163C6.3263 4.79163 6.04297 4.50829 6.04297 4.16663V1.66663C6.04297 1.32496 6.3263 1.04163 6.66797 1.04163C7.00964 1.04163 7.29297 1.32496 7.29297 1.66663V4.16663C7.29297 4.50829 7.00964 4.79163 6.66797 4.79163Z" fill="white"/>
                    <path d="M13.332 4.79163C12.9904 4.79163 12.707 4.50829 12.707 4.16663V1.66663C12.707 1.32496 12.9904 1.04163 13.332 1.04163C13.6737 1.04163 13.957 1.32496 13.957 1.66663V4.16663C13.957 4.50829 13.6737 4.79163 13.332 4.79163Z" fill="white"/>
                    <path d="M17.0846 8.19995H2.91797C2.5763 8.19995 2.29297 7.91662 2.29297 7.57495C2.29297 7.23328 2.5763 6.94995 2.91797 6.94995H17.0846C17.4263 6.94995 17.7096 7.23328 17.7096 7.57495C17.7096 7.91662 17.4263 8.19995 17.0846 8.19995Z" fill="white"/>
                    <path d="M13.3333 18.9583H6.66667C3.625 18.9583 1.875 17.2083 1.875 14.1666V7.08329C1.875 4.04163 3.625 2.29163 6.66667 2.29163H13.3333C16.375 2.29163 18.125 4.04163 18.125 7.08329V14.1666C18.125 17.2083 16.375 18.9583 13.3333 18.9583Z" fill="white"/>
                  </svg>
                </div>
                <div className="caption text-white">
                  {formatDateUk(post.publishedAt)}
                </div>
              </div>
              {author && (
                <div className="post-data">
                  <div className="icon w-embed">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.9987 10.625C7.35703 10.625 5.20703 8.47496 5.20703 5.83329C5.20703 3.19163 7.35703 1.04163 9.9987 1.04163C12.6404 1.04163 14.7904 3.19163 14.7904 5.83329C14.7904 8.47496 12.6404 10.625 9.9987 10.625Z" fill="#F6F6F6"/>
                      <path d="M2.84375 18.9583C2.50208 18.9583 2.21875 18.675 2.21875 18.3333C2.21875 14.775 5.71044 11.875 10.0021 11.875C10.9104 11.875 11.8104 12.0084 12.6521 12.2584" stroke="#F6F6F6" strokeWidth="1.2"/>
                    </svg>
                  </div>
                  <div className="caption text-white">{author.shortName}</div>
                </div>
              )}
              <div className="post-data">
                <div className="icon w-embed">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.2" fill="none"/>
                    <path d="M10 6V10L13 12" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="caption text-white">
                  {post.readingTimeMin} хв читання
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="single-post-section">
        <div className="w-layout-blockcontainer container is-small w-container">
          <div className="single-post-section-contents">
            <img
              src={post.featuredImage}
              alt={post.imageAlt}
              loading="eager"
              className="blog-featured-image"
            />
            <div
              className="post-contents w-richtext"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.faq && post.faq.length > 0 && (
              <div className="blog-faq-block">
                <h2>Часті питання</h2>
                {post.faq.map((f, i) => (
                  <details key={i} className="blog-faq-item">
                    <summary>{f.question}</summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
              </div>
            )}

            {author && (
              <div className="blog-author-bio">
                <img
                  src={author.photo}
                  alt={author.fullName}
                  className="blog-author-photo"
                />
                <div className="blog-author-text">
                  <div className="blog-author-name">{author.fullName}</div>
                  <div className="blog-author-position">{author.position}</div>
                  <div className="blog-author-experience">
                    {author.experience}
                  </div>
                </div>
              </div>
            )}

            <div className="blog-cta-block">
              <h3>Маєте запитання за темою?</h3>
              <p>
                Запишіться на консультацію — лікар відповість особисто, проведе
                3D-сканування та складе план лікування.
              </p>
              <a href="/kontakty" className="primary-button w-inline-block">
                <div className="primary-button-main-contents">
                  <div className="primary-button-text">Записатись на консультацію</div>
                </div>
                <div className="primary-button-hover-bg">
                  <div className="primary-button-text-hover">Записатись на консультацію</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="blog-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="blog-section-contents">
              <div className="blog-wrapper">
                <h2>Читайте також</h2>
                <div className="_3columns-grid">
                  {related.map((rp) => (
                    <article key={rp.slug} className="post-box">
                      <a
                        href={`/blog/${rp.slug}`}
                        className="post-thumbnail-wrapper"
                      >
                        <img
                          src={rp.featuredImage}
                          alt={rp.imageAlt}
                          loading="lazy"
                          className="post-thumbnail"
                        />
                      </a>
                      <div className="post-body">
                        <div className="post-datas">
                          <div className="post-data">
                            <div className="caption">
                              {CATEGORY_META[rp.category].shortName}
                            </div>
                          </div>
                          <div className="post-data">
                            <div className="caption">
                              {formatDateUk(rp.publishedAt)}
                            </div>
                          </div>
                        </div>
                        <a href={`/blog/${rp.slug}`} className="w-inline-block">
                          <h3 className="heading-4">{rp.title}</h3>
                        </a>
                        <div className="divider"></div>
                        <a
                          href={`/blog/${rp.slug}`}
                          className="text-button w-inline-block"
                        >
                          <div className="text-button-text-wrapper">
                            <div className="button-text-link">Читати далі</div>
                          </div>
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
