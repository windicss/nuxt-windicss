export default defineNuxtConfig({
  // extends: ['../nuxt-theme'],
  css: [
    '@/css/main.css',
  ],
  components: true,
  windicss: {
    analyze: true,
  },
  modules: [
    'nuxt-windicss',
    '@nuxt/content',
  ],
  content: {
    navigation: {
      fields: ['navTitle'],
    },
    highlight: {
      // See the available themes on https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-theme
      theme: 'dracula',
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
      ],

    },
  },
})
