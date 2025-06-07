sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("zc102sdrorder.zc102sdrorder.controller.MainView", {

        setInit: function () {
        const oModel = new sap.ui.model.json.JSONModel({
            Name1: "",
            Email: "",
            Land1: "DE",
            BpGroup: "GROUP_01",
            BpRole: "C",
            BpType: "P",
            ImagePreviewSrc: "",

            // ✅ PDF 관련 필드
            PdfPreviewSrc: "",
            Filedata: "",
            Filename: "",
            Pmimetype: "application/pdf"
        });
        this.getView().setModel(oModel, "CreateBPModel");
    },

        renderPdfIframe: function (src) {
        if (!src) return "<p>PDF 미리보기가 없습니다.</p>";
        return `<iframe src="${src}" width="100%" height="600px" style="border:none;"></iframe>`;
    },




        onInit: function () {
            // OData 모델 설정
            const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC102_P_SD_REG_ORDER_CDS");
            this.getView().setModel(oModel);

            // 팝업용 JSON 모델 초기화 (한 번만)
            const oBpModel = new sap.ui.model.json.JSONModel({ 
                orders: [],
                DialogTitle: ""
            });
            this.getView().setModel(oBpModel, "bpOrders");
        },

        onCreate: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteOrder_Create");
        },

        onRowPress: function (oEvent) {
            const oCtx = oEvent.getSource().getBindingContext();
            const sVbelnSo = oCtx.getProperty("VbelnSo");
            const sCusno = oCtx.getProperty("Cusno");
            const sPartner = oCtx.getProperty("Partner");

            this.getOwnerComponent().getRouter().navTo("RouteOrderDetail", {
                vbelnSo: sVbelnSo,
                cusno: sCusno,
                partner: sPartner
            });
        },

        onBpPress: function (oEvent) {
            console.log("✅ 타일 클릭됨");
            
            const sHeader = oEvent.getSource().getHeader();
            const sDay = sHeader.match(/\d+/)[0];
            const oModel = this.getView().getModel();

            // 로딩 표시
            const oDialog = this.byId("bpDialog");
            if (!oDialog) {
                MessageToast.show("Dialog를 찾을 수 없습니다.");
                return;
            }

            oModel.read("/OrderSet", {
                success: function (oData) {
                    console.log("📦 전체 데이터:", oData.results);

                    const aFiltered = oData.results.filter(order => {
                        if (!order.Delid) return false;

                        // OData V2 날짜 형식 처리
                        let oDate;
                        if (typeof order.Delid === 'string' && order.Delid.indexOf('/Date(') === 0) {
                            const sDateStr = order.Delid.substring(6, order.Delid.length - 2);
                            oDate = new Date(parseInt(sDateStr));
                        } else {
                            oDate = new Date(order.Delid);
                        }

                        if (isNaN(oDate.getTime())) {
                            console.warn("⛔ 날짜 파싱 실패:", order.Delid);
                            return false;
                        }

                        const sDayPart = oDate.getDate().toString();
                        return sDayPart === sDay;
                    });

                    // 중복 제거
                    const oSeen = {};
                    const aUniqueByPartner = aFiltered.filter(item => {
                        const sPartner = item.Partner?.trim();
                        if (!oSeen[sPartner]) {
                            oSeen[sPartner] = true;
                            return true;
                        }
                        return false;
                    });

                    // 기존 모델 업데이트 (새로 생성하지 않음)
                    const oBpModel = this.getView().getModel("bpOrders");
                    oBpModel.setData({
                        orders: aUniqueByPartner,
                        DialogTitle: `납기일 ${sDay}일 주문 목록`
                    });

                    console.log("📌 필터링된 데이터:", aUniqueByPartner);
                    oDialog.open();

                }.bind(this),
                error: function (oError) {
                    console.error("❌ READ 실패", oError);
                    MessageToast.show("데이터 조회 실패");
                }
            });
        },

        onDialogClose: function () {
            this.byId("bpDialog").close();
            this.byId("pdfDialog").close();
        },

        onOrderPress: function (oEvent) {
            const oCtx = oEvent.getSource().getBindingContext("bpOrders");
            const oData = oCtx.getObject();

            const sBase64 = oData.BpFileBinary; // base64
            const sMimeType = oData.BpMimeType || "application/pdf";

            if (sBase64 && sMimeType === "pdf") {
                // ✅ Blob으로 변환 (디코딩하지 말고 그대로)
                const byteCharacters = atob(sBase64); // 이건 삭제❌

                // 이렇게 변환
                const byteArray = Uint8Array.from(atob(sBase64), c => c.charCodeAt(0));
                const blob = new Blob([byteArray], { type: "application/pdf" });

                const pdfUrl = URL.createObjectURL(blob);
                const sPdfViewerContent = `
                    <iframe 
                        src="${pdfUrl}" 
                        width="100%" 
                        height="100%" 
                        style="border:none; min-height:600px;">
                        PDF를 표시할 수 없습니다.
                    </iframe>
                `;
                this.byId("pdfHtml").setContent(sPdfViewerContent);
                this.byId("pdfDialog").open();
            } else {
                MessageToast.show("PDF 미리보기 데이터를 찾을 수 없습니다.");
            }
        },


        // PDF 표시 함수
        showPdfDialog: function(sPdfData) {
            // Base64 데이터를 Blob으로 변환
            const byteCharacters = atob(sPdfData);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(blob);
            
            // PDF 뷰어 설정
            const sPdfViewerContent = `
                <iframe 
                    src="${pdfUrl}" 
                    width="100%" 
                    height= "100vh" 
                    style="border:none;">
                    PDF를 표시할 수 없습니다.
                </iframe>
            `;
            
            // Dialog의 HTML 컨트롤에 설정
            this.byId("pdfViewer").setContent(sPdfViewerContent);
            this.byId("pdfDialog").open();
            
            // 메모리 정리를 위해 URL 해제 (Dialog 닫을 때)
            this._currentPdfUrl = pdfUrl;
        },

        // Dialog 닫기 시 메모리 정리
        onPdfDialogClose: function() {
            if (this._currentPdfUrl) {
                URL.revokeObjectURL(this._currentPdfUrl);
                this._currentPdfUrl = null;
            }
            this.byId("pdfDialog").close();
        },

        // PDF 다운로드 기능
        onPdfDownload: function() {
            if (this._currentPdfUrl) {
                const link = document.createElement('a');
                link.href = this._currentPdfUrl;
                link.download = '정기계약서.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }


    });
});