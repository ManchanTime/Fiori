/*global QUnit*/

sap.ui.define([
	"sync6cl1/chart_flight/controller/ChartView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ChartView Controller");

	QUnit.test("I should test the ChartView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
