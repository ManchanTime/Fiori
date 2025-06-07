sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("zc102sdrorder.zc102sdrorder.controller.Order_Create", {
    onInit: function () {
    const oModel = new sap.ui.model.json.JSONModel({
      FileData: "",
      FileType: "",
      FileUrl: ""
    });
    this.getView().setModel(oModel, "CreateBPModel");
    },

   onNavBack: function () {
    const oRouter = this.getOwnerComponent().getRouter();
    oRouter.navTo("RouteMainView");
      },

    onCancel: function () {
    const oRouter = this.getOwnerComponent().getRouter();
    oRouter.navTo("RouteMainView");
    },

    onFileChange: function (oEvent) {
    const oFileUploader = oEvent.getSource();
    const aFiles = oEvent.getParameter("files");

    if (aFiles && aFiles.length > 0) {
      const oFile = aFiles[0];
      const sFileName = oFile.name.toLowerCase();
      const reader = new FileReader();

      reader.onload = function (oLoadEvent) {
        const sBase64 = oLoadEvent.target.result;
        const oModel = this.getView().getModel("CreateBPModel");
        const base64 = sBase64.split(",")[1];

        oModel.setProperty("/FileData", base64);
        oModel.setProperty("/ImagePreviewSrc", sBase64);
        oModel.setProperty("/FileType", sFileName.endsWith(".pdf") ? "pdf" : "image");
        oModel.setProperty("/FileUrl", oFile.name);
      }.bind(this);

      reader.readAsDataURL(oFile);
    } else {
      sap.m.MessageToast.show("파일을 선택해 주세요.");
    }
  },

  onSave: function () {
  const oView = this.getView();
  const oModel = oView.getModel(); // OData 모델
  const oRouter = this.getOwnerComponent().getRouter();
  const oModelPartner = oView.getModel("CreateBPModel");
  console.log(oModelPartner);
  // 입력값 수집
  // const oEntry = {
  //   Cusno: oView.byId("inpCusno").getValue(),
  //   Partner: oView.byId("inpPartner").getValue(),
  //   Audat: oView.byId("inpAudat").getDateValue(), // Date 객체 그대로
  //   // Matnr: oView.byId("inpMatnr").getValue(),
  //   Menge: parseFloat(oView.byId("inpMenge").getValue() || "0"),
  //   Waers: oView.byId("inpWaers").getSelectedKey(),
  //   Delid: oView.byId("inpDelid").getDateValue() // Date 객체 그대로
  //   // Contract: parseInt(oView.byId("inContract").getValue() || "0")
  // };

    const sPartnerId = oView.byId("inpPartner").getValue(); // 예: "BP0001"
    const oEntry = {
        Filename: oModelPartner.getProperty("/FileUrl").toLowerCase(),
        Pmimetype: oModelPartner.getProperty("/FileType"),
        Filedata: oModelPartner.getProperty("/FileData").replace(/\s/g, ''), // Base64 또는 Binary로 준비됨
    };

  console.log(oEntry);
  oModel.update(`/BpSet('${sPartnerId}')`, oEntry, {
    method: "PATCH",
    success: function () {
      sap.m.MessageToast.show("파일이 성공적으로 업로드되었습니다.");
    },
    error: function (oError) {
      console.log(oError);
      sap.m.MessageBox.error("파일 업로드 중 오류가 발생했습니다.");
    }
});


  // // 유효성 검증
  // if (!oEntry.Cusno || !oEntry.Partner || !oEntry.Audat) {
  //   sap.m.MessageToast.show("필수 정보를 모두 입력해 주세요.");
  //   return;
  // }

  // Create 요청
  // oModel.create("/OrderSet", oEntry, {
  //   success: function (oData) {
  //     sap.m.MessageToast.show("정기 주문이 성공적으로 생성되었습니다.");
  //     oRouter.navTo("RouteMainView");
  //   },
  //   error: function (oError) {
  //     sap.m.MessageBox.error("주문 생성 중 오류가 발생했습니다.");
  //   }
  // });
},
_formatDateToABAP: function (oDate) {
  if (!oDate) return null;
  const year = oDate.getFullYear();
  const month = String(oDate.getMonth() + 1).padStart(2, '0');
  const day = String(oDate.getDate()).padStart(2, '0');
  return `${year}${month}${day}`; // e.g., 20250604
}


  });
});