<template>
<div class="container">
  <div class="prose prose-xl">
    <nuxt-content :document="article" />
  </div>
</div>
</template>

<script>
export default {
  async asyncData ({ error,$content }) {
    try {
      const article = await $content('slowly-yeni-koye-eski-adet').fetch()
      return {
        article
      }
    } catch {
      error({ statusCode: 404, message: 'Article not found.' })
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="scss">
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto bg-red-100;
}
</style>
