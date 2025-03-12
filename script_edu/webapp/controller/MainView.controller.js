sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], (Controller, MessageToast, JSONModel) => {
    "use strict";

    return Controller.extend("sync6.cl1.scriptedu.controller.MainView", {
        onInit() {
            // Make OData
            let oData = {

                Btntext: "OData text",
                Btnicon: "sap-icon://action",

                gs_input: {
                    Intext: "OData input",
                    Inholder: "OData place holder"
                },
                gs_label: {
                    Latext: "OData label"
                }
            }

            let gs_change = {
                Btext: "Change width",
                Bicon: "sap-icon://journey-change"
            }

            let oData2 = {

                BtnText : "Confirm",
                BtnWidth : "150px",
                BtnIcon : "sap-icon://flight"

            }

            // Get Model
            let oModel = new JSONModel(oData);
            let oModel2 = new JSONModel(gs_change);
            let oModel3 = new JSONModel("json/student.json");
            let oModel4 = new JSONModel(oData2);

            // Bind Model
            this.getView().setModel(oModel);
            this.getView().setModel(oModel2, "button");
            this.getView().setModel(oModel3, "student");
            this.getView().setModel(oModel4, "confirm");

        },

        onFruits() {

            // View에서 입력한 값을 받아온다.
            let vWord = this.getView().byId("word").getValue();
            let vFruits;

            //입력받은 값으로 과일 이름을 출력
            switch (vWord) {
                case "A":
                    vFruits = "Apple";
                    break;
                case "B":
                    vFruits = "Banana";
                    break;
                case "O":
                    vFruits = "Orange";
                    break;
                default:
                    vFruits = "Please enter valid code";
                    break;
            }

            MessageToast.show(vFruits);
        },

        onAdd() {

            let vNum1 = this.getView().byId("num1").getValue();
            let vNum2 = this.getView().byId("num2").getValue();
            let vResult = parseInt(vNum1) + parseInt(vNum2);
            let vIn1 = this.getView().byId("result1");

            vIn1.setValue(vResult);
        },

        onFor() {

            // 배열 선언
            let aData = ["A", "B", "C"];
            for (let i = 0; i < aData.length; i++) {
                console.log("aData[" + i + "] = " + aData[i]);
            }

            /* ----------------------------------------------- */
            console.log("-----------------------------------------------");
            let aArray = [
                {
                    value1: "Jongro",
                    value2: "Euljiro",
                    value3: "Gwancheol"
                },
                {
                    value1: "Gangdong",
                    value2: "Songpa",
                    value3: "Seocho"
                }
            ];
            for (const i in aArray) {
                console.log("aArray[" + i + "] = ", aArray[i]);
                console.log("index = " + i);
            }

            for (let i of aData) {
                console.log("data = " + i);
            }
        },

        onWidth() {

            // UI Component로 부터 값을 읽어온다.
            let vWidth = this.getView().byId("word").getValue();

            // 입력받은 값을 메소드에 할당한다.
            this.getView().byId("word").setWidth(vWidth + "px");
        },

        onClear() {
            let vIn1 = this.getView().byId("num1");
            let vIn2 = this.getView().byId("num2");
            let vIn3 = this.getView().byId("word");
            let vIn4 = this.getView().byId("car");
            let aArray = [vIn1, vIn2, vIn3, vIn4];

            for (let i of aArray) {
                i.setValue();
            }
        }
    });
});