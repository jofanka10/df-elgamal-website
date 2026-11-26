/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        strix: {
          bg: '#1c202c',
          face: '#232939',
          sunk: '#1a1e29',
          light: '#2f3750',
          shade: '#11141c',
          text: '#e8ecf5',
          dim: '#7f89a3',
          purple: '#8b7cf6',
          pink: '#f08ac0',
          green: '#5fd6a4',
          red: '#f27a7a',
          amber: '#f5b855',
        },
      },
      boxShadow: {
        'neu-out': '6px 6px 14px #11141c, -6px -6px 14px #2f3750',
        'neu-out-sm': '4px 4px 10px #11141c, -4px -4px 10px #2f3750',
        'neu-in': 'inset 4px 4px 10px #11141c, inset -4px -4px 10px #2f3750',
        'neu-in-sm': 'inset 2px 2px 6px #11141c, inset -2px -2px 6px #2f3750',
      },
    },
  },
  plugins: [],
}
