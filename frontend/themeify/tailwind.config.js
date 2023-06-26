/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend : {
      backgroundImage: {
        'back' : "url('gradientBlob.jpg')",
        'single' : "url('singleblob.png')",
        'blackback' : "url('blackback.png')"
      },
      fontSize: {
        xs: ['14px', '20px'],
        s: ['20px', '30px'],
        m: ['40px', '60x'],
        xl: ['90px', '32px']
      },
      fontFamily: {
        display: ['Orienta', 'cursive']
      }
  }
  },
  plugins: [],
}