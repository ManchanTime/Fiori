/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cl1test2/cl1.test2/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
