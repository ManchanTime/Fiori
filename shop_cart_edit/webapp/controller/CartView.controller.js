sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], (Controller, Filter, FilterOperator, MessageToast) => {
    "use strict";

    return Controller.extend("sync6.cl1.shopcartedit.controller.CartView", {
        onInit() {
        },

        onSearch() {
            let oTable = this.getView().byId("cartTable"),
                oBinding = oTable.getBinding("rows"),
                oFilter = null,
                aFilter = [];

            let vRemark = this.getView().byId("IRemark").getValue();
            let vBelnr = this.getView().byId("IBelnr").getValue();
            
            if (vRemark !== '') {
                oFilter = new Filter({
                    path: 'Remark',
                    operator: FilterOperator.Contains,
                    value1: vRemark
                });
                aFilter.push(oFilter);
                oFilter = null;
            }

            if (vBelnr !== '') {
                oFilter = new Filter({
                    path: 'Belnr',
                    operator: FilterOperator.EQ,
                    value1: vBelnr.padStart(10, '0')
                });
                aFilter.push(oFilter);
                oFilter = null;
            }
            oBinding.filter(aFilter);
        },

        onClear() {
            this.getView().byId("Ryear").setValue('');
            this.getView().byId("Rbukrs").setValue('');
            this.getView().byId("Belnr").setValue('');
            this.getView().byId("Racct").setValue('');
            this.getView().byId("Remark").setValue('');
            this.getView().byId("Hsl").setValue('');
            this.getView().byId("Rtcur").setValue('');
            this.getView().byId("PostYn").setValue('');
        },

        onDisplay() {
            let oTable = this.getView().byId("cartTable"),
                aIndex = oTable.getSelectedIndices(),
                oContext = oTable.getContextByIndex(aIndex[0]),
                oData = oContext.getObject();

            this.getView().byId("Ryear").setValue(oData.Ryear);
            this.getView().byId("Rbukrs").setValue(oData.Rbukrs);
            this.getView().byId("Belnr").setValue(oData.Belnr);
            this.getView().byId("Racct").setValue(oData.Racct);
            this.getView().byId("Remark").setValue(oData.Remark);
            this.getView().byId("Hsl").setValue(oData.Hsl);
            this.getView().byId("Rtcur").setValue(oData.Rtcur);
            this.getView().byId("PostYn").setValue(oData.PostYn);
        },

        onCreate() {
            let oModel = this.getView().getModel();
            let vHsl = this.getView().byId("Hsl").getValue().replaceAll(",", "");
            let vBelnr = this.getView().byId("Belnr").getValue().padStart(10, '0');
            let oCreate = {
                Ryear: this.getView().byId("Ryear").getValue(),
                Rbukrs: this.getView().byId("Rbukrs").getValue(),
                Belnr: vBelnr,
                Racct: this.getView().byId("Racct").getValue(),
                Remark: this.getView().byId("Remark").getValue(),
                Hsl: vHsl,
                Rtcur: this.getView().byId("Rtcur").getValue(),
                PostYn: this.getView().byId("PostYn").getValue()
            };

            oModel.create("/CartSet", oCreate, {
                method: "POST",
                success() {
                    oModel.refresh();
                    alert("Create Success");
                    MessageToast.show("Create Success!!");
                },
                error() {
                    MessageToast.show("Create Failure!!");
                }
            });

        },

        onUpdate() {
            let oModel = this.getView().getModel();
            let vHsl = this.getView().byId("Hsl").getValue().replaceAll(",", "");
            let vBelnr = this.getView().byId("Belnr").getValue().padStart(10, '0');
            let oUpdate = {
                Ryear: this.getView().byId("Ryear").getValue(),
                Rbukrs: this.getView().byId("Rbukrs").getValue(),
                Belnr: vBelnr,
                Racct: this.getView().byId("Racct").getValue(),
                Remark: this.getView().byId("Remark").getValue(),
                Hsl: vHsl,
                Rtcur: this.getView().byId("Rtcur").getValue(),
                PostYn: this.getView().byId("PostYn").getValue()
            };

            oModel.update(`/CartSet(Ryear='${oUpdate.Ryear}',Rbukrs='${oUpdate.Rbukrs}',Belnr='${oUpdate.Belnr}')`,
                oUpdate,
                {
                    method: "PATCH",
                    success() {
                        oModel.refresh();
                        MessageToast.show("Update Success!!");
                    },
                    error() {
                        MessageToast.show("Update Failure!!");
                    }
                });
        },

        onDelete() {
            let oModel = this.getView().getModel(),
                oTable = this.getView().byId("cartTable"),
                aIndex = oTable.getSelectedIndices(),
                oContext = oTable.getContextByIndex(aIndex[0]),
                oData = oContext.getObject();

            oModel.remove(`/CartSet(Ryear='${oData.Ryear}',Rbukrs='${oData.Rbukrs}',Belnr='${oData.Belnr.padStart(10, '0')}')`,
                {
                    method: "DELETE",
                    success() {
                        oModel.refresh();
                        MessageToast.show("Delete Success!!");
                    },
                    error() {
                        MessageToast.show("Delete Failure!!");
                    }
                }
            )
        }
    });
});