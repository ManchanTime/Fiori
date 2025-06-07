sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("test.test.controller.test", {
        onInit() {
            const oModel = new sap.ui.model.json.JSONModel({
                ImagePreviewSrc: "data:image/png;base64,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", // ✅ 기본 이미지 경로
                Name1: "",
                Stras: "",
                Detail: "",
                Land1: "DE",
                Telf1: "",
                Email: "",
                BpGroup: "GROUP_01",
                BpRole: "C",
                BpType: "P",
                ShowCustomer: true,
                ShowVendor: false
            });
            this.getView().setModel(oModel, "CreateBPModel");
        },

        onImageChange: function (oEvent) {
            console.log("이미지 세팅");
            const oFile = oEvent.getParameter("files")[0];
            if (oFile && FileReader) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const base64Full = e.target.result;                  // "data:image/png;base64,..."
                    const base64 = base64Full.split(",")[1];             // base64 only
                    const mimeType = oFile.type;
                    const fileName = oFile.name;
                    // 모델의 /ImageUrl에 저장 → 미리보기 반영
                    // this.getView().getModel("CreateBPModel").setProperty("/ImageData", base64);
                    const oModel = this.getView().getModel("CreateBPModel");
                    oModel.setProperty("/ImagePreviewSrc", base64Full); // ✅ 전체 URI 형태
                    oModel.setProperty("/ImageData", base64); // binary 형식 (optional)
                    oModel.setProperty("/ImageUrl", fileName);
                    oModel.setProperty("/Mimetype", mimeType);

                }.bind(this);
                reader.readAsDataURL(oFile);
            }
        },

        onBack() {
            console.log("이미지 저장");
            const oModel = this.getView().getModel();
            const oPartnerModel = this.getView().getModel("CreateBPModel");
            console.log(oPartnerModel);
            const oCreate = {
                Filedata: oPartnerModel.getProperty("/ImageData"),
                Filename: oPartnerModel.getProperty("/ImageUrl"),
                Pmimetype: oPartnerModel.getProperty("/Mimetype")
            };

            oModel.update("/BpPSet('BP0003')", oCreate, {
                method: "PATCH", // 생략 가능하지만 명시적으로 작성 가능
                success: function () {
                    console.log("✅ 저장 성공!");
                },
                error: function (oError) {
                    let sMessage = "알 수 없는 오류 발생";

                    try {
                        const oResponse = JSON.parse(oError.responseText);
                        if (oResponse.error?.message?.value) {
                            sMessage = oResponse.error.message.value;
                        }
                    } catch (e) {
                        sMessage = oError.message || "응답 파싱 실패";
                    }

                    console.error("❌ SAP OData 오류:", oError);
                    sap.m.MessageBox.error("SAP 오류:\n" + sMessage);
                }
            });
        }
    });
});