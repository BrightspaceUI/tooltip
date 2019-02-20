# d2l-tooltip

[Polymer](https://www.polymer-project.org)-based web component for D2L tooltips.

## Usage

Include the [webcomponents.js](http://webcomponents.org/polyfills/) "lite" polyfill (for browsers who don't natively support web components), then import `d2l-tooltip.html`:

```html
<head>
	<script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
	<link rel="import" href="../d2l-tooltip/d2l-tooltip.html">
</head>
```

<!---
```
<custom-element-demo>
	<template>
		<script src="../webcomponentsjs/webcomponents-lite.js"></script>
		<link rel="import" href="../d2l-typography/d2l-typography.html">
		<link rel="import" href="d2l-tooltip.html">
    	<custom-style include="d2l-typography">
	    	<style is="custom-style" include="d2l-typography">
			</style>
    	</custom-style>
    	<style>
			html {
				padding: 50px;
				font-family: 'Lato', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
				font-size: 20px;
			}
			.box {
				width: 100px;
				height: 100px;
				background-color: #e57231;
				display: inline-block;
				color: White;
				display: flex;
				align-items: center;
				text-align: center;
			}
		</style>
    	<next-code-block></next-code-block>
	</template>
</custom-element-demo>
```
-->
```html
<span class="box" id="target">Hover me</span>
<d2l-tooltip for="target">Hello world!</d2l-tooltip>
```

Use the `postition` attribute to place the tooltip to the top, bottom, left, or right of your target element:
<!---
```
<custom-element-demo>
	<template>
		<script src="../webcomponentsjs/webcomponents-lite.js"></script>
		<link rel="import" href="../d2l-typography/d2l-typography.html">
		<link rel="import" href="d2l-tooltip.html">
    	<custom-style include="d2l-typography">
	    	<style is="custom-style" include="d2l-typography">
			</style>
    	</custom-style>
    	<style>
			html {
				padding: 50px;
				font-family: 'Lato', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
				font-size: 20px;
			}
			.box {
				width: 100px;
				height: 100px;
				background-color: #e57231;
				display: inline-block;
				color: White;
				display: flex;
				align-items: center;
				text-align: center;
			}
		</style>
    	<next-code-block></next-code-block>
	</template>
</custom-element-demo>
```
-->
```html
<span class="box" id="target">Hover me</span>
<d2l-tooltip for="target" position="right">Hello world!</d2l-tooltip>
```

To constrain your tooltip to a certain area, pass in a `boundary` property containing the pixel amounts you want the tooltip to be restricted to. Currently only the left and right boundary properties are supported for the top and bottom positions.

```javascript
{ left: 10, right: 200 }
```

Use the `force-show` attribute always display the tooltip, regardless of user interaction:
```html
<span class="box" id="target">My tooltip is always visible</span>
<d2l-tooltip for="target" position="right" force-show>Hello world!</d2l-tooltip>
```

Custom CSS properties for styling:

- All three properties should be set to style the box correctly:
  - `--d2l-tooltip-background-color` - the color of the tooltip box
  - `--d2l-tooltip-border` - (e.g., `1px solid;`)
  - `--d2l-tooltip-border-color` - border color
- `--d2l-tooltip-mixin` - styles on the content within the tooltip

<!---
```
<custom-element-demo>
	<template>
		<script src="../webcomponentsjs/webcomponents-lite.js"></script>
		<link rel="import" href="../d2l-typography/d2l-typography.html">
		<link rel="import" href="d2l-tooltip.html">
    	<custom-style include="d2l-typography">
	    	<style is="custom-style" include="d2l-typography">
				.mixin-tooltip {
					--d2l-tooltip-background-color: #ffffff;
					--d2l-tooltip-border: 1px solid;
					--d2l-tooltip-border-color:  #d3d9e3;

					--d2l-tooltip-mixin: {
						width: 200px;
						box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
						font-family: Lato;
						color: #565a5c;
					}
				}
			</style>
    	</custom-style>
    	<style>
			html {
				padding: 50px;
				font-family: 'Lato', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
				font-size: 20px;
			}
			.box {
				width: 100px;
				height: 100px;
				background-color: #e57231;
				display: inline-block;
				color: White;
				display: flex;
				align-items: center;
				text-align: center;
			}
		</style>
    	<next-code-block></next-code-block>
	</template>
</custom-element-demo>
```
-->
```html
<span class="box" id="target">Hover me</span>
<d2l-tooltip for="target" position="right" class="mixin-tooltip">Hello world!</d2l-tooltip>
```

```javascript
// triggered when tooltip shown
tooltip.addEventListener('d2l-tooltip-show', () => { ... });

// triggered when tooltip hidden
tooltip.addEventListener('d2l-tooltip-hide', () => { ... });
```

_**NOTE:**_ Issues can arise when associating a `<d2l-tooltip>` with another web-component in a true [Shadow DOM][ShadowDOM] environment. One known example is when a focusable custom component has an associated tooltip; a screen reader may not read the tooltip when focused. This is due to the complexity with [how focus is handled inside the Shadow DOM][ShadowFocus] as well as ID scoping.

## Demo

To run the demo run `npm install`, `polymer serve`.

### Galen

The [Galen][Galen] tests check layout and look of the tooltip. The results of the tests can be found in *reports/d2l-tooltip/report.html*

To update the screenshots, run `npm run dump`. The screenshots will be placed under *dumps/d2l-tooltip/objects*

* run the tests with `npm run test:galen:local`
* [galen.config](galen.config) can be used to change the browser that is being tested. See the [config documentation][GalenConfig]
* [tooltip.gspec](tooltip.gspec) contains the actual assertions. Documentation can be found [here][GalenSpec]

**Note for Windows users:** If you experience an error executing chromedriver (`CreateProcess error=193, %1 is not a valid Win32 application`) you can work around this by deleting the file `node_modules/.bin/chromedriver`. Once removed, Galen will then use the `chromedriver.cmd` file which should work correctly.

[ShadowDOM]: https://www.polymer-project.org/2.0/docs/devguide/shadow-dom
[ShadowFocus]: https://medium.com/dev-channel/focus-inside-shadow-dom-78e8a575b73
[Galen]: http://galenframework.com/
[GalenConfig]: http://galenframework.com/docs/getting-started-configuration/
[GalenSpec]: http://galenframework.com/docs/reference-galen-spec-language-guide/
