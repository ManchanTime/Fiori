/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sync6cl1/sync6_cl1/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
