/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        heading: {
          1 : '#000235'
        },
        textfield: {
          1 : '#D9D9D9'
        }
      }
    },
    fontFamily: {
      outfit: ["Outfit", "sans-serif"]
    }
  },
  plugins: [],
}

