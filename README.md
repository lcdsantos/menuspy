# MenuSpy

A JavaScript library to make navigation menus highlight the item based on currently in view section.

* No dependencies
* Easy to use
* Lightweight and fast

## Usage

Include MenuSpy

```html
<script src="menuspy.js"></script>
```

`MenuSpy` will be available in the global scope.

Or install via NPM/Yarn and require as a module

NPM

```
npm install menuspy
```

Yarn

```
yarn add menuspy
```

```js
var MenuSpy = require('menuspy');
```

Initialize the plugin on your menu element

```html
<header id="main-header">
  <nav>
    <ul>
      <li><a href="#features">Features</a></li>
      <li><a href="#usage">Usage</a></li>
      <li><a href="#options">Options</a></li>
      <li><a href="#examples">Examples</a></li>
    </ul>
  </nav>
</header>
```

You can also use `data-target` on the anchor element with a selector. Example:

```html
<a href="#anything" data-target="selector">Anything</a>
```

```js
var elm = document.querySelector('#main-header');
var ms = new MenuSpy(elm);
```

The `MenuSpy()` constructor accepts two arguments: the container element and an options object.


## Options

| Option               | Type     | Default                    | Description                                                              |
| ---------------------| -------- | -------------------------- | ------------------------------------------------------------------------ |
| `menuItemSelector`   | String   | `a[href^="#"]`             | Menu items selector.                                                     |
| `activeClass`        | String   | `active`                   | Class applied on menu item relative to the currently visible section.    |
| `threshold`          | Integer  | `15`                       | Ammount of space between your menu and the next section to be activated. |
| `enableLocationHash` | Boolean  | `true`                     | Enable or disable browser's hash location change.                        |
| `hashTimeout`        | Integer  | `600`                      | Timeout to apply browser's hash location.                                |
| `callback`           | Function | `function(currentItem) {}` | A function to be called every time a new menu item activates.            |
