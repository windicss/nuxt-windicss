<template>
  <div class="sass">
    <h2>SASS scoped</h2>
    orange-400 -> orange-900
  </div>
</template>
<style lang="sass" scoped>
.sass
  @apply bg-orange-400 text-white p-4 w-1/4 transition hover:(bg-orange-900 text-orange-100)
  h2
    @apply font-bold text-sm
</style>
