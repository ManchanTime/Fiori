/*global QUnit*/

sap.ui.define([
	"sync6cl1/flight_schedule/controller/ScheduleView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ScheduleView Controller");

	QUnit.test("I should test the ScheduleView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
