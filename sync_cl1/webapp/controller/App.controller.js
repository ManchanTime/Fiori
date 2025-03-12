sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("sync.cl1.synccl1.controller.App", {
    onInit() {
      // 테이블 컬럼 객체 가져오기
      let oColumn = this.getView().byId("myColumnId");
      // console.log(oColumn);
      // // 열이 렌더링되어 있고 autoResize 기능이 지원되면 실행
      // // if (oColumn) {

      // //   oColumn.autoResizeColumn();
      // // }
    }
  });
});