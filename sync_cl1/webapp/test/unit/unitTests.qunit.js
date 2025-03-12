/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"synccl1/sync_cl1/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
