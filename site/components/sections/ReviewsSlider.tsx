import type { Review } from "@/lib/data/reviews";

/**
 * Слайдер відгуків на головній. Відтворює DOM зі сниппета testimonials-slider.html 1-в-1
 * (Webflow w-slider з усіма data-* атрибутами, стрілки, SVG), щоб слайдер після
 * WebflowInit (ix2 re-init) працював так само. Дані — з Supabase.
 */
export default function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  return (
    <section className="testimonials-clean-section">
      <div className="w-layout-blockcontainer container w-container">
        <div className="testimonials-clean-header">
          <h2>
            Що кажуть наші <span className="text-color">пацієнти</span>
          </h2>
          <p className="paragraph-no-margin">
            Реальні відгуки людей, яким ми допомогли. Дякуємо за довіру!
          </p>
        </div>
        <div
          data-delay="4000"
          data-animation="slide"
          className="whyus-slider w-slider testimonials-clean-slider"
          data-autoplay="false"
          data-easing="ease"
          data-hide-arrows="false"
          data-disable-swipe="false"
          data-autoplay-limit="0"
          data-nav-spacing="3"
          data-duration="500"
          data-infinite="true"
        >
          <div className="whyus-slider-mask w-slider-mask">
            {reviews.map((r) => (
              <div key={r.slug} className="whyus-slide w-slide">
                <div className="testimonial-box-version-one">
                  <div className="testimonial-one-body">
                    <p className="paragraph-no-margin">{r.text}</p>
                  </div>
                  <div className="divider"></div>
                  <div className="testimonial-user-wrapper">
                    <img
                      src={r.avatar}
                      loading="lazy"
                      width={56}
                      alt={r.author}
                      className="user-image"
                    />
                    <div className="user-information">
                      <div className="heading-5">{r.author}</div>
                      <img
                        src="/images/stars.webp"
                        loading="lazy"
                        alt={`${r.stars} зірок`}
                        className="stars"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="left-arrow w-slider-arrow-left">
            <div className="icon w-embed">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.0904 20.6695C15.2804 20.6695 15.4704 20.5995 15.6204 20.4495C15.9104 20.1595 15.9104 19.6795 15.6204 19.3895L9.10039 12.8695C8.62039 12.3895 8.62039 11.6095 9.10039 11.1295L15.6204 4.60953C15.9104 4.31953 15.9104 3.83953 15.6204 3.54953C15.3304 3.25953 14.8504 3.25953 14.5604 3.54953L8.04039 10.0695C7.53039 10.5795 7.24039 11.2695 7.24039 11.9995C7.24039 12.7295 7.52039 13.4195 8.04039 13.9295L14.5604 20.4495C14.7104 20.5895 14.9004 20.6695 15.0904 20.6695Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <div className="right-arrow w-slider-arrow-right">
            <div className="icon w-embed">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.90961 20.6695C8.71961 20.6695 8.52961 20.5995 8.37961 20.4495C8.08961 20.1595 8.08961 19.6795 8.37961 19.3895L14.8996 12.8695C15.3796 12.3895 15.3796 11.6095 14.8996 11.1295L8.37961 4.60953C8.08961 4.31953 8.08961 3.83953 8.37961 3.54953C8.66961 3.25953 9.14961 3.25953 9.43961 3.54953L15.9596 10.0695C16.4696 10.5795 16.7596 11.2695 16.7596 11.9995C16.7596 12.7295 16.4796 13.4195 15.9596 13.9295L9.43961 20.4495C9.28961 20.5895 9.09961 20.6695 8.90961 20.6695Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <div className="display-none w-slider-nav"></div>
        </div>
      </div>
    </section>
  );
}
