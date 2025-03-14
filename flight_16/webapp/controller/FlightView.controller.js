sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("sync6.cl1.flight16.controller.FlightView", {
        onInit() {

        },
        onAfterRendering: function () {
            const oTable = this.byId("sflightTable");
            console.log(oTable);
            if (oTable) {
                oTable.getColumns().forEach((column) => {
                    if (column.getAutoResizable && column.getAutoResizable()) {
                        column.autoResize();  // 강제 너비 최적화
                    }
                });
            }
        },

        onDetail(oEvent) {
            let oData = oEvent.getSource().getBindingContext().getObject();
            let vCarrid = oData.Carrid;
            let filterList = [];
            this.setArray(filterList, 'Carrid', vCarrid);
            this.setDetail(filterList, "sflightTable");
        },

        onSpfli(oEvent) {
            let oData = oEvent.getParameter("rowBindingContext").getObject();
            let vCarrid = oData.Carrid;
            let vConnid = oData.Connid;
            let filterList = [];
            this.setArray(filterList, 'Carrid', vCarrid);
            this.setArray(filterList, 'Connid', vConnid);
            this.setDetail(filterList, "scheduleTable");
        },

        setDetail(filterList, tableId) {
            let oTable = this.getView().byId(tableId);
            let oBinding = oTable.getBinding("rows");
            let oFilter = null;
            let aFilter = [];

            for (let filter of filterList) {
                if (filter !== '') {
                    oFilter = new Filter({
                        path: filter.name,
                        operator: FilterOperator.EQ,
                        value1: filter.value
                    });
                    aFilter.push(oFilter);
                    oFilter = null;
                }
            }

            oBinding.filter(aFilter);
            oTable.setVisible(true);
        },

        setArray(array, name, value) {
            array.push({
                name: name,
                value: value
            });
        }
    });
});