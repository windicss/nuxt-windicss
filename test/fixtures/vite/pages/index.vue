<template>
  <div class="bg-red-200 h-full">
    <h1 data-testid="title" class="text-2xl font-bold text-center py-5 text-green-800">
      Hello Vite
    </h1>
    <div class="text-center">
      <nuxt-link to="/page2" class="underline text-red-900 mx-auto pb-5 block">
        Test link
      </nuxt-link>
    </div>
    <img data-testid="smallImg" :src="require('../image/small.svg')" alt="small svg" class="w-20 absolute left-1/2 top-45 z-20">
    <img data-testid="bigImg" :src="require('../image/big.jpg')" alt="big jpg" class="w-120 h-120 transform transition-transform rounded-full mx-auto hover:(rotate-45)">
  </div>
</template>
