"use client";

import { useMemo, useState } from "react";
import {
  BlogPost,
  BlogCategory,
  CATEGORY_META,
  CATEGORY_ORDER,
  formatDateUk,
} from "@/lib/blog";

type Props = {
  posts: BlogPost[];
  initialCategory?: BlogCategory | "all";
};

export default function BlogList({ posts, initialCategory = "all" }: Props) {
  const [active, setActive] = useState<BlogCategory | "all">(initialCategory);

  const filtered = useMemo(() => {
    if (active === "all") return posts;
    return posts.filter((p) => p.category === active);
  }, [posts, active]);

  return (
    <section className="blog-section">
      <div className="w-layout-blockcontainer container w-container">
        <div className="blog-section-contents">
          <div className="blog-filter-bar">
            <FilterChip
              label="Усі"
              isActive={active === "all"}
              onClick={() => setActive("all")}
            />
            {CATEGORY_ORDER.map((cat) => (
              <FilterChip
                key={cat}
                label={CATEGORY_META[cat].shortName}
                isActive={active === cat}
                onClick={() => setActive(cat)}
              />
            ))}
          </div>

          <div className="blog-wrapper">
            <div className="_3columns-grid">
              {filtered.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="blog-empty-state">
                У цій категорії статей поки немає. Подивіться інші розділи.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`blog-filter-chip ${isActive ? "is-active" : ""}`}
      onClick={onClick}
    >
      <div className="blog-filter-chip-main">
        <div className="blog-filter-chip-text">{label}</div>
      </div>
      <div className="blog-filter-chip-hover">
        <div className="blog-filter-chip-text">{label}</div>
      </div>
    </button>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  const cat = CATEGORY_META[post.category];
  return (
    <article className="post-box">
      <a href={`/blog/${post.slug}`} className="post-thumbnail-wrapper">
        <img
          src={post.featuredImage}
          alt={post.imageAlt}
          loading="lazy"
          className="post-thumbnail"
        />
      </a>
      <div className="post-body">
        <div className="post-datas">
          <a
            href={`/blog/category/${post.category}`}
            className="post-data w-inline-block"
          >
            <div className="icon w-embed">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 10.75H17C14.58 10.75 13.25 9.42 13.25 7V5C13.25 2.58 14.58 1.25 17 1.25H19C21.42 1.25 22.75 2.58 22.75 5V7C22.75 9.42 21.42 10.75 19 10.75Z" fill="#5A5A5A"/>
                <path d="M7 22.75H5C2.58 22.75 1.25 21.42 1.25 19V17C1.25 14.58 2.58 13.25 5 13.25H7C9.42 13.25 10.75 14.58 10.75 17V19C10.75 21.42 9.42 22.75 7 22.75Z" fill="#5A5A5A"/>
                <path d="M6 10.75C3.38 10.75 1.25 8.62 1.25 6C1.25 3.38 3.38 1.25 6 1.25C8.62 1.25 10.75 3.38 10.75 6C10.75 8.62 8.62 10.75 6 10.75Z" fill="#5A5A5A"/>
                <path d="M18 22.75C15.38 22.75 13.25 20.62 13.25 18C13.25 15.38 15.38 13.25 18 13.25C20.62 13.25 22.75 15.38 22.75 18C22.75 20.62 20.62 22.75 18 22.75Z" fill="#5A5A5A"/>
              </svg>
            </div>
            <div className="caption">{cat.shortName}</div>
          </a>
          <div className="post-data">
            <div className="icon w-embed">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5.75C7.59 5.75 7.25 5.41 7.25 5V2C7.25 1.59 7.59 1.25 8 1.25C8.41 1.25 8.75 1.59 8.75 2V5C8.75 5.41 8.41 5.75 8 5.75Z" fill="#5A5A5A"/>
                <path d="M16 5.75C15.59 5.75 15.25 5.41 15.25 5V2C15.25 1.59 15.59 1.25 16 1.25C16.41 1.25 16.75 1.59 16.75 2V5C16.75 5.41 16.41 5.75 16 5.75Z" fill="#5A5A5A"/>
                <path d="M20.5 9.83984H3.5C3.09 9.83984 2.75 9.49984 2.75 9.08984C2.75 8.67984 3.09 8.33984 3.5 8.33984H20.5C20.91 8.33984 21.25 8.67984 21.25 9.08984C21.25 9.49984 20.91 9.83984 20.5 9.83984Z" fill="#5A5A5A"/>
                <path d="M16 22.75H8C4.35 22.75 2.25 20.65 2.25 17V8.5C2.25 4.85 4.35 2.75 8 2.75H16C19.65 2.75 21.75 4.85 21.75 8.5V17C21.75 20.65 19.65 22.75 16 22.75Z" fill="#5A5A5A"/>
              </svg>
            </div>
            <div className="caption">{formatDateUk(post.publishedAt)}</div>
          </div>
        </div>
        <a href={`/blog/${post.slug}`} className="w-inline-block">
          <h3 className="heading-4">{post.title}</h3>
        </a>
        <p className="paragraph-no-margin blog-card-excerpt-text">
          {post.excerpt}
        </p>
        <div className="divider"></div>
        <a href={`/blog/${post.slug}`} className="text-button w-inline-block">
          <div className="text-button-text-wrapper">
            <div className="button-text-link">Читати далі</div>
            <div style={{ width: "0%", height: "0.125rem" }} className="text-button-hover-line"></div>
          </div>
          <div className="text-button-icon-wrapper">
            <div className="text-button-icon is-main w-embed">
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.4297 6.42993L20.4997 12.4999L14.4297 18.5699" stroke="black" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 12.5H20.33" stroke="black" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </a>
      </div>
    </article>
  );
}
