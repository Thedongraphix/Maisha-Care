/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    'tailwindcss/nesting': 'postcss-nesting',
  },
};

export default config;
