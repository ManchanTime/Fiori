sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("testdeploy.testdeploy.controller.TestDeploy", {
        onInit() {
            console.log("display screen_v7");
                        const oModel = this.getOwnerComponent().getModel(); // 기본 ODataModel
            const sPath = "/CusTradeSet"; // 전체 조회

            oModel.read(sPath, {
                success: function (oData) {
                    console.log("✅ 전체 CusTradeSet 조회 성공:", oData);
                    console.log(sPath);
                },
                error: function (oError) {
                    console.error("❌ CusTradeSet 조회 실패:", oError);
                }
            });
        }
    });
});