/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zc102_sd_rorder/zc102_sd_rorder/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
