<template>
  <div class="css">
    <h2>CSS scoped</h2>
    yellow-400 -> yellow-900
  </div>
</template>
<style lang="css" scoped>
.css {
  @apply bg-yellow-400 text-white p-4 w-1/4 transition hover:(bg-yellow-900 text-yellow-100);
}
h2 {
  @apply font-bold text-sm;
}
</style>
