/*global QUnit*/

sap.ui.define([
	"sync6cl1/ui5_component/controller/StudyView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("StudyView Controller");

	QUnit.test("I should test the StudyView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
