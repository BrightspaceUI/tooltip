/* global GalenPages, forAll, polymerTests, LocalBrowserFactory, SauceBrowserFactory */
/* eslint no-invalid-this: 0 */
'use strict';

var browsers = {
	chrome: new LocalBrowserFactory({ browser: 'chrome', size: '768x768' }),
	chromeWindows: new SauceBrowserFactory({
		browser: 'Chrome',
		platform: 'WIN10',
		size: '1400x900'
	}),
	/* IE and Edge do not seem to time the screencaptures correctly with the hover and fail, so skipping them */
	// ie11Windows: new SauceBrowserFactory({
	//	 browser: 'internet explorer',
	//	 version: '11',
	//	 platform: 'WIN10',
	//	 size: '1400x900'
	// }),
	// edgeWindows: new SauceBrowserFactory({
	//	 browser: 'microsoftedge',
	//	 platform: 'WIN10',
	//	 size: '1400x900',
	//	 tags: ['no-d2l-shadow']
	// }),
	// REMOVING DUE TO CHROME WEBDRIVER ISSUE
	// chromeMac: new SauceBrowserFactory({
	//	 browser: 'Chrome',
	//	 platform: 'SIERRA',
	//	 size: '1400x900'
	// }),
	/* Safari and Firefox throw mouseMoveTo selenium errors trying to execute the hover, so skipping them */
	// safariMac: new SauceBrowserFactory({
	//	 browser: 'Safari',
	//	 platform: 'EL_CAPITAN',
	//	 size: '1400x900',
	//	 tags: ['no-d2l-shadow']
	// }),
	// firefoxWindows: new SauceBrowserFactory({
	//	 browser: 'firefox',
	//	 platform: 'WIN10',
	//	 size: '1400x900'
	// })
};

var TooltipPage = function(driver) {
	GalenPages.extendPage(this, driver, 'Index Page', {
		elem: 'id: theSpan',
		tooltip: 'id: theTooltip'
	});
};

polymerTests(browsers, function(test, ctx) {
	var configurations = {
		mainline: {
			name: 'mainline',
			endpoint: 'http://localhost:8081/components/d2l-tooltip/test/acceptance/',
			shady: 'wc-shadydom',
			cssShim: 'wc-shimcssproperties'
		},
		xVariant: {
			name: '1.x',
			endpoint: 'http://localhost:8000/components/d2l-tooltip/test/acceptance/',
			shadow: 'dom=shadow',
			cssNative: 'useNativeCSSProperties=true'
		}
	};

	// See https://github.com/webcomponents/shadycss/blob/74577b11f20442594cedf4c5a51152dca06eb67c/src/style-settings.js#L29
	var nativeShadow = ctx.driver.executeScript('return !(window[\'ShadyDOM\'] && window[\'ShadyDOM\'][\'inUse\'])').booleanValue();
	var hasCss = nativeShadow || ctx.driver.executeScript('return Boolean(!navigator.userAgent.match(/AppleWebKit\\/601|Edge\\/15/) && window.CSS && window.CSS.supports("color", "var(--primary)"))').booleanValue();

	forAll(configurations, function(configuration) {
		forAll([['ltr'], ['rtl']], function(dir) {
			forAll([[true], [false]], function(shady) {
				forAll([[true, false]], function(shimCss) {

					var tags = [
						configuration.name,
						shady ? 'shady' : 'shadow',
						dir
					];

					var dom;
					if (shady) {
						dom = configuration.shady ? '&' + configuration.shady : '';
					} else {
						dom = configuration.shadow ? '&' + configuration.shadow : '';
					}

					var css = '';
					if (shimCss) {
						if (shady && configuration.cssShim) {
							css = '&' + configuration.cssShim;
							tags.push('shim-css');
						}
					} else {
						if (hasCss && configuration.cssNative) {
							css = '&' + configuration.cssNative;
							tags.push('native-css');
						}
					}

					test('d2l-tooltip-notshown', {
						endpoint: configuration.endpoint + 'bottom.html?dir=' + dir + dom + css,
						spec: 'test/acceptance/tooltip.gspec',
						tags: tags.concat(['notshown'])
					});

					forAll([
						['bottom'],
						['top'],
						['left'],
						['right'],
						['mixin']
					], function(position) {
						test('d2l-tooltip-' + position, {
							endpoint: configuration.endpoint + position + '.html?dir=' + dir + dom + css,
							spec: 'test/acceptance/tooltip.gspec',
							tags: tags.concat([position])
						}, function(opts, cb) {
							var indexPage = new TooltipPage(opts.driver);
							indexPage.elem.hover();
							indexPage.elem.waitToBeShown('1s');
							cb();
						});
					});

					test('d2l-tooltip-no-tap-toggle', {
						endpoint: configuration.endpoint + 'bottom.html?dir=' + dir + dom + css,
						spec: 'test/acceptance/tooltip.gspec',
						tags: tags.concat(['no-tap-toggle'])
					}, function(opts, cb) {
						var indexPage = new TooltipPage(opts.driver);
						indexPage.elem.click();
						indexPage.elem.waitToBeShown('1s');
						cb();
					});

					test('d2l-tooltip-tap-toggle', {
						endpoint: configuration.endpoint + 'tap-toggle.html?dir=' + dir + dom + css,
						spec: 'test/acceptance/tooltip.gspec',
						tags: tags.concat(['tap-toggle'])
					}, function(opts, cb) {
						var indexPage = new TooltipPage(opts.driver);
						indexPage.elem.click();
						indexPage.elem.waitToBeShown('1s');
						cb();
					});
				});
			});
		});
	});

});
