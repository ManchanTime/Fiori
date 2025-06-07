/*global QUnit*/

sap.ui.define([
	"zc102_pp_dispos/zc102_pp_dispos/controller/zc102_pp_dispos.controller"
], function (Controller) {
	"use strict";

	QUnit.module("zc102_pp_dispos Controller");

	QUnit.test("I should test the zc102_pp_dispos controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
