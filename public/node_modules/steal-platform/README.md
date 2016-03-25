# steal-platform

Detects common platforms. Use when special logic is needed (such as needing to specify a full URL for Ajax requests when using Cordova.

## Install

```shell
npm install steal-platform --save
```

## Use

```js
var platform = require("steal-platform");

if(platform.isDesktopBrowser) {
 ...
}
```

## License

MIT
