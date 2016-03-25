[![Build Status](https://travis-ci.org/donejs/done-component.svg?branch=master)](https://travis-ci.org/stealjs/done-component)
[![npm version](https://badge.fury.io/js/done-component.svg)](http://badge.fury.io/js/done-component)

# done-component

A [StealJS](http://stealjs.com/) plugin for [CanJS](http://canjs.com/) components.  done-component allows you to easily define your component completely from a single `.component` file:

## Install

```
npm install done-component --save
```

## Usage

Define a can.Component in a separate file:

### hello.component

```mustache
<can-component tag="hello-world">
	<style type="text/less">
		i {
			color: red;
		}
	</style>
	<template>
		{{#if visible}}<b>{{message}}</b>{{else}}<i>Click me</i>{{/if}}
	</template>
	<script type="view-model">
		export default {
			visible: true,
			message: "Hello There!"
		};
	</script>
	<script type="events">
		export default {
			click: function(){
				this.viewModel.attr("visible", !this.viewModel.attr("visible"))
			}
		};
	</script>
</can-component>
```

### main.stache

In your template simply import your component and you can start using it:

```mustache
<can-import from="hello-world.component!"/>

<hello-world></hello-world>
```

## API

### tag

The tag name is specified on the `can-component` element. This corresponds to `tag` when defining a Component in JavaScript.

### style

The `<style>` tag lets you include CSS specific to your component. By default it will use the CSS plugin but you can use preprocessors by specifying:

#### type

The style type lets you use an alternative to CSS such as Less:

```html
<style type="text/less">
  span {
    color: red
  }
</style>
```

Not that when using Less your style is automatically wrapped with the Component's tag name, so that it is scoped to only your component.

### template

The `<template>` tag is where you put your Stache template.

### view-model

The `<view-model>` or `<script type="view-model">` is where you put your viewModel. You can use either method, but the `<script>` method is more compatible with your editor.

### events

The `<events>` or `<script type="events">` is where you put your events object.

### helpers

The `<helpers>` or `<script type="helpers">` is where you put Stache helpers.

### from

Each of the subtags (style, template, view-model, events, and helpers) can optionally take a `from=` attribute that allows you to define that in a separate module. It's useful if one part is longer and you want to separate that out into it's own file:

```html
<can-component tag="foo">
  <view-model from="foo/view_model"/>
</can-component>
```

## Exported Object

Your `.component` will export an object that contains properties for `Component` which is the can.Component constructor, `ViewModel` which is a can.Map of your exported ViewModel.  This is useful for when testing:

```js
var QUnit = require("steal-qunit");
var HelloVM = require("hello-world.component!").ViewModel;

QUnit.test("view model works", function(){
  var map = new HelloVM();
  ...
});

```

## License

MIT
