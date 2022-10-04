module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      body: ["Source Sans Pro"],
    },
    extend: {
      colors: {
        institute: {
          red: "#9F2241",
          green: "#235B4E",
          yellow: "#DDc9A3",
          gray: "#98989A",
        },
      }
    }
  },
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("@tailwindcss/forms"),
  ],
};
