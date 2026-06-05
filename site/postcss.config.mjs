// PostCSS — тільки для CSS, що імпортується в модульний граф (admin.css з Tailwind).
// Публічний сайт використовує статичні <link> на /public/css/*.css і сюди не потрапляє.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
