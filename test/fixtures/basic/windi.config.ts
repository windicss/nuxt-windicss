import { defineConfig } from 'vite-plugin-windicss'
import formsPlugin from 'windicss/plugin/forms'
import typographyPlugin from 'windicss/plugin/typography'
import aspectRatioPlugin from 'windicss/plugin/aspect-ratio'

// @ts-ignore
export default defineConfig({
  theme: {
    fontFamily: {
      sans: ['Pangea', 'sans-serif'],
      serif: ['Pangea', 'serif'],
    },
    // @ts-ignore
    extend: {
      animation: {
        fadeIn: 'fadeIn 200ms ease-in forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
      colors: {
        blue: {
          '50': '#f2f6f9',
          '100': '#e6edf3',
          '200': '#bfd2e1',
          '300': '#99b7ce',
          '400': '#4d81aa',
          '500': '#004b85',
          '600': '#004478',
          '700': '#003864',
          '800': '#002d50',
          '900': '#002541'
        },
      },
    },
  },
  plugins: [
    formsPlugin,
    typographyPlugin,
    aspectRatioPlugin
  ],
})
