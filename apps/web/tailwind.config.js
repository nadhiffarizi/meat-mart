/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryGreen: 'rgb(1, 48, 40)',
        primaryBackground: 'rgb(246, 246, 246)',
        primaryIcon: 'rgb(255, 255, 254)',
        orangeAccent: 'rgb(251, 112, 17)',
        primaryText: 'rgb(82, 87, 91)',
        secondaryText: 'rgb(157, 160, 167)',
      },
    },
  },
  plugins: [],
};
