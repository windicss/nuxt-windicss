<template>
  <div class="h-full">
    <h1 data-testid="title" class="text-2xl font-bold text-center py-5 text-green-50">
      Nuxt WindiCSS Module
      <span>test</span>
    </h1>
    <div class="text-center my-10">
      <nuxt-link to="/page2" class=" text-red-900 mx-auto text-sm font-bold p-5 inline rounded-full mb-5 bg-purple-100 transition hover:(bg-purple-800 text-red-100)">
        Test link
      </nuxt-link>
    </div>
    <div class="test-apply">
      test apply
    </div>
    <img data-testid="smallImg" src="/image/small.svg" alt="small svg" class="w-20 absolute left-1/2 top-45 z-20">
    <img data-testid="bigImg" src="/image/big.jpg" alt="big jpg" class="filter grayscale blur-sm w-120 h-120 transform transition-transform rounded-full mx-auto hover:(rotate-45)">
    <div class="prose prose-xl mx-auto py-10">
      <h3>Prose test</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias amet cupiditate distinctio eveniet, illum inventore ipsum itaque molestiae molestias neque nobis porro quam quo recusandae reiciendis rerum saepe totam ut!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur debitis, excepturi fugiat id, illo inventore iure nam, nulla quae quaerat quisquam repellendus voluptates. Asperiores ducimus explicabo molestiae natus, nulla vitae.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur dicta eos et eum eveniet exercitationem in iste itaque nam necessitatibus nemo porro, quam quo soluta ullam velit voluptatibus. Tempore, vitae!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto dicta mollitia reiciendis soluta! A aliquam aliquid aperiam, assumenda, culpa esse, facilis iste maxime nam non provident sint? Ad, debitis soluta.</p>
    </div>
    <div class="flex items-center flex-col">
      <div class="scss-global">
        <h2>SCSS global</h2>
      </div>
      <button
        bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
        text="sm white"
        font="mono light"
        p="y-2 x-4"
        border="2 rounded blue-200"
      >
        Button
      </button>
      <PostcssScoped />
      <ScssScoped />
      <SassScoped />
      <StylusScoped />
      <LessScoped />
      <CssScoped />
    </div>
  </div>
</template>

<style lang="scss">
h1 {
  @apply bg-blue-800;
  span {
    @apply text-green-400;
  }
}
</style>
