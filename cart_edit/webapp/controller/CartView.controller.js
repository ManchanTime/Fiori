sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], (Controller, Filter, FilterOperator, MessageToast) => {
    "use strict";

    return Controller.extend("sync6.cl1.cartedit.controller.CartView", {
        onInit() {
        },

        onSearch() {
            let vMaktx = this.getView().byId("IMaktx").getValue(),
                vCustomId = this.getView().byId("ICustomId").getValue();

            let oTable = this.getView().byId("cartTable"),
                oBinding = oTable.getBinding("rows"),
                oFilter = null,
                aFilter = [];

            if (vMaktx !== '') {
                oFilter = new Filter({
                    path: 'Maktx',
                    operator: FilterOperator.Contains,
                    value1: vMaktx
                });
                aFilter.push(oFilter);
                oFilter = null;
            }

            console.log(vCustomId);
            if (vCustomId !== '') {
                oFilter = new Filter({
                    path: 'CustomId',
                    operator: FilterOperator.EQ,
                    value1: vCustomId.toUpperCase()
                });
                aFilter.push(oFilter);
                oFilter = null;
            }
            console.log(aFilter);

            oBinding.filter(aFilter);
        },

        onClear() {
            this.getView().byId("Shop").setValue('');
            this.getView().byId("CustomId").setValue('');
            this.getView().byId("CartNo").setValue('');
            this.getView().byId("Matnr").setValue('');
            this.getView().byId("Maktx").setValue('');
            this.getView().byId("Amount").setValue('');
            this.getView().byId("Waers").setValue('');
            this.getView().byId("GoodsCnt").setValue('');
            this.getView().byId("Kind").setValue('');
        },

        onDisplay() {
            let oTable = this.getView().byId("cartTable"),
                aIndex = oTable.getSelectedIndices(),
                oContext = oTable.getContextByIndex(aIndex[0]),
                oData = oContext.getObject();

            this.getView().byId("Shop").setValue(oData.Shop);
            this.getView().byId("CustomId").setValue(oData.CustomId);
            this.getView().byId("CartNo").setValue(oData.CartNo);
            this.getView().byId("Matnr").setValue(oData.Matnr);
            this.getView().byId("Maktx").setValue(oData.Maktx);
            this.getView().byId("Amount").setValue(oData.Amount);
            this.getView().byId("Waers").setValue(oData.Waers);
            this.getView().byId("GoodsCnt").setValue(oData.GoodsCnt);
            this.getView().byId("Kind").setValue(oData.Kind);
        },

        onCreate() {
            let oModel = this.getView().getModel();
            let vAmount = this.getView().byId("Amount").getValue();
            let cAmount = vAmount.replaceAll(",", "");

            let oCreate = {
                Shop: this.getView().byId("Shop").getValue(),
                CustomId: this.getView().byId("CustomId").getValue(),
                CartNo: parseInt(this.getView().byId("CartNo").getValue()),
                Matnr: this.getView().byId("Matnr").getValue(),
                Maktx: this.getView().byId("Maktx").getValue(),
                Amount: cAmount,
                Waers: this.getView().byId("Waers").getValue(),
                GoodsCnt: parseInt(this.getView().byId("GoodsCnt").getValue()),
                Kind: this.getView().byId("Kind").getValue()
            };

            oModel.create("/CartSet", oCreate, {
                method: "POST",
                success() {
                    oModel.refresh();
                    MessageToast.show("Create Success!!");
                },
                error() {
                    MessageToast.show("Create Failure!!");
                }
            });
        },

        onUpdate() {
            let oModel = this.getView().getModel();
            let vAmount = this.getView().byId("Amount").getValue().replaceAll(",", "");

            let oUpdate = {
                Shop: this.getView().byId("Shop").getValue(),
                CustomId: this.getView().byId("CustomId").getValue(),
                CartNo: parseInt(this.getView().byId("CartNo").getValue()),
                Matnr: this.getView().byId("Matnr").getValue(),
                Maktx: this.getView().byId("Maktx").getValue(),
                Amount: vAmount,
                Waers: this.getView().byId("Waers").getValue(),
                GoodsCnt: parseInt(this.getView().byId("GoodsCnt").getValue()),
                Kind: this.getView().byId("Kind").getValue()
            };

            oModel.update(`/CartSet(Shop='${oUpdate.Shop}',CustomId='${oUpdate.CustomId}')`,
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
            let oModel = this.getView().getModel();
            let oTable = this.getView().byId("cartTable");
            let aIndex = oTable.getSelectedIndices();
            let oContext = oTable.getContextByIndex(aIndex[0]);
            let oData = oContext.getObject();

            oModel.remove(`/CartSet(Shop='${oData.Shop}',CustomId='${oData.CustomId}')`, {
                method: "DELETE",
                success() {
                    oModel.refresh();
                    MessageToast.show("Delete Success!!");
                },
                error() {
                    MessageToast.show("Delete Failure!!");
                }
            });

        }
    });
});