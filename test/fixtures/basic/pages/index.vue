<template>
  <div>
    <h1 data-testid="title">
      Hello World
    </h1>
    <img data-testid="smallImg" :src="require('../image/small.svg')" alt="small svg">
    <img data-testid="bigImg" :src="require('../image/big.jpg')" alt="big jpg">
  </div>
</template>
