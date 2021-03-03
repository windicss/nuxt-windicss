<h1 align='center'>nuxt-windicss-module</h1>

<p align='center'><a href="https://github.com/voorjaar/windicss">Windi CSS</a> for Nuxt.js, it's fast! ⚡️<br>
<sup><em>a.k.a On-demand Tailwind CSS</em></sup>
</p>

<p align='center'>
<a href='https://www.npmjs.com/package/windicss-webpack-plugin'>
<img src='https://img.shields.io/npm/v/windicss-webpack-plugin?color=0EA5E9&label='>
</a>
</p>

<p align='center'>
<a href='https://twitter.com/antfu7/status/1361398324587163648'>⚡️ See speed comparison with Tailwind</a>
</p>

## Features

- ⚡️ **It's FAST** - 20~100x times faster than Tailwind on Vite
- 🧩 On-demand CSS utilities (Compatible with Tailwind CSS v2)
- 📦 On-demand native elements style reseting
- 🔥 Hot module replacement (HMR)
- 🍃 Load configurations from `tailwind.config.js`
- 🤝 Framework-agnostic - Vue, React, Svelte and vanilla!
- 📄 CSS `@apply` / `@screen` directives transforms (also works for Vue SFC's `<style>`)
- 🎳 Support Utility Groups - e.g. `bg-gray-200 hover:(bg-gray-100 text-red-300)`

## Install

```bash
yarn add nuxt-windicss-module -D 
# npm inuxt-windicss-module -D
```

## Usage

Within your `nuxt.config.js` add the following.

```js
// nuxt.config.js
buildModules: [
  'nuxt-windicss-module',
],
```

This module won't work with @nuxt/tailwind, you will need to remove this module.

```javascript
buildModules: [
-  'nuxt-windicss-module',
],
```


## Migration from Tailwind CSS

If you are already using Tailwind CSS for your app, you can follow these instructions to migrate your installation.

### `package.json`

Some of your dependencies are no longer required, you can remove them if they were only needed for Tailwind CSS.

```diff
- "tailwindcss": "*",
- "postcss": "*",
- "autoprefixer": "*",
```

### `tailwind.config.js`

All `variants` are enabled, since the overhead they caused is fixed by Windi's on-demand nature. `purge` is no longer needed as well. `colors` and `plugins` imports need to be renamed to `windicss` instead.

```diff
-const colors = require('tailwindcss/colors')
+const colors = require('windicss/colors')
-const typography = require('@tailwindcss/typography')
+const typography = require('windicss/plugin/typography')

module.exports = {
- purge: {
-   content: [
-     './**/*.html',
-   ],
-   options: {
-     safelist: ['prose', 'prose-sm', 'm-auto'],
-   },
- },
- variants: {
-   extend: {
-     cursor: ['disabled'],
-   }
- },
  darkMode: 'class',
  plugins: [typography],
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
      },
    }
  },
}
```

### `main.css`

You can now remove the Tailwind imports from your css entry.

```diff
- @import 'tailwindcss/base';
- @import 'tailwindcss/components';
- @import 'tailwindcss/utilities';
```

### Cleanup (optional)

The following files can be removed if you don't use their other features.

```diff
- postcss.config.js
```

### All set.

That's all, fire up your app and enjoy the speed!

## TypeScript

You can use TypeScript for your config file if you're using esbuild.

Simply rename your config it to `tailwind.config.ts`.

```ts
// tailwind.config.ts
import { defineConfig } from 'windicss-webpack-plugin'

export default defineConfig({
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        teal: {
          100: '#096',
        },
      },
    },
  },
})
```

## Configuration

See [options.ts](https://github.com/windicss/windicss-webpack-plugin/blob/main/packages/plugin-utils/src/options.ts) for configuration reference.


## Caveats

### Scoped Style

You will need to set `transformCSS: 'pre'` to get it work.

`@media` directive with scoped style can **only works** with `css` `postcss` `scss` but not `sass`, `less` nor `stylus`

## Credits

- Windy team
- [@antfu](https://github.com/antfu) Based on his Rollup / Vite implementation & his util package


## License

MIT License © 2021 [Harlan Wilton](https://github.com/loonpwn)

