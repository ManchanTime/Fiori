
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], (Controller, MessageToast, JSONModel) => {
    "use strict";

    return Controller.extend("sync6.cl1.ui5component.controller.StudyView", {
        onInit() {

            let oData = {

                BtnText: "Confirm",
                BtnWidth: "150px",
                BtnIcon: "sap-icon://flight"

            };

            let oModel1 = new JSONModel(oData);
            let OMedel2 = new JSONModel("/json/data.json");
            this.getView().setModel(oModel1, "button");
            this.getView().setModel(OMedel2, "data");

        }
    });
});