/*global QUnit*/

sap.ui.define([
	"sync6cl1/document_edit/controller/DocuView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("DocuView Controller");

	QUnit.test("I should test the DocuView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
