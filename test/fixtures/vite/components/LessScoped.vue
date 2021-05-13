<template>
  <div class="less">
    <h2>LESS scoped</h2>
    purple-400 -> purple-900
  </div>
</template>
<style lang="less" scoped>
.less {
  @apply " bg-purple-400 text-white p-4 w-1/4 transition hover:(bg-purple-900 text-purple-100)";
  h2 {
    @apply font-bold text-sm;
  }
}
</style>
