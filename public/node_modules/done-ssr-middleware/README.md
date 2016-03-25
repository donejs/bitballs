[![Build Status](https://travis-ci.org/donejs/done-ssr-middleware.svg?branch=master)](https://travis-ci.org/donejs/done-ssr-middleware)
[![npm version](https://badge.fury.io/js/done-ssr-middleware.svg)](http://badge.fury.io/js/done-ssr-middleware)


# done-ssr-middleware

Simple Express/Connect middleware for server-side rendering your DoneJS application.

## Install

```
npm install done-ssr-middleware
```

## Usage

Use the middleware to add server-side rendering to an existing Express server:

```js
var ssr = require('done-ssr-middleware');

app.use('/', ssr({
  config: __dirname + '/public/package.json!npm'
}));
```

The middleware includes a live-reload utility that can automatically refresh the cache for server-rendered responses. Use the `liveReload` option to enable this feature:

```js
app.use('/', ssr({
  config: __dirname + '/public/package.json!npm',
  liveReload: true
}));
```

__Note:__ Make sure the ssr middleware is the last middleware in the chain but before the error handler. Errors when rendering the application will be passed to your Express error handler. Error status codes (e.g. 404s or others) will be rendered with the application.


## License

MIT
