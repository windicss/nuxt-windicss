![nuxt-windicss](https://repository-images.githubusercontent.com/343991410/68f83b80-811f-11eb-9638-51aed75785c4)

<h1 align='center'>nuxt-windicss</h1>

<p align='center'><a href="https://github.com/windicss/windicss">Windi CSS</a> for Nuxt.js, it's fast! ⚡️<br>
<sup><em>a.k.a On-demand Tailwind CSS</em></sup>
</p>

<p align='center'>
<a href='https://www.npmjs.com/package/nuxt-windicss'>
<img src='https://img.shields.io/npm/v/nuxt-windicss?color=0EA5E9&label='>
<img src='https://github.com/windicss/nuxt-windicss-module/actions/workflows/test.yml/badge.svg' >
</a>
</p>

<p align='center'>
<a href='https://twitter.com/antfu7/status/1361398324587163648'>⚡️ See speed comparison with Tailwind</a>
</p>

## Features

- ⚡️ **It's FAST** - 20~100x times faster than [@nuxtjs/tailwindcss](https://github.com/nuxt-community/tailwindcss-module)
- 🧩 On-demand CSS utilities (Compatible with Tailwind CSS v2) and native elements style resetting
- 🍃 Load configurations from `tailwind.config.js`
- 📄 Use `@apply` / `@screen` directives in any file: Vue SFC, Less, SCSS, SASS, PostCSS, Stylus
- 🎳 Support Utility Groups - e.g. `bg-gray-200 hover:(bg-gray-100 text-red-300)`
- 🧑‍🤝‍🧑 Compatible with [nuxt-vite](https://github.com/nuxt/vite)

## Install

```bash
yarn add nuxt-windicss -D
# npm i nuxt-windicss -D
```

## Usage

Within your `nuxt.config.js` add the following.

```js
// nuxt.config.js
buildModules: [
  'nuxt-windicss',
],
```

This module won't work with `@nuxtjs/tailwindcss`, you will need to remove it.

```diff
buildModules: [
-  '@nuxtjs/tailwindcss',
],
```

If you have a `tailwind.config.js`, please rename it to `windi.config.js` or `windi.config.ts`.

See [here](https://windicss.netlify.app/guide/configuration.html) for configuration details.


## Migrating

If you were previously using `@nuxtjs/tailwindcss`, please consult the [documentation](https://windicss.netlify.app/guide/migration.html) on migrating.

## Configuration

- Default:
```js
export default {
  // ...
  windicss: {
    scan: {
      dirs: ['./'],
      exclude: [
        'node_modules',
        '.git',
        '.github',
        '.nuxt/**/*'
      ],
    },
    preflight: {
      alias: {
        // add nuxt aliases
        'nuxt-link': 'a',
        // @nuxt/image module
        'nuxt-img': 'img',
      },
    },
  }
}
```  

- See [options.ts](https://github.com/windicss/vite-plugin-windicss/blob/main/packages/plugin-utils/src/options.ts) for configuration reference.

### Examples

#### Disable Preflight

_nuxt.config.js_
```js
export default {
  // ...
  windicss: {
    preflight: false
  },
}  
```

#### Scan classes from a node_modules package

Out-of-the-box this module ignores any files in node_modules, this is to simplify
the scanning for the majority for users.

To opt-in to this scanning you will need to setup the scan options yourself.

_nuxt.config.js_
````js
export default {
  // ...
  hooks: {
    windicss: {
      options(options) {
        options.scanOptions.exclude = [ '.git', '.github', '.nuxt/**/*' ]
        options.scanOptions.dirs = [
          './node_modules/vue-tailwind-color-picker/src',
          './components',
          './pages',
          './layouts',
        ]
        return options
      }
    }
  }
}
````

## Hooks

You can use the following nuxt hooks to modify the behaviour of the code.

`windicss:config`
- Arguments: FullConfig

Modify the Windi CSS configuration before it is passed to the webpack plugin.

Useful for making runtime style changes.

`windicss:options`
- Arguments: options

Modify the Windi CSS options before they are passed to the webpack plugin. 

Useful for adding runtime directories to the scan path.

## Credits

- Windy team
- [@antfu](https://github.com/antfu) Based on his Rollup / Vite implementation & his util package


## License

MIT License © 2021 [Harlan Wilton](https://github.com/harlan-zw)

