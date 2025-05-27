/*global QUnit*/

sap.ui.define([
	"test_deploy/test_deploy/controller/TestDeploy.controller"
], function (Controller) {
	"use strict";

	QUnit.module("TestDeploy Controller");

	QUnit.test("I should test the TestDeploy controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
