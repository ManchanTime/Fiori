sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("cl1.test2.cl1.test2.controller.Test2", {
        onInit() {

        },

        onAfterRendering: function () {
            const oSmartTable = this.byId("bpTable");

            // 내부 테이블이 완전히 초기화되었을 때만 접근
            setTimeout(() => {
                const oTable = oSmartTable.getTable();
                const oModel = oTable.getModel();
                console.log("모델: ", oModel);
            }, 0);
        },

        onClear() {
            this.getView().byId("Bukrs").setValue("");
            this.getView().byId("Gjahr").setValue("");
            this.getView().byId("Blart").setValue("");
            this.getView().byId("Budat").setValue("");
            this.getView().byId("Belnr").setValue("");
            this.getView().byId("Bktxt").setValue("");
            this.getView().byId("Waers").setValue("");
            this.getView().byId("Wrbtr").setValue("");
        },

        // Get EntitySet
        onSearch() {

            // 검색어 받아오기
            let vBktxt = this.getView().byId("IBktxt").getValue(),
                vBlart = this.getView().byId("IBlart").getValue();

            let oTable = this.getView().byId("docuTable"), // view의 테이블 개체 받아오기
                oBinding = oTable.getBinding("rows"),      // 검색 개체 추출(Fiter 사용가능)
                oFilter = null,                            // 검색어 구성 개체
                aFilter = [];                              // 검색어 담는 배열

            // Filter 구성
            if (vBktxt != '') {
                oFilter = new Filter({
                    path: 'Bktxt',
                    operator: FilterOperator.Contains,
                    value1: vBktxt
                });
                aFilter.push(oFilter);
                oFilter = null;
            }
            if (vBlart != '') {
                oFilter = new Filter({
                    path: 'Blart',
                    operator: FilterOperator.EQ,
                    value1: vBlart.toUpperCase()
                });
                aFilter.push(oFilter);
                oFilter = null;
            }

            oBinding.filter(aFilter);
        },

        // Get Entity
        onDisplay() {

            let oModel = this.getView().getModel(),             // GW Service 실행개체(read, create, remove, update)
                oTable = this.getView().byId("docuTable"),
                aIndex = oTable.getSelectedIndices(),           // go_grid->get_selected_rows랑 비슷
                oContext = oTable.getContextByIndex(aIndex[0]), // Read Table
                oData = oContext.getObject();                   // gs_body

            this.getView().byId("Bukrs").setValue(oData.Bukrs);
            this.getView().byId("Gjahr").setValue(oData.Gjahr);
            this.getView().byId("Blart").setValue(oData.Blart);
            this.getView().byId("Budat").setValue(oData.Budat);
            this.getView().byId("Belnr").setValue(oData.Belnr);
            this.getView().byId("Bktxt").setValue(oData.Bktxt);
            this.getView().byId("Waers").setValue(oData.Waers);
            this.getView().byId("Wrbtr").setValue(oData.Wrbtr);

        },

        // Create object
        onCreate() {

            let oModel = this.getView().getModel();
            let vWrbtr = this.getView().byId("Wrbtr").getValue().replaceAll(',', ''),
                vBudat = this.getView().byId("Budat").getValue();
            const cBudat = new Date(vBudat).toISOString().split("T")[0];

            let oCreate = {
                Bukrs: this.getView().byId("Bukrs").getValue(),
                Gjahr: this.getView().byId("Gjahr").getValue(),
                Blart: this.getView().byId("Blart").getValue(),
                Budat: cBudat,
                Belnr: this.getView().byId("Belnr").getValue(),
                Bktxt: this.getView().byId("Bktxt").getValue(),
                Waers: this.getView().byId("Waers").getValue(),
                Wrbtr: vWrbtr,
            }

            oModel.create("/DocumentSet", oCreate, {
                method: "POST",
                success() {
                    oModel.refresh();
                    MessageToast.show("Create success!!");
                },
                error() {
                    MessageToast.show("Error on create!!");
                }
            });
        },
        // Update Object
        onUpdate() {

            let oModel = this.getView().getModel();
            let vWrbtr = this.getView().byId("Wrbtr").getValue().replaceAll(',', ''),
                vBudat = this.getView().byId("Budat").getValue();
            const cBudat = new Date(vBudat).toISOString().split("T")[0];

            let oUpdate = {
                Bukrs: this.getView().byId("Bukrs").getValue(),
                Gjahr: this.getView().byId("Gjahr").getValue(),
                Blart: this.getView().byId("Blart").getValue(),
                Budat: cBudat,
                Belnr: this.getView().byId("Belnr").getValue().padStart(10, "0"),
                Bktxt: this.getView().byId("Bktxt").getValue(),
                Waers: this.getView().byId("Waers").getValue(),
                Wrbtr: vWrbtr,
            }

            console.log(`/DocumentSet(Bukrs='${oUpdate.Bukrs}',Belnr='${oUpdate.Belnr}',Gjahr='${oUpdate.Gjahr}')`);
            oModel.update(`/DocumentSet(Bukrs='${oUpdate.Bukrs}',Belnr='${oUpdate.Belnr}',Gjahr='${oUpdate.Gjahr}')`,
                oUpdate,
                {
                    method: "PATCH",
                    success() {
                        oModel.refresh();
                        MessageToast.show("Update success!!");
                    },
                    error() {
                        MessageToast.show("Error on update!!");
                    }
                });
        },

        onDelete() {

            let oModel = this.getView().getModel(),             // GW Service 실행개체(read, create, remove, update)
                oTable = this.getView().byId("docuTable"),
                aIndex = oTable.getSelectedIndices(),           // go_grid->get_selected_rows랑 비슷
                oContext = oTable.getContextByIndex(aIndex[0]), // Read Table
                oData = oContext.getObject();                   // gs_body

            oModel.remove(`/DocumentSet(Bukrs='${oData.Bukrs}',Belnr='${oData.Belnr.padStart(10, '0')}',Gjahr='${oData.Gjahr}')`,
                {
                    method: "DELETE",
                    success() {
                        oModel.refresh();
                        MessageToast.show("Delete success!!");
                    },
                    error() {
                        MessageToast.show("Error on update!!");
                    }
                }
            );
        }
    });
});