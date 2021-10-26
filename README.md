![nuxt-windicss](https://repository-images.githubusercontent.com/343991410/68f83b80-811f-11eb-9638-51aed75785c4)

<h1 align='center'>nuxt-windicss</h1>

<p align='center'><a href="https://windicss.org/">Windi CSS</a> for Nuxt.js! ⚡️<br>
<sup><em>Next generation utility-first CSS framework.</em></sup>
</p>

<p align='center'>
<a href='https://www.npmjs.com/package/nuxt-windicss'>
<img src='https://img.shields.io/npm/v/nuxt-windicss?color=0EA5E9&label='>
</a>
<a href='https://github.com/windicss/nuxt-windicss/actions/workflows/test.yml'>
<img src='https://github.com/windicss/nuxt-windicss/actions/workflows/test.yml/badge.svg' >
</a>
</p>


## Features

- 🧩 On-demand CSS utilities (Compatible with Tailwind CSS v2) and native elements style resetting
- 📄 Use [directives](https://windicss.org/features/directives.html) in any CSS (SCSS, LESS, etc) `@apply`, `@variants`, `@screen`, `@layer`, `theme()`, 
- 🎳 Support Utility Groups - e.g. `bg-gray-200 hover:(bg-gray-100 text-red-300)`
- 🧑‍🤝‍🧑 Plays nicely with Nuxt v3, Nuxt v2, [@nuxt/vite](https://github.com/nuxt/vite) and [@nuxt/content](https://content.nuxtjs.org/)
- 🔎 Integrated with [windicss-analysis](https://github.com/windicss/windicss-analysis)

## Install

```bash
yarn add nuxt-windicss -D
# npm i nuxt-windicss -D
```


## Usage

Within your `nuxt.config.js` add the following.

```js
// nuxt.config.js
export default {
  buildModules: [
    'nuxt-windicss',
  ],
}
```

### Nuxt 3

```js
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: [
    'nuxt-windicss',
  ],
})
```

### Typescript

For Nuxt config typescript support, add the module within your `tsconfig.json`.

```json

{
  "compilerOptions": {
    "types": [
      "nuxt-windicss"
    ]
  }
}
```

### Windi Analyzer 

> An analyser tool for [Windi CSS](https://github.com/windicss/windicss). Browse your utilities usages, have an overview of your design system, identify "bad practices", and more!

![](https://user-images.githubusercontent.com/11247099/113150805-0c43f880-9267-11eb-85a6-ec1a2f1eed37.png)

You can enable Windi Analzyer using the Nuxt config. The analyser is only available in development mode.

```js
export default defineNuxtConfig({
  buildModules: [
    'nuxt-windicss',
  ],
  windicss: {
    analyze: true
  }
})
```

Alternatively you can provide an object to control the analysis or the server.

```js
windicss: {
  analyze: {
    analysis: {
      interpretUtilities: false,
    }
    // see https://github.com/unjs/listhen#options
    server: {
      port: 4444,
      open: true,
    }
  }
}
```

### Migrating from tailwind

This module won't work with `@nuxtjs/tailwindcss`, you will need to remove it.

```diff
buildModules: [
-  '@nuxtjs/tailwindcss',
],
```

If you have a `tailwind.config.js`, please rename it to `windi.config.js` or `windi.config.ts`.

Follow the [migration guide](https://windicss.org/guide/migration.html) for other change details.


### Ordering (optional)

By default, this all windi layers will be automatically imported for you.

If you'd like to change the layout ordering you can include the layers in any order you like. 

For example, if you had a `main.css` which had `h1 { margin-bottom: 30px; }`, you might do something like this:

```js
// nuxt.config.js
export default {
  // ...
  css: [
    // windi preflight
    'virtual:windi-base.css',
    // your stylesheets which overrides the preflight
    '@/css/main.css', 
    // windi extras
    'virtual:windi-components.css',
    'virtual:windi-utilities.css',
  ],
}
```


## Documentation

Read the [documentation](https://windicss.org/integrations/nuxt.html) for more details.

## Credits

- Windy team
- [@antfu](https://github.com/antfu) Based on his Rollup / Vite implementation & his util package


## License

MIT License © 2021 [Harlan Wilton](https://github.com/harlan-zw)

