/*global QUnit*/

sap.ui.define([
	"cl1test16/cl1.test16/controller/test16.controller"
], function (Controller) {
	"use strict";

	QUnit.module("test16 Controller");

	QUnit.test("I should test the test16 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
