/*global QUnit*/

sap.ui.define([
	"sync6cl1/ui_table/controller/AirView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("AirView Controller");

	QUnit.test("I should test the AirView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
