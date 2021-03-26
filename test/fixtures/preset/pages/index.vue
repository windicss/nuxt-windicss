<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="text-6xl text-green-700 underline">
        preset
        <svg-logo />
        <img :src="require('../image/small.svg?data')" class="bg-red-400">
        <img :src="require('../image/small.svg')" class="bg-green-500">
        <div class="bg-red-600 rounded-full inline-block" v-html="require('../image/small.svg?raw')" />
      </h1>
      <nuxt-link to="/pug" class="block underline">
        Pug
      </nuxt-link>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import SvgLogo from '../image/small.svg?inline'

export default {
  components: {
    SvgLogo,
  },
}
</script>

<style scoped lang="scss">
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto bg-red-100;
}
</style>
