/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cl1test16/cl1.test16/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
