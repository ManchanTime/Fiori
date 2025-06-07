/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zc102_pp_dispos/zc102_pp_dispos/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
