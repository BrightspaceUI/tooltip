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

polymerTests(browsers, function(test) {
	var endpoint = 'http://localhost:8080/components/d2l-tooltip/test/acceptance/';

	forAll([['ltr'], ['rtl']], function(dir) {
		forAll([[true], [false]], function(shady) {
			forAll([[true, false]], function(shimCss) {

				var tags = [
					shady ? 'shady' : 'shadow',
					dir
				];

				var dom = '';
				if (shady) {
					dom = '&wc-shadydom';
				}

				var css = '';
				if (shimCss && shady) {
					css = '&wc-shimcssproperties';
					tags.push('shim-css');
				}

				test('d2l-tooltip-notshown', {
					endpoint: endpoint + 'bottom.html?dir=' + dir + dom + css,
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
						endpoint: endpoint + position + '.html?dir=' + dir + dom + css,
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
					endpoint: endpoint + 'bottom.html?dir=' + dir + dom + css,
					spec: 'test/acceptance/tooltip.gspec',
					tags: tags.concat(['no-tap-toggle'])
				}, function(opts, cb) {
					var indexPage = new TooltipPage(opts.driver);
					indexPage.elem.click();
					indexPage.elem.waitToBeShown('1s');
					cb();
				});

				test('d2l-tooltip-tap-toggle', {
					endpoint: endpoint + 'tap-toggle.html?dir=' + dir + dom + css,
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
