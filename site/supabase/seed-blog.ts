/**
 * Сід статей блогу в таблицю blog_posts.
 * Запуск (з папки site):  node --env-file=.env.local supabase/seed-blog.ts
 * Ідемпотентний (upsert by slug). Джерело — lib/blog-posts.ts (15 статей).
 * content проганяється через ту саму санітизацію, що й у адмінці, перед збереженням.
 */
import { createClient } from "@supabase/supabase-js";
import sanitizeHtmlLib from "sanitize-html";
import { posts } from "../lib/blog-posts.ts";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

// Той самий whitelist, що в lib/admin/sanitize-html.ts.
const ALLOWED_TAGS = ["p","h2","h3","h4","strong","b","em","i","u","ul","ol","li","a","blockquote","br","table","thead","tbody","tr","td","th"];
function sanitize(dirty: string): string {
  return sanitizeHtmlLib(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ["href","target","rel"], table: ["class"], td: ["colspan","rowspan"], th: ["colspan","rowspan","scope"] },
    allowedSchemes: ["http","https","mailto","tel"],
    allowedSchemesByTag: { a: ["http","https","mailto","tel"] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName: string, attribs: Record<string, string>) => {
        const href = attribs.href ?? "";
        const isExternal = /^https?:\/\//i.test(href);
        return { tagName: "a", attribs: { ...attribs, ...(isExternal ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {}) } };
      },
    },
    nonTextTags: ["script","style","textarea","noscript"],
  });
}

const rows = posts.map((p) => {
  const { slug, category, authorSlug, publishedAt, ...rest } = p;
  const payload = {
    title: p.title,
    excerpt: p.excerpt,
    content: sanitize(p.content),
    category,
    authorSlug,
    publishedAt,
    updatedAt: p.updatedAt,
    featuredImage: p.featuredImage,
    imageAlt: p.imageAlt,
    readingTimeMin: p.readingTimeMin,
    seo: p.seo,
    faq: p.faq,
  };
  return {
    slug,
    status: "published",
    category,
    author_slug: authorSlug,
    published_at: publishedAt,
    published: payload,
    draft: null,
  };
});

const { error } = await supabase.from("blog_posts").upsert(rows, { onConflict: "slug" });
if (error) {
  console.error("SEED ERROR:", error);
  process.exit(1);
}

const { count } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
console.log(`Seeded ${rows.length} blog posts. Total rows: ${count}`);
