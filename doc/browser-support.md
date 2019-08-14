# Browser support

[back](../README.md)

We support the evergreen browsers (Chrome, Firefox, Safari, Edge) and
IE 11.

## JavaScript

The Angular CLI generates a modern build (ES2015) and a legacy build
(ES5) and the browsers will get either one of those two build via
differential loading.

Note that you have to use the `start:es5` task when testing with IE11.

## CSS

To be compatible with IE 11, we use the
[autoprefixer](https://github.com/postcss/autoprefixer), which is part
of the default Angular CLI setup (see `browserlist` file for the
configuration).

There is also an `.ie11` class, that is present on the `<erz-app>`
node in IE 11 browsers. You can use this in your component styles to
implement IE 11 customizations:

```
:host-context(:not(.ie11)) .my-element {
  // CSS for evergreen browsers
}

:host-context(.ie11) .my-element {
 // CSS for IE 11
}
```

### CSS Grid

When using CSS Grid, add the following comment to the concerning block
to enable the autoprefixer's polyfills:

```
.my-grid {
  /* autoprefixer grid: on */
  display: grid;
  ...
}
```

Checkout the following table for the supported features: https://css-tricks.com/css-grid-in-ie-css-grid-and-the-new-autoprefixer/#article-header-id-1
