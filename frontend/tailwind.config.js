/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx, png, jpg}"],
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
        m: '.875rem',
        xl: ['90px', '32px']
      },
      fontFamily: {
        display: ['Orienta', 'cursive']
      }
  }
  },
  plugins: [],
}