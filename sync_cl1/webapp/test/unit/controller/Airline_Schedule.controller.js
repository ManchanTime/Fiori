/*global QUnit*/

sap.ui.define([
	"synccl1/sync_cl1/controller/Airline_Schedule.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Airline_Schedule Controller");

	QUnit.test("I should test the Airline_Schedule controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
