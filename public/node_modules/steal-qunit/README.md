# steal-qunit

This provides a bower installable QUnit that fires off all tests 
when the app has finished loading.

## Install

From NPM:

```shell
npm install steal-qunit --save-dev
```

From Bower:

```shell
bower install steal-qunit --save-dev
```

## Configuration

If you are using the [npm](http://stealjs.com/docs/npm.html) or [bower](http://stealjs.com/docs/bower.html)
plugins no configuration is needed. Otherwise configure the `paths` and `meta` properties:

```js
System.config({
	paths: {
		"steal-qunit/*": "path/to/steal-qunit/*.js",
		"steal-qunit": "path/to/steal-qunit/steal-qunit.js",
		"qunitjs/qunit/*": "path/to/qunit/qunit/*.js",
		"qunitjs/qunit/qunit.css": "path/to/qunit/qunit/qunit.css"
	},
	meta: {
		"qunitjs/qunit/qunit": {
			"format": "global",
			"exports": "QUnit",
			"deps": [
				"steal-qunit/add-dom"
			]
		}
	}
});
```
