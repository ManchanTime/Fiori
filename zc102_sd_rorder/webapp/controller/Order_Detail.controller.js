sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History"
], function (Controller, History) {
  "use strict";

  return Controller.extend("zc102sdrorder.zc102sdrorder.controller.Order_Detail", {

    onInit: function () {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("RouteOrderDetail").attachPatternMatched(this._onObjectMatched, this);
    },

    _onObjectMatched: function (oEvent) {
      const sVbelnSo = oEvent.getParameter("arguments").vbelnSo;
      const sCusno   = oEvent.getParameter("arguments").cusno;
      const sPartner = oEvent.getParameter("arguments").partner;

      const sPath = `/OrderSet(VbelnSo='${sVbelnSo}',Cusno='${sCusno}',Partner='${sPartner}')`;
    

      this.getView().bindElement({
        path: sPath,
        events: {
          change: function () {
          },
          dataRequested: function () {
          },
          dataReceived: function (oEvent) {
          }
        }
      });
    },

    onNavBack: function () {
      const oHistory = History.getInstance();
      const sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteMainView", {}, true);
      }
    }
  });
});
