<template>
  <div>
    <b-nav>
      <b-nav-item active>
        Active
      </b-nav-item>
      <b-nav-item>Link</b-nav-item>
      <b-nav-item>Another Link</b-nav-item>
      <b-nav-item disabled>
        Disabled
      </b-nav-item>
    </b-nav>
    <div class="container text-2xl">
      <h1 data-testid="hello" class="bg-green-700 font-bold text-white px-5 py-5">
        Hello World
      </h1>
      <article class="prose prose-blue lg:prose-xl mt-10">
        <h1>Garlic with cheese: What the science tells us</h1>
        <p>
          For years parents have espoused the health benefits of eating garlic bread with cheese to their
          children, with the food earning such an iconic status in our culture that kids will often dress
          up as warm, cheesy loaf for Halloween.
        </p>
        <p>
          But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
          springing up around the country.
        </p>
        <!-- ... -->
      </article>
    </div>
  </div>
</template>
