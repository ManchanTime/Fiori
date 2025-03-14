/*global QUnit*/

sap.ui.define([
	"sync6cl1/flight_16/controller/FlightView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("FlightView Controller");

	QUnit.test("I should test the FlightView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
