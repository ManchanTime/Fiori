/*global QUnit*/

sap.ui.define([
	"sync6cl1/payment_chart/controller/ChatView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ChatView Controller");

	QUnit.test("I should test the ChatView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
