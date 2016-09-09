# Metalsmith ServerComponents

A [Metalsmith](https://github.com/metalsmith/metalsmith) plugin for lightweight server-side custom HTML elements.

This plugins enables the usage of custom HTML elements – broadly following the [spec](http://w3c.github.io/webcomponents/spec/custom/) – in Metalsmith projects.

## Installation

Install in your metalsmith project using:

```
npm install metalsmith-permalinks
````

## Usage


To use it, add a custom components defined with the [ServerComponents-API](https://github.com/pimterry/server-components#api-documentation) to your projects `components` folder.

```
// File: components/hello-world.js
module.exports = function(components) {
	var StaticElement = components.newElement();
	StaticElement.createdCallback = function () {
		this.innerHTML = "Hello world";
	};
	components.registerElement("hello-world", { prototype: StaticElement });
};
```

In your Metalsmith build script add the ServerComponents plugin.

```
// File: build.js
var Metalsmith = require('metalsmith');
var components = require('metalsmith-servercomponents');

Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .clean(false)
  .use(components())
  .build(function(err, files) {
    if (err) { throw err; }
  });
```

Every occurence of the custom components you defined in your source files will be replaced by an instantiated entity.

```
<!-- File src/index.html -->
<!doctype html>
<html lang=en>
<head>
	<meta charset=utf-8>
	<title>Foobar</title>
</head>
<body>
	<hello-world />
</body>
</html>
```

…is converted to…

```
<!-- File src/index.html -->
<!doctype html>
<html lang=en>
<head>
	<meta charset=utf-8>
	<title>Foobar</title>
</head>
<body>
	<hello-world>Hello world</hello-world>
</body>
</html>
```

You can use the whole custom component API to define components, refer to the [example components](https://github.com/pimterry/server-components/blob/master/component-examples.md) to see what is possible.

## To Do

* Handle styles per component: from unnamespaced, plain (S)CSS to automatically namespaced BEM selectors
* Handle clientside JS per component
