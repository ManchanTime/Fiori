/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sync6cl1/document_edit/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
