sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("sync6.cl1.routetest.controller.SecondView", {
        onInit() {
        },

        onFirst() {

            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteFirstView");
        }
    });
});