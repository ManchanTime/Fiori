sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("sync6.cl1.uitable.controller.AirView", {
        onInit() {

            let AirlineSRV = { // Service ID

                AirlineSet: [ // EntitySet

                    {
                        Carrid: "AA",
                        Carrname: "America airline",
                        Url: "http://www.aa.com"
                    },
                    {
                        Carrid: "LH",
                        Carrname: "Luft Hanza",
                        Url: "http://lufthanza.com"
                    },
                    {
                        Carrid: "KA",
                        Carrname: "Korean air",
                        Url: "http://koreanair.co.kr"
                    }

                ],

                ScheduleSet : [
                    {
                        Carrid : "AA",
                        Connid : "0100",
                        Cityfrom : "NEW YORK"
                    },

                    {
                        Carrid : "AA",
                        Connid : "0101",
                        Cityfrom : "LA"
                    },
                ]

            }

            let oModel = new JSONModel(AirlineSRV);
            let oModel2 = new JSONModel("/json/airline.json");
            this.getView().setModel(oModel);
            this.getView().setModel(oModel2, "airline");

        }
    });
});