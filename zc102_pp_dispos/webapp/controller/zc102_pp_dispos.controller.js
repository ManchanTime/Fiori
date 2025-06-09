sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment" // ✅ 추가
], (Controller, Fragment) => {
    "use strict";

    return Controller.extend("zc102ppdispos.zc102ppdispos.controller.zc102_pp_dispos", {
        onInit() {
            let oComponent = this.getOwnerComponent();
            let oODataModel = oComponent.getModel(); // ODataModel
            oODataModel.read("/Dispo", {
                success: (oData) => {
                    console.log(oData);

                    const oMainModel = new sap.ui.model.json.JSONModel();
                    // 메인 모델 세팅
                    this.getView().setModel(oMainModel, "mainModel");

                    // 플랜트/창고 모델 세팅
                    const uniqueMap = new Map();
                    const aResults = oData.results;
                    console.log(aResults);
                    // 1. Werks + Stlname 기준으로 플랜트 그룹핑
                    const plantMap = new Map();

                    aResults.forEach(item => {
                        const plantKey = item.Werks + "|" + item.Stlname;
                        // 1. 플랜트 그룹 최초 생성
                        if (!plantMap.has(plantKey)) {
                            plantMap.set(plantKey, {
                                Werks: item.Werks,
                                Stlname: item.Stlname,
                                Name: `${item.Stlname} (${item.Werks})`,  // ✅ 여기!
                                nodes: []
                            });
                        }
                        // 2. 플랜트 하위 자재 추가 (중복 방지)
                        const materialKey = item.Matnr;
                        const plant = plantMap.get(plantKey);
                        if (!plant.nodes.some(node => node.Matnr === materialKey)) {
                            plant.nodes.push({
                                Matnr: item.Matnr,
                                Maktx: item.Maktx,
                                Name: `${item.Matnr} ${item.Maktx}`,
                                Werks: item.Werks,
                                Stlname: item.Stlname,
                                Disda: item.Disda,
                                Perdi: item.Perdi,
                                Disme: item.Disme,
                                Total: (item.Disme / (item.Perdi / 100)),
                                ReasonText: item.Resontext
                            });
                        }
                    });

                    // 3. 오름차순 정렬
                    const treeData = Array.from(plantMap.values()).sort((a, b) => a.Werks.localeCompare(b.Werks));
                    treeData.forEach(plant => {
                        plant.nodes.sort((a, b) => a.Matnr.localeCompare(b.Matnr));
                    });

                    // 4. 모델 생성 및 바인딩
                    const oTreeModel = new sap.ui.model.json.JSONModel({ PlantTree: treeData });
                    this.getView().setModel(oTreeModel, "treeModel");
                    console.log(oTreeModel);

                    setTimeout(() => {
                        const oSmartFilterBar = this.byId("smartFilterBar");
                        const oTree = this.byId("plantTree");
                        const oFirstItem = oTree.getItems()[0];
                        const oCtx = oFirstItem.getBindingContext("treeModel");
                        const oData = oCtx.getObject(); // ⬅️ 초기 Werks 정보
                        let oChartModel = new sap.ui.model.json.JSONModel();
                        let oDonutChartModel = new sap.ui.model.json.JSONModel();
                        let oDonutTotalModel = new sap.ui.model.json.JSONModel();
                        let oDonutReasonModel = new sap.ui.model.json.JSONModel();
                        let oLogModel = new sap.ui.model.json.JSONModel();
                        this.getView().setModel(oChartModel, "chartModel");
                        this.getView().setModel(oDonutChartModel, "donutModel");
                        this.getView().setModel(oDonutTotalModel, "donutTotalModel");
                        this.getView().setModel(oDonutReasonModel, "donutReasonModel");
                        this.getView().setModel(oLogModel, "logModel");
                        this._setChartModel(oData);
                        this._setMatnrDonutChart(oData);
                        this._setReasonDonutChart(oData);
                        this._setLogData(oData);

                        if (oSmartFilterBar && oSmartFilterBar.search) {
                            this.onTreeItemPress({ getParameter: () => oFirstItem });
                        }
                    }, 200);
                }
            })
        },

        _setChartModel(oData) {
            const chartRawMap = new Map();
            const yearSet = new Set();
            const allMonths = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
            console.log("데이터", oData);
            // Step 1: 원본 데이터를 연도-월-자재 기준으로 저장
            oData.nodes.forEach(node => {
                const date = new Date(node.Disda);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                const yearMonth = `${year}-${month}`;
                const matnr = node.Matnr;
                const maktx = node.Maktx;
                const perdi = parseFloat(node.Perdi || 0);

                yearSet.add(year);

                const key = `${year}|${month}|${matnr}`;
                if (!chartRawMap.has(key)) {
                    chartRawMap.set(key, {
                        YearMonth: yearMonth,
                        Month: month,
                        Year: year,
                        Matnr: matnr,
                        Maktx: maktx,
                        TotalPerdi: 0
                    });
                }
                chartRawMap.get(key).TotalPerdi += perdi;
            });

            // Step 2: 자재 리스트 만들기
            const materialMap = new Map();
            oData.nodes.forEach(node => {
                materialMap.set(node.Matnr, node.Maktx);
            });

            // Step 3: 누락 월 채우기
            const chartData = [];

            yearSet.forEach(year => {
                materialMap.forEach((maktx, matnr) => {
                    allMonths.forEach(month => {
                        const key = `${year}|${month}|${matnr}`;
                        if (chartRawMap.has(key)) {
                            chartData.push(chartRawMap.get(key));
                        } else {
                            chartData.push({
                                YearMonth: `${year}-${month}`,
                                Month: month,
                                Year: year,
                                Matnr: matnr,
                                Maktx: maktx,
                                TotalPerdi: 0
                            });
                        }
                    });
                });
            });

            const oChartModel = this.getView().getModel("chartModel");
            oChartModel.setData({
                MonthlyPlantMaterialPerdi: chartData
            });
            this.getView().setModel(oChartModel, "chartModel");
            console.log(oChartModel);
        },

        // 도넛 차트 데이터 -> 자재 별 폐기율 도넛 차트 데이터
        _setMatnrDonutChart(oData) {
            console.log("도넛 데이터 베이스", oData);
            const aggregateMap = new Map();

            const nodes = oData.nodes;
            if (!Array.isArray(nodes)) {
                console.warn("❌ oData.nodes가 배열이 아님:", nodes);
                return;
            }

            // 📊 자재별 집계
            nodes.forEach(node => {
                const matnr = node.Matnr;
                const maktx = node.Maktx;
                const perdi = parseFloat(node.Perdi || 0);
                const disme = parseInt(node.Disme || 0);
                const total = parseFloat(node.Total || 0);

                if (!aggregateMap.has(matnr)) {
                    aggregateMap.set(matnr, {
                        Matnr: matnr,
                        Maktx: maktx,
                        TotalPerdi: 0,
                        TotalDisme: 0,
                        Total: 0
                    });
                }

                const entry = aggregateMap.get(matnr);
                entry.TotalPerdi += isNaN(perdi) ? 0 : perdi;
                entry.TotalDisme += isNaN(disme) ? 0 : disme;
                entry.Total += isNaN(total) ? 0 : total;
            });

            // 📈 정제 데이터 구성
            const result = [];
            aggregateMap.forEach(entry => {
                const ratio = entry.Total > 0
                    ? parseFloat(((entry.TotalPerdi / entry.Total) * 100).toFixed(2))
                    : 0;

                result.push({
                    Matnr: entry.Matnr,
                    Maktx: entry.Maktx,
                    TotalPerdi: entry.TotalPerdi,
                    TotalDisme: entry.TotalDisme,
                    Total: entry.Total,
                    PerdiRatio: ratio
                });
            });

            console.log("✅ 도넛 차트용 정제 데이터:", result);

            const oModel = this.getView().getModel("donutModel");
            if (oModel) {
                oModel.setProperty("/DonutChartData", result);

                const oVizFrame = this.byId("idDonutChart");

                // 1. FlattenedDataset 재정의
                const oDataset = new sap.viz.ui5.data.FlattenedDataset({
                    dimensions: [{
                        name: "자재", // ⚠️ 반드시 feed와 일치
                        value: "{Maktx}"
                    }],
                    measures: [{
                        name: "총 불량률(%)", // ⚠️ 반드시 feed와 일치
                        value: "{PerdiRatio}"
                    }],
                    data: {
                        path: "/DonutChartData"
                    }
                });

                // 2. Dataset 및 Model 다시 세팅
                oVizFrame.setDataset(oDataset);
                oVizFrame.setModel(oModel);

                if (oVizFrame) {
                    oVizFrame.setVizProperties({
                        title: { text: "자재별 전체 폐기율(%)" },
                        legend: { isVisible: true },
                        plotArea: { dataLabel: { visible: true, type: "percentage" } }
                    });
                    oVizFrame.removeAllFeeds();
                    oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                        uid: "size", type: "Measure", values: ["총 불량률(%)"]
                    }));
                    oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                        uid: "color", type: "Dimension", values: ["자재"]
                    }));
                }
            }
        },

        _setMonthlyDonutChart(oData) {
            console.log("도넛 데이터 베이스", oData);

            const nodes = oData.nodes;
            if (!Array.isArray(nodes)) {
                console.warn("❌ oData.nodes가 배열이 아님:", nodes);
                return;
            }

            // 🔄 자재별 월별 폐기율 집계
            const monthlyMap = new Map();
            nodes.forEach(node => {
                const matnr = node.Matnr;
                const maktx = node.Maktx;
                const perdi = parseFloat(node.Perdi || 0);
                const date = new Date(node.Disda);
                const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월만 추출

                const key = `${matnr}_${month}`;
                if (!monthlyMap.has(key)) {
                    monthlyMap.set(key, {
                        Matnr: matnr,
                        Maktx: maktx,
                        Month: month,
                        PerdiSum: 0,
                        Count: 0
                    });
                }

                const entry = monthlyMap.get(key);
                entry.PerdiSum += isNaN(perdi) ? 0 : perdi;
                entry.Count += 1;
            });

            // 📊 평균 계산
            const result = [];
            monthlyMap.forEach(entry => {
                const avgPerdi = entry.Count > 0 ? (entry.PerdiSum / entry.Count).toFixed(1) : 0;
                result.push({
                    Matnr: entry.Matnr,
                    Maktx: entry.Maktx,
                    Month: entry.Month,
                    PerdiRatio: parseFloat(avgPerdi)
                });
            });

            console.log("✅ 도넛용 정제 데이터:", result);

            // 📦 모델 세팅
            const oModel = this.getView().getModel("donutModel");
            if (oModel) {
                oModel.setProperty("/DonutChartData", result);
            }

            // 📈 차트 설정
            const oVizFrame = this.byId("idDonutChart");
            if (oVizFrame && oModel) {
                // ✅ 1. 동적 FlattenedDataset 구성
                const oDataset = new sap.viz.ui5.data.FlattenedDataset({
                    dimensions: [{
                        name: "월",
                        value: "{Month}"
                    }],
                    measures: [{
                        name: "폐기율",
                        value: "{PerdiRatio}"
                    }],
                    data: {
                        path: "/DonutChartData"
                    }
                });

                oVizFrame.setModel(oModel);
                oVizFrame.setDataset(oDataset);

                // ✅ 2. 차트 옵션 설정
                oVizFrame.setVizProperties({
                    title: { text: "월별 자재 폐기율(%)" },
                    legend: { isVisible: true },
                    plotArea: { dataLabel: { visible: true, type: "percentage" } }
                });

                oVizFrame.removeAllFeeds();

                oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                    uid: "size",
                    type: "Measure",
                    values: ["폐기율"]
                }));

                oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                    uid: "color",
                    type: "Dimension",
                    values: ["월"]
                }));
            }
        },

        // 도넛 차트 데이터 -> 원인 별 총 폐기량량
        _setReasonDonutChart(oData) {
            console.log(oData);
            const reasonMap = new Map();

            oData.nodes.forEach(item => {
                const reason = item.ReasonText || "기타";
                const disme = parseInt(item.Disme || 0);

                if (!reasonMap.has(reason)) {
                    reasonMap.set(reason, {
                        Reason: reason,
                        TotalDisme: 0
                    });
                }

                reasonMap.get(reason).TotalDisme += isNaN(disme) ? 0 : disme;
            });

            const result = Array.from(reasonMap.values());
            console.log("📊 원인별 폐기량 도넛 차트 데이터:", result);

            const oModel = this.getView().getModel("donutReasonModel");
            if (oModel) {
                oModel.setProperty("/DonutChartData", result);
                console.log(oModel);
            }
        },

        _setLogDataLeaf(oData) {
            console.log(oData);
            const nodes = oData.nodes || [];
            let totalPerdi = 0;
            let totalCount = 0;
            let worstItem = null;
            let maxPerdi = -1;
            const oModel = this.getView().getModel("logModel");

            // 1. 전체 평균 폐기율 계산 + 가장 폐기율 높은 자재 추출
            nodes.forEach(node => {
                const perdi = parseFloat(node.Perdi || 0);
                if (!isNaN(perdi)) {
                    totalPerdi += perdi;
                    totalCount += 1;
                    if (perdi > maxPerdi) {
                        maxPerdi = perdi;
                        worstItem = node;
                    }
                }
            });

            const avgPerdi = totalCount > 0 ? (totalPerdi / totalCount).toFixed(1) : 0;
            const worstMaterialName = worstItem?.Maktx || "데이터 없음";
            const targetMatnr = worstItem?.Matnr;

            // 2. 해당 자재 기준으로 월별 평균 Perdi 집계
            const perdiByMonth = {};
            nodes.forEach(node => {
                if (node.Matnr !== targetMatnr) return;

                const perdi = parseFloat(node.Perdi || 0);
                if (isNaN(perdi)) return;

                const date = new Date(node.Disda);
                const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;

                if (!perdiByMonth[yearMonth]) {
                    perdiByMonth[yearMonth] = { total: 0, count: 0 };
                }

                perdiByMonth[yearMonth].total += perdi;
                perdiByMonth[yearMonth].count += 1;
            });

            // 3. 가장 높은 평균 폐기율이 발생한 월 찾기 (월만 추출)
            let worstMonth = null;
            let worstMonthPerdi = -1;

            for (const [month, data] of Object.entries(perdiByMonth)) {
                const avg = data.total / data.count;
                if (avg > worstMonthPerdi) {
                    worstMonthPerdi = avg;

                    // 📌 "YYYY-MM" → "MM"만 추출
                    worstMonth = month.split("-")[1];
                }
            }

            // 4. 최근 2개월 증감 계산
            const sortedMonths = Object.keys(perdiByMonth).sort();
            const lastMonth = sortedMonths[sortedMonths.length - 2];
            const thisMonth = sortedMonths[sortedMonths.length - 1];
            const lastPerdi = lastMonth ? (perdiByMonth[lastMonth].total / perdiByMonth[lastMonth].count).toFixed(1) : 0;
            const thisPerdi = thisMonth ? (perdiByMonth[thisMonth].total / perdiByMonth[thisMonth].count).toFixed(1) : 0;

            const diff = (thisPerdi - lastPerdi).toFixed(1);
            const arrow = diff > 0 ? "▲" : diff < 0 ? "▼" : "-";
            const absDiff = Math.abs(diff);

            // 5. KPI 모델 구성
            const result = {
                items: [
                    {
                        Name1: "평균 폐기율",
                        Rate: avgPerdi + " %",
                        highlight: "Success",
                        type: "Active"
                    },
                    {
                        Name1: `${worstMonth}월에 가장 높은 폐기율`,
                        Rate: `${worstMonthPerdi.toFixed(1)} %`,
                        highlight: "Warning",
                        type: "Active"
                    },
                    {
                        Name1: `전월 대비 폐기율 변화`,
                        Rate: `${arrow} ${absDiff}%`,
                        highlight: "Information",
                        type: "Active"
                    }
                ]
            };

            // 6. 모델 세팅
            if (oModel) {
                oModel.setData(result);
                console.log("📊 logModel에 세팅된 KPI 데이터:", oModel);
            }
        },

        _setLogData(oData) {
            console.log(oData);
            const nodes = oData.nodes || [];
            let totalDisme = 0;
            let totalProduced = 0;
            let totalPerdi = 0;
            let worstItem = null;
            let maxPerdi = -1;
            const oModel = this.getView().getModel("logModel");

            // 1. 전체 누적 계산 + 최대 Perdi 자재 추출
            nodes.forEach(node => {
                const disme = parseFloat(node.Disme || 0);
                const total = parseFloat(node.Total || 0);
                const perdi = parseFloat(node.Perdi || 0);

                totalDisme += disme;
                totalProduced += isNaN(total) ? 0 : total;
                totalPerdi += isNaN(perdi) ? 0 : perdi;

                if (!isNaN(perdi) && perdi > maxPerdi) {
                    maxPerdi = perdi;
                    worstItem = node;
                }
            });

            const worstMaterialName = worstItem?.Maktx || "데이터 없음";
            const targetMatnr = worstItem?.Matnr;

            // 2. 해당 자재의 월별 평균 Perdi 계산
            const perdiByMonth = {};
            nodes.forEach(node => {
                if (node.Matnr !== targetMatnr) return;

                const perdi = parseFloat(node.Perdi || 0);
                if (isNaN(perdi)) return;

                const date = new Date(node.Disda);
                const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;

                if (!perdiByMonth[yearMonth]) {
                    perdiByMonth[yearMonth] = { total: 0, count: 0 };
                }
                perdiByMonth[yearMonth].total += perdi;
                perdiByMonth[yearMonth].count += 1;
            });

            // 3. 최근 2개월 기준 비교
            const sortedMonths = Object.keys(perdiByMonth).sort(); // YYYY-MM 오름차순
            const lastMonth = sortedMonths[sortedMonths.length - 2];
            const thisMonth = sortedMonths[sortedMonths.length - 1];

            const lastPerdi = lastMonth ? (perdiByMonth[lastMonth].total / perdiByMonth[lastMonth].count).toFixed(1) : 0;
            const thisPerdi = thisMonth ? (perdiByMonth[thisMonth].total / perdiByMonth[thisMonth].count).toFixed(1) : 0;

            const diff = (thisPerdi - lastPerdi).toFixed(1);
            const arrow = diff > 0 ? "▲" : diff < 0 ? "▼" : "-";
            const absDiff = Math.abs(diff);

            // 4. KPI 세팅
            const totalRate = totalProduced > 0
                ? ((totalDisme / totalProduced) * 100).toFixed(1)
                : 0;

            const avgPerdi = nodes.length > 0
                ? (totalPerdi / nodes.length).toFixed(1)
                : 0;

            const result = {
                items: [
                    {
                        Name1: "전체 폐기율",
                        Rate: totalRate + " %",
                        highlight: "Success",
                        type: "Active"
                    },
                    {
                        Name1: "평균 폐기율",
                        Rate: avgPerdi + " %",
                        highlight: "Success",
                        type: "Active"
                    },
                    {
                        Name1: `${worstMaterialName}에서 가장 높은 폐기율이 발생`,
                        Rate: `(${arrow} ${absDiff}%)`,
                        highlight: "Warning",
                        type: "Active"
                    }
                ]
            };

            // 5. 모델 세팅
            if (oModel) {
                oModel.setData(result);
                console.log("📊 logModel에 세팅된 KPI 데이터:", oModel);
            }
        },

        onTreeItemPress(oEvent) {
            const oCtx = oEvent.getParameter("listItem").getBindingContext("treeModel");
            const oData = oCtx.getObject();
            const oSmartFilterBar = this.byId("smartFilterBar");

            let sName;
            if (oData.Matnr) {
                sName = oData.Stlname + " - " + oData.Maktx + " 폐기 정보";
            } else {
                sName = oData.Stlname + " 상품 폐기 정보";
            }

            this.byId("disposTable").setHeader(sName);

            const oFilterData = {
                Werks: oData.Werks // ✅ 무조건 포함
            };

            // 자재(MM) 선택된 경우에만 추가 필터 적용
            if (oData.Matnr) {
                oFilterData.Matnr = oData.Matnr;
            }

            console.log("📦 최종 필터 데이터:", oFilterData);

            if (oSmartFilterBar) {
                oSmartFilterBar.clear();               // 🔄 기존 필터 초기화
                oSmartFilterBar.setFilterData(oFilterData); // ✅ 새 필터 설정

                // 스마트 테이블 조회 후 데이터 추출
                const oSmartTable = this.byId("disposTable");
                const oInnerTable = oSmartTable.getTable();

                const onUpdateFinished = () => {
                    const oBinding = oInnerTable.getBinding("rows") || oInnerTable.getBinding("items");
                    if (oBinding) {
                        const aContexts = oBinding.getContexts(0, Infinity); // ✅ 더 안전하게 전체 가져오기
                        const aData = aContexts.map(ctx => ctx.getObject());
                        console.log("📦 조회 완료 후 추출된 데이터:", aData);
                        console.log("데이터데이터데이터", aContexts);

                        // 차트 모델 세팅
                        const groupedData = {};

                        aData.forEach(item => {
                            const key = `${item.Werks}||${item.Stlname}`;

                            if (!groupedData[key]) {
                                groupedData[key] = {
                                    Werks: item.Werks,
                                    Stlname: item.Stlname,
                                    Name: `${item.Stlname} (${item.Werks})`,
                                    nodes: []
                                };
                            }

                            groupedData[key].nodes.push({
                                Matnr: item.Matnr,
                                Maktx: item.Maktx,
                                Name: `${item.Matnr} ${item.Maktx}`,
                                Perdi: item.Perdi,
                                Disda: item.Disda,
                                Werks: item.Werks,
                                Stlname: item.Stlname,
                                Disme: item.Disme,
                                Total: (item.Disme / (item.Perdi / 100)),
                                ReasonText: item.Resontext
                            });
                        });

                        // 최종 변환된 배열
                        const result = Object.values(groupedData);
                        console.log("📦 변환된 데이터 구조:", result);

                        this._setChartModel(result[0]);
                        // 리프 노드라면 차트 다르게 세팅
                        if (oData.nodes) {
                            this._setMatnrDonutChart(result[0]);
                            this._setLogData(result[0]);
                        } else {
                            this._setLogDataLeaf(result[0]);
                            this._setMonthlyDonutChart(result[0]);
                        }
                        this._setReasonDonutChart(result[0]); // ✅ 여기에 새 함수 추가

                        // 한 번만 실행 후 이벤트 제거
                        oInnerTable.detachEvent("updateFinished", onUpdateFinished);
                    }
                };
                // 이벤트 등록
                oInnerTable.attachEvent("updateFinished", onUpdateFinished);

                oSmartFilterBar.search();              // 🔍 검색 실행
            }
        },

        onRowPress: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const oData = oContext.getObject();

            // 기본 Dialog 모델 세팅
            const oDialogModel = new sap.ui.model.json.JSONModel({ selectedRow: oData });
            this.getView().setModel(oDialogModel, "dialogModel");

            // 도넛 차트용 데이터 생성
            const perdi = parseFloat(oData.Perdi || 0); // 불량률
            const donutData = [
                { Name1: "불량", Wrbtr: perdi },
                { Name1: "정상", Wrbtr: 100 - perdi }
            ];
            const oLogModel = new sap.ui.model.json.JSONModel({ donut: donutData });
            this.getView().setModel(oLogModel, "detailLogModel");

            const sFragmentId = this.getView().getId(); // 예: "zc102ppdispos--View1"

            if (!this._oDialog) {
                Fragment.load({
                    id: sFragmentId,
                    name: "zc102ppdispos.zc102ppdispos.view.RowDetailDialog",
                    controller: this
                }).then(oDialog => {
                    this._oDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.open();

                    // ✅ Fragment 로드된 이후에 Popover 연결
                    const oVizFrame = Fragment.byId(sFragmentId, "idDonutFrame");
                    const oPopover = Fragment.byId(sFragmentId, "idPopOverDonut");

                    if (oVizFrame && oPopover) {
                        oPopover.connect(oVizFrame.getVizUid());
                    }
                });
            } else {
                this._oDialog.open();

                // ✅ 기존 Fragment일 경우에도 Popover 연결 시도
                const oVizFrame = Fragment.byId(sFragmentId, "idDonutFrame");
                const oPopover = Fragment.byId(sFragmentId, "idPopOverDonut");

                if (oVizFrame && oPopover) {
                    oPopover.connect(oVizFrame.getVizUid());
                }
            }
        },

        onCloseDialog: function () {
            if (this._oDialog) {
                this._oDialog.close();
            }
        },

        onDonutSelect: function (oEvent) {
            const aData = oEvent.getParameter("data");
            if (aData && aData.length > 0) {
                const selected = aData[0].data;
                sap.m.MessageToast.show(`선택: ${selected.Name1} (${selected.Wrbtr}%)`);
            }
        },

        // 차트 모드 변경
        onChartTypeChange: function (oEvent) {
            const sSelectedType = oEvent.getSource().getSelectedKey(); // "line" or "column"
            const oVizFrame = this.byId("idLineFrame");

            // 1. 차트 타입 변경
            oVizFrame.setVizType(sSelectedType);

            // 2. 기존 Feed 제거
            oVizFrame.removeAllFeeds();

            // 3. 현재 데이터 구조 기준으로 Feed 재설정
            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "valueAxis",
                type: "Measure",
                values: ["불량률(%)"]
            }));
            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "categoryAxis",
                type: "Dimension",
                values: ["월"]
            }));
            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "color",
                type: "Dimension",
                values: ["자재"]
            }));
        },

    });
});