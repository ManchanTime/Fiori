sap.ui.define([
    "sap/ui/core/Element",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    'sap/ui/model/odata/v2/ODataModel',
    "sap/m/Button",
    "sap/m/library",
    "sap/m/Dialog",
    "sap/m/Text",
], (Element, Controller, MessageToast, ODataModel, Button, Library, Dialog, Text) => {
    "use strict";

    return Controller.extend("bpcontrol.bpcontrol.controller.BP_Create", {
        onInit() {
            this.setInit();
            this._loadingSearchHelp("PgroupSet", "groups", "");
            this._loadingSearchHelp("CountrySet", "countries", "");
            this._loadingSearchHelp("MatnrSet", "matnr", "");
            this._loadingSearchHelp("MatnrSet", "cusmatnr", "P");
        },

        setInit() {
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

            const oModelCustomer = new sap.ui.model.json.JSONModel({
                Waers: "KRW",
                Knkli: "VVIP",
                Ctlzl: "A"
            });

            const oModelAccount = new sap.ui.model.json.JSONModel({
                accountList: [

                ]
            });
            oModelAccount.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

            const oModelVendor = new sap.ui.model.json.JSONModel({
                Waers: "KRW",
                Knkli: "A"
            });

            const oModelMatnr = new sap.ui.model.json.JSONModel({
                matnrList: [
                ]
            });
            oModelMatnr.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

            const oModelCusMatnr = new sap.ui.model.json.JSONModel({
                matnrList: [
                ]
            });
            oModelCusMatnr.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

            const oDate = new Date();
            const pad = (n, length = 2) => n.toString().padStart(length, '0');

            const yyyy = oDate.getFullYear();
            const MM = pad(oDate.getMonth() + 1); // 월은 0부터 시작
            const dd = pad(oDate.getDate());
            const hh = pad(oDate.getHours());
            const mm = pad(oDate.getMinutes());
            const ss = pad(oDate.getSeconds());
            const ms = oDate.getMilliseconds().toString().padEnd(7, '0'); // 7자리 맞춤

            const formattedDate = `${yyyy}.${MM}.${dd} ${hh}:${mm}:${ss}.${ms}`;
            const oModelCredit = new sap.ui.model.json.JSONModel({
                CreditLimit: "",
                LastUpdated: formattedDate
            });

            this.getView().setModel(oModel, "CreateBPModel");
            this.getView().setModel(oModelCustomer, "CreateCustomerModel");
            this.getView().setModel(oModelCredit, "CreateCreditModel");
            this.getView().setModel(oModelAccount, "CreateAccountModel");
            this.getView().setModel(oModelVendor, "CreateVendorModel");
            this.getView().setModel(oModelMatnr, "CreateMatnrModel");
            this.getView().setModel(oModelCusMatnr, "CreateCusMatnrModel");

        },

        _loadingSearchHelp: function (code, keyName, filter) {
            const oModel = this.getOwnerComponent().getModel();
            const oView = this.getView();
            const filter2 = filter;
            console.log(code, keyName, filter);
            oModel.read(`/${code}`, {
                success: function (oData) {
                    if (oData) {
                        let aGroups = Object.values(oData.results);
                        // filter가 'P'인 경우 Mtart가 'P'인 항목만 필터링
                        if (filter2 == 'P') {
                            console.log(keyName);
                            aGroups = aGroups.filter(item => item.Mtart === filter2);
                            console.log(aGroups);
                        }
                        // keyName으로 동적 key 설정
                        const oModel = oView.getModel("BpSearch");
                        const oDataObject = {};
                        oDataObject[keyName] = aGroups;
                        if (oModel) {
                            oModel.setProperty(`/${keyName}`, aGroups);
                        }
                        else {
                            const oGroupModel = new sap.ui.model.json.JSONModel(oDataObject);
                            oView.setModel(oGroupModel, "BpSearch");  // e.g., "BpSearch"
                        }
                        console.log(oModel);
                    }
                },
                error: function () {
                    sap.m.MessageToast.show("서치 헬프를 불러오지 못했습니다.");
                }
            });
        },

        onBack() {
            let ButtonType = Library.ButtonType;
            let DialogType = Library.DialogType;
            if (!this.oApproveDialog) {
                this.oApproveDialog = new Dialog({
                    type: DialogType.Message,
                    title: "취소",
                    content: new Text({ text: "작성한 데이터는 저장되지 않습니다." }),
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "네",
                        press: function () {
                            history.back();
                            this.setInit();
                            this.oApproveDialog.destroy();
                            this.oApproveDialog = null; // 반드시 초기화!
                            // this.oApproveDialog.close();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "아니오",
                        press: function () {
                            this.oApproveDialog.destroy();
                            this.oApproveDialog = null; // 반드시 초기화!
                            // this.oApproveDialog.close();
                        }.bind(this)
                    })
                });
            }
            this.oApproveDialog.open();
            // history.back();
            // this.setInit();
        },

        onImageChange: function (oEvent) {
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

        handleUploadComplete: function (oEvent) {
            // Please note that the event response should be taken from the event parameters but for our test example, it is hardcoded.

            var sResponse = "File upload complete. Status: 200",
                iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)[0]),
                sMessage;

            if (sResponse) {
                sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
                MessageToast.show(sMessage);
            }
        },

        handleUploadPress: function () {
            var oFileUploader = this.byId("fileUploader");
            oFileUploader.checkFileReadable().then(function () {
                oFileUploader.upload();
            }, function (error) {
                MessageToast.show("The file cannot be read. It may have changed.");
            }).then(function () {
                oFileUploader.clear();
            });
        },

        onEmailChange: function (oEvent) {
            const sValue = oEvent.getParameter("value");
            const oInput = oEvent.getSource();
            const bValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sValue);

            if (!bValid) {
                oInput.setValueState("Error");
                oInput.setValueStateText("올바른 이메일 형식이 아닙니다.");
            } else {
                oInput.setValueState("None");
            }
        },

        onNameChange: function (oEvent) {
            const sValue = oEvent.getParameter("value");
            const oInput = oEvent.getSource();
            if (sValue) {
                oInput.setValueState("None");
            }
        },

        onAddressChange: function (oEvent) {
            const sValue = oEvent.getParameter("value");
            const oInput = oEvent.getSource();
            if (sValue) {
                oInput.setValueState("None");
            }
        },

        onPhoneChange: function (oEvent) {
            const oInput = oEvent.getSource();
            let sValue = oEvent.getParameter("value");

            // 숫자와 '-'만 허용
            sValue = sValue.replace(/[^\d-]/g, "");

            // 상태 초기화
            if (sValue) {
                oInput.setValueState("None");
            }

            // 정제된 값 필드에 다시 설정
            oInput.setValue(sValue);

            // 모델에도 업데이트 (필요시)
            this.getView().getModel("CreateBPModel").setProperty("/Telf1", sValue);
        },

        onSearchAddressPopup: function () {
            // 팝업 열기
            const sPath = sap.ui.require.toUrl("bpcontrol/bpcontrol/goPopup.html");
            window.open(sPath, "주소검색", "width=500,height=600");
            // window.open("goPopup.html", "주소검색", "width=500,height=600");

            // 주소 선택 결과 받기
            window.addEventListener("message", function (oEvent) {
                const sAddress = oEvent.data.roadAddr; // ← 정확한 키 이름
                if (sAddress) {
                    this.getView().getModel("CreateBPModel").setProperty("/Stras", sAddress);
                }
            }.bind(this));
        },

        onBpRoleChange: function (oEvent) {
            const sRole = oEvent.getSource().getSelectedKey();
            const oModel = this.getView().getModel("CreateBPModel");

            // 역할에 따라 탭 표시 여부 제어
            oModel.setProperty("/ShowCustomer", sRole === "C" || sRole === "D");
            oModel.setProperty("/ShowVendor", sRole === "V" || sRole === "D");

            console.log(oModel);
        },

        onCreditLimitChange: function (oEvent) {
            const oInput = oEvent.getSource();
            let sValue = oInput.getValue();

            if (sValue) {
                oInput.setValueState("None");
            }

            // 숫자만 추출
            sValue = sValue.replace(/[^\d]/g, "");

            // 숫자가 없으면 빈값 처리
            if (!sValue) {
                oInput.setValue("");
                this.getView().getModel("CreateCreditModel").setProperty("/CreditLimit", "");
                return;
            }

            // 콤마 붙이기
            const sFormatted = Number(sValue).toLocaleString("en-US");

            // 입력창에 표시
            oInput.setValue(sFormatted);

            // 모델에도 원시 숫자 저장 (필요 시 문자열 그대로 저장도 가능)
            this.getView().getModel("CreateCreditModel").setProperty("/CreditLimit", sFormatted);
        },

        rebindTable: function (oTemplate, sKeyboardMode) {
            const oTable = this.byId("matnrTableCreate");
            if (!oTable) {
                console.error("테이블 ID 확인 필요: matnrTableCreate");
                return;
            }

            oTable.bindItems({
                path: "CreateMatnrModel>/matnrList",
                template: oTemplate,
                templateShareable: true
            });
        },

        onCreate: function () {
            const oModel = this.getView().getModel("CreateMatnrModel");
            const aOldData = oModel.getProperty("/matnrList") || [];

            // 새로운 행 추가
            const aNewData = [...aOldData, {
                Index: aOldData.length + 1,
                Matnr: "M0001",
                Maktx: "포장 소고기",
                Mtart: "P",
                Ddtext: "완제품",
                Stprs: "1000",
                Waers: "KRW",
                Contype: "V"
            }];

            // UI가 반응하도록 새 배열로 덮어쓰기
            oModel.setProperty("/matnrList", aNewData);

            console.log("✔️ 현재 항목 수:", oModel.getProperty("/matnrList"));
        },

        onDelete: function () {
            const oTable = this.byId("matnrCreateTable");
            let oModel = this.getView().getModel("CreateMatnrModel");

            const aSelectedIndices = oTable.getSelectedIndices(); // 선택된 행의 인덱스 배열
            if (aSelectedIndices.length === 0) {
                sap.m.MessageToast.show("삭제할 항목을 선택하세요.");
                return;
            }

            // 기존 데이터 가져오기
            let aData = oModel.getProperty("/matnrList");

            // 선택된 인덱스를 역순으로 정렬 후 삭제 (인덱스 밀림 방지)
            aSelectedIndices.sort((a, b) => b - a).forEach(i => {
                aData.splice(i, 1);
            });

            // 인덱스 재정렬 (1부터 시작)
            aData = aData.map((item, idx) => {
                item.Index = idx + 1;
                return item;
            });

            // 다시 모델에 세팅
            oModel.setProperty("/matnrList", aData);

            // 선택 해제
            oTable.clearSelection();
        },

        onMatnrChange: function (oEvent) {
            const oSelectedItem = oEvent.getParameter("selectedItem");
            const sSelectedKey = oEvent.getParameter("selectedItem").getKey();

            // BpSearch 모델에서 전체 자재 목록 가져오기
            const oBpModel = this.getView().getModel("BpSearch");
            const aMatnrList = oBpModel.getProperty("/matnr");

            // 선택된 Matnr에 해당하는 객체 찾기
            const oSelectedMatnr = aMatnrList.find(item => item.Matnr === sSelectedKey);
            if (!oSelectedMatnr) return;

            // 현재 바인딩된 행 경로 얻기 (CreateMatnrModel>/matnrList/0 ...)
            const sRowPath = oEvent.getSource().getBindingContext("CreateMatnrModel").getPath();
            const oCreateModel = this.getView().getModel("CreateMatnrModel");

            // 해당 행의 필드 업데이트
            console.log(sRowPath + "/Maktx", oSelectedMatnr.Maktx);
            oCreateModel.setProperty(sRowPath + "/Maktx", oSelectedMatnr.Maktx);
            oCreateModel.setProperty(sRowPath + "/Mtart", oSelectedMatnr.Mtart);
            oCreateModel.setProperty(sRowPath + "/Ddtext", oSelectedMatnr.Ddtext);
        },


        onCreateCusMat: function () {
            const oModel = this.getView().getModel("CreateCusMatnrModel");
            const aOldData = oModel.getProperty("/matnrList") || [];

            // 새로운 행 추가
            const aNewData = [...aOldData, {
                Index: aOldData.length + 1,
                Matnr: "M0001",
                Maktx: "포장 소고기",
                Mtart: "P",
                Ddtext: "완제품",
                Stprs: "1000",
                Waers: "KRW",
                Contype: "C"
            }];

            // UI가 반응하도록 새 배열로 덮어쓰기
            oModel.setProperty("/matnrList", aNewData);

            console.log("✔️ 현재 항목 수:", oModel.getData());
        },

        onDeleteCusMat: function () {
            const oTable = this.byId("custmatCreateTable");
            let oModel = this.getView().getModel("CreateCusMatnrModel");

            const aSelectedIndices = oTable.getSelectedIndices(); // 선택된 행의 인덱스 배열
            if (aSelectedIndices.length === 0) {
                sap.m.MessageToast.show("삭제할 항목을 선택하세요.");
                return;
            }

            // 기존 데이터 가져오기
            let aData = oModel.getProperty("/matnrList");

            // 선택된 인덱스를 역순으로 정렬 후 삭제 (인덱스 밀림 방지)
            aSelectedIndices.sort((a, b) => b - a).forEach(i => {
                aData.splice(i, 1);
            });

            // 인덱스 재정렬 (1부터 시작)
            aData = aData.map((item, idx) => {
                item.Index = idx + 1;
                return item;
            });

            // 다시 모델에 세팅
            oModel.setProperty("/matnrList", aData);

            // 선택 해제
            oTable.clearSelection();
        },

        onCusMatnrChange: function (oEvent) {
            const oSelectedItem = oEvent.getParameter("selectedItem");
            const sSelectedKey = oEvent.getParameter("selectedItem").getKey();

            // BpSearch 모델에서 전체 자재 목록 가져오기
            const oBpModel = this.getView().getModel("BpSearch");
            const aMatnrList = oBpModel.getProperty("/cusmatnr");

            // 선택된 Matnr에 해당하는 객체 찾기
            const oSelectedMatnr = aMatnrList.find(item => item.Matnr === sSelectedKey);
            if (!oSelectedMatnr) return;

            // 현재 바인딩된 행 경로 얻기 (CreateMatnrModel>/matnrList/0 ...)
            const sRowPath = oEvent.getSource().getBindingContext("CreateCusMatnrModel").getPath();
            const oCreateModel = this.getView().getModel("CreateCusMatnrModel");

            // 해당 행의 필드 업데이트
            console.log(sRowPath + "/Maktx", oSelectedMatnr.Maktx);
            oCreateModel.setProperty(sRowPath + "/Maktx", oSelectedMatnr.Maktx);
            oCreateModel.setProperty(sRowPath + "/Mtart", oSelectedMatnr.Mtart);
            oCreateModel.setProperty(sRowPath + "/Ddtext", oSelectedMatnr.Ddtext);
        },

        onCreateAcc: function () {
            const oModel = this.getView().getModel("CreateAccountModel");
            const aOldData = oModel.getProperty("/accountList") || [];

            // 새로운 행 추가
            const aNewData = [...aOldData, {
                Index: aOldData.length + 1,
                Bank: "YR",
                OwnerType: "BP",
                Accnum: "",
                Waers: "KRW"
            }];

            // UI가 반응하도록 새 배열로 덮어쓰기
            oModel.setProperty("/accountList", aNewData);

            console.log("✔️ 현재 항목 수:", oModel);
        },

        onDeleteAcc: function () {
            const oTable = this.byId("accountCreateTableEdit");
            const oModel = this.getView().getModel("CreateAccountModel");

            const aSelectedIndices = oTable.getSelectedIndices(); // 선택된 행의 인덱스 배열
            if (aSelectedIndices.length === 0) {
                sap.m.MessageToast.show("삭제할 항목을 선택하세요.");
                return;
            }

            // 기존 데이터 가져오기
            let aData = oModel.getProperty("/accountList");

            // 선택된 인덱스를 역순으로 정렬 후 삭제 (인덱스 밀림 방지)
            aSelectedIndices.sort((a, b) => b - a).forEach(i => {
                aData.splice(i, 1);
            });

            // 인덱스 재정렬 (1부터 시작)
            aData = aData.map((item, idx) => {
                item.Index = idx + 1;
                return item;
            });

            // 다시 모델에 세팅
            oModel.setProperty("/matnrList", aData);

            // 선택 해제
            oTable.clearSelection();
        },

        onChangeBank: function (oEvent) {
            const oSelect = oEvent.getSource();
            const sSelectedKey = oEvent.getParameter("selectedItem").getKey();

            const oContext = oSelect.getBindingContext("CreateAccountModel");
            const sPath = oContext.getPath(); // 예: "/accountList/1"

            const oModel = oContext.getModel();
            oModel.setProperty(sPath + "/Bank", sSelectedKey);
        },

        onChangeAccnum: function (oEvent) {
            const oInput = oEvent.getSource();
            const sOriginalValue = oEvent.getParameter("value");

            // 숫자만 남기기
            const sCleaned = sOriginalValue.replace(/\D/g, ""); // 숫자 외 제거

            // 모델 경로 (eg. /accountList/0)
            const oContext = oInput.getBindingContext("CreateAccountModel");
            const sRowPath = oContext.getPath(); // "/accountList/0"

            const oModel = oContext.getModel();
            oModel.setProperty(sRowPath + "/Accnum", sCleaned);
        },

        // 유틸 함수 (로컬로 선언)
        _cleanEmpty: function (obj) {
            Object.keys(obj).forEach(key => {
                const val = obj[key];
                if (val && typeof val === "object" && !Array.isArray(val)) {
                    this._cleanEmpty(val);
                    if (Object.keys(val).length === 0) {
                        delete obj[key];
                    }
                } else if (
                    val === null ||
                    val === undefined ||
                    (typeof val === "string" && val.trim() === "")
                ) {
                    delete obj[key];
                }
            });
            return obj;
        },

        // 저장 버튼
        onSave: function () {
            let ButtonType = Library.ButtonType;
            let DialogType = Library.DialogType;
            if (!this.oApproveDialog) {
                this.oApproveDialog = new Dialog({
                    type: DialogType.Message,
                    title: "저장 확인",
                    content: new Text({ text: "저장하시겠습니까?" }),
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "네",
                        press: function () {
                            this._saveLogic();
                            sap.m.MessageToast.show("업로드 성공!");
                            history.back(); // 또는 window.history.back();
                            this.setInit();
                            this.oApproveDialog.destroy();
                            this.oApproveDialog = null; // 반드시 초기화!
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "아니오",
                        press: function () {
                            this.oApproveDialog.destroy();
                            this.oApproveDialog = null; // 반드시 초기화!
                        }.bind(this)
                    })
                });
            }
            this.oApproveDialog.open();
        },

        _saveLogic: function () {
            let oModelPartner = this.getView().getModel("CreateBPModel");
            let oModelCustomer = this.getView().getModel("CreateCustomerModel");
            let oModelCredit = this.getView().getModel("CreateCreditModel");
            let oModelVendor = this.getView().getModel("CreateVendorModel");
            let oModelAccount = this.getView().getModel("CreateAccountModel");
            let oModelMatnr = this.getView().getModel("CreateMatnrModel");
            let oModelCusMatnr = this.getView().getModel("CreateCusMatnrModel");
            let oModel = this.getView().getModel();
            let creditLimit;
            let nameCustomer, nameVendor;
            let telC, telV;
            let addC, addV;
            let emailC;
            let aAccountList = oModelAccount.getProperty("/accountList");
            let aMatnrList = oModelMatnr.getProperty("/matnrList");
            let aCusMatList = oModelCusMatnr.getProperty("/matnrList");
            let aCleanedAccountList, aCleanedMatnrList, aCleanedCustMatnrList;
            let aVendorList;

            // 유효성 테스트
            const sEmailValue = oModelPartner.getProperty("/Email");
            const oNameInput = this.getView().byId("nameText");
            const oAddressInput = this.getView().byId("addressText");
            const oPhoneInput = this.getView().byId("phoneInput");
            const oEmailInput = this.getView().byId("emailInput");
            const bValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sEmailValue);

            // 1. 이름
            if (!oModelPartner.getProperty("/Name1")) {
                oNameInput.setValueState("Error");
                oNameInput.setValueStateText("이름을 입력해주세요.");
            } else {
                oEmailInput.setValueState("None");
            }

            // 2. 주소
            if (!oModelPartner.getProperty("/Stras")) {
                oAddressInput.setValueState("Error");
                oAddressInput.setValueStateText("주소를를 입력해주세요.");
            } else {
                oAddressInput.setValueState("None");
            }

            // 3.전화번호
            if (!oModelPartner.getProperty("/Telf1")) {
                oPhoneInput.setValueState("Error");
                oPhoneInput.setValueStateText("전화번호를를 입력해주세요.");
            } else {
                oPhoneInput.setValueState("None");
            }

            // 4. 메일
            if (!bValid) {
                if (!bValid) {
                    oEmailInput.setValueState("Error");
                    oEmailInput.setValueStateText("올바른 이메일 형식을 입력해주세요.");
                } else {
                    oEmailInput.setValueState("None");
                }
                return; // 저장 중단
            } else {
                oEmailInput.setValueState("None");
            }

            if (!oModelPartner.getProperty("/ShowCustomer")) {
                oModelCustomer.setData({});
                oModelCredit.setData({});
            } else {

                // 5. 고객 이라면 여신 한도도
                const oCreditLimitInput = this.getView().byId("creditLimitInput");
                console.log(!oModelCustomer.getProperty("/CreditLimit"));
                if (oModelCustomer.getProperty("/CreditLimit")) {
                    oCreditLimitInput.setValueState("Error");
                    oCreditLimitInput.setValueStateText("여신한도를 입력해주세요.");
                    return;
                } else {
                    oCreditLimitInput.setValueState("None");
                }
                nameCustomer = oModelPartner.getProperty("/Name1");
                telC = oModelPartner.getProperty("/Telf1").replace(/\D/g, "");
                addC = oModelPartner.getProperty("/Stras") + " " + oModelPartner.getProperty("/Detail");
                emailC = oModelPartner.getProperty("/Email");
                creditLimit = Number(oModelCredit.getProperty("/CreditLimit").replace(/,/g, "")).toString();

                // 6. 거래 상품
                if (!aCusMatList.length) {
                    MessageToast.show("최소 한 개 이상의 상품을 입력해 주세요.");
                    return;
                }

                aCleanedCustMatnrList = aCusMatList
                    .map(item => ({
                        Matnr: item.Matnr,
                        Stprs: item.Stprs,
                        Waers: item.Waers,
                        Contype: item.Contype       // ✅ Contype 추가
                    }))
                    .filter((item, index, self) =>
                        index === self.findIndex(t =>
                            t.Matnr === item.Matnr &&
                            t.Stprs === item.Stprs &&
                            t.Waers === item.Waers &&
                            t.Contype === item.Contype // ✅ 중복 제거 기준에 Contype 포함
                        )
                    );
            }

            if (!oModelPartner.getProperty("/ShowVendor")) {
                oModelVendor.setData({});
            } else {
                // 7. 거래처라면 거래 계좌, 거래 자재 세팅
                if (!aAccountList.length) {
                    MessageToast.show("최소 한 개 이상의 계좌를 입력해 주세요.");
                    return;
                }
                if (!aMatnrList.length) {
                    MessageToast.show("최소 한 개 이상의 자재를 입력해 주세요.");
                    return;
                }

                nameVendor = oModelPartner.getProperty("/Name1");
                telV = oModelPartner.getProperty("/Telf1").replace(/\D/g, "");
                addV = oModelPartner.getProperty("/Stras") + " " + oModelPartner.getProperty("/Detail");

                aVendorList = [
                    {
                        Name1: nameVendor,
                        Telf1: telV,
                        Stras: addV,
                        Knkli: oModelVendor.getProperty("/Knkli")
                    }
                ]

                // Index 필드를 제거한 새 배열 만들기
                aCleanedAccountList = aAccountList.map(({ Index, ...rest }) => rest).filter((item, index, self) =>
                    index === self.findIndex(
                        t => JSON.stringify(t) === JSON.stringify(item)
                    )
                );
                aCleanedMatnrList = aMatnrList
                    .map(item => ({
                        Matnr: item.Matnr,
                        Stprs: item.Stprs,
                        Waers: item.Waers,
                        Contype: item.Contype        // ✅ Contype 추가
                    }))
                    .filter((item, index, self) =>
                        index === self.findIndex(t =>
                            t.Matnr === item.Matnr &&
                            t.Stprs === item.Stprs &&
                            t.Waers === item.Waers &&
                            t.Contype === item.Contype // ✅ 중복 제거 조건에도 포함
                        )
                    );
            }

            let oCreate = {
                Name1: oModelPartner.getProperty("/Name1"),
                // Stras: oModelSave.getProperty("/Stras") + " " + oModelSave.getProperty("/Detail"),
                Land1: oModelPartner.getProperty("/Land1"),
                // Telf1: oModelSave.getProperty("/Telf1"),
                Email: oModelPartner.getProperty("/Email"),
                BpGroup: oModelPartner.getProperty("/BpGroup"),
                BpRole: oModelPartner.getProperty("/BpRole"),
                BpType: oModelPartner.getProperty("/BpType"),
                // ✅ 이미지 필드들
                ImageUrl: oModelPartner.getProperty("/ImageUrl"),
                Mimetype: oModelPartner.getProperty("/Mimetype"),
                ImageData: oModelPartner.getProperty("/ImageData"), // Base64 또는 Binary로 준비됨
                BpGroup: oModelPartner.getProperty("/BpGroup"),

                to_Customer: [
                    {
                        Name1: nameCustomer,
                        Telf1: telC,
                        Email: emailC,
                        Stras: addC,
                        Knkli: oModelCustomer.getProperty("/Knkli"),
                        Ctlzl: oModelCustomer.getProperty("/Ctlzl"),
                        Waers: oModelCustomer.getProperty("/Waers")
                    }
                ],
                to_Vendor: aVendorList,
                to_Matnr: aCleanedMatnrList,
                to_Bank: aCleanedAccountList,
                to_Credit: {
                    CreditLimit: creditLimit,
                    Waers: oModelCustomer.getProperty("/Waers")
                },
                to_CusMatnr: aCleanedCustMatnrList
            };

            // ✅ 값이 null/undefined/빈 문자열("")이면 삭제
            Object.keys(oCreate).forEach(key => {
                const val = oCreate[key];
                if (val === null || val === undefined || (typeof val === "string" && val.trim() === "")) {
                    delete oCreate[key];
                }
            });
            const oCleaned = this._cleanEmpty(oCreate);
            console.log("이전 : ", oCreate);
            console.log("생성 : ", oCleaned);
            oModel.create("/BpSet", oCleaned, {
                success: function () {
                    console.log("Save Save Save Okay~~~!!");
                },
                error: function (oError) { // ✅ 여기에 oError를 명시해야 함
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
            // sap.m.MessageToast.show("업로드 성공!");
            // history.back(); // 또는 window.history.back();
            // this.setInit();
            //     // 이전 페이지로 돌아가기
            //     const oHistory = sap.ui.core.routing.History.getInstance();
            //     const sPreviousHash = oHistory.getPreviousHash();

            //     if (sPreviousHash !== undefined) {
            //         window.history.go(-1); // 브라우저 history로 이동
            //     } else {
            //         // fallback: 메인 화면으로 이동 등
            //         this.getRouter().navTo("home", {}, true); // replace=true로 history에 안 쌓이게
            //     }
        }
    });
});