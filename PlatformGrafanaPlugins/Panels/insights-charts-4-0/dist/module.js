define(["@grafana/data","@grafana/runtime","@grafana/ui","emotion","jquery","lodash","react"], (__WEBPACK_EXTERNAL_MODULE__grafana_data__, __WEBPACK_EXTERNAL_MODULE__grafana_runtime__, __WEBPACK_EXTERNAL_MODULE__grafana_ui__, __WEBPACK_EXTERNAL_MODULE_emotion__, __WEBPACK_EXTERNAL_MODULE_jquery__, __WEBPACK_EXTERNAL_MODULE_lodash__, __WEBPACK_EXTERNAL_MODULE_react__) => { return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./CustomFieldSelectEditor.tsx":
/*!*************************************!*\
  !*** ./CustomFieldSelectEditor.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomFieldSelectEditor: () => (/* binding */ CustomFieldSelectEditor)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var models_ChartModel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! models/ChartModel */ "./models/ChartModel.ts");
/* harmony import */ var models_InsightsChartEditorModel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! models/InsightsChartEditorModel */ "./models/InsightsChartEditorModel.ts");
/* harmony import */ var GoogleChartUtilities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! GoogleChartUtilities */ "./GoogleChartUtilities.tsx");
var _br, _label, _label2, _label3, _div, _div2, _div3;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var CustomFieldSelectEditor = function CustomFieldSelectEditor(_ref) {
  var item = _ref.item,
    value = _ref.value,
    onChange = _ref.onChange,
    context = _ref.context;
  var theme = (0,_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.useTheme2)();
  var chartEditor;
  var google = window.google;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState2 = _slicedToArray(_useState, 2),
    dataTransform = _useState2[0],
    setDataTransform = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState4 = _slicedToArray(_useState3, 2),
    dataJoin = _useState4[0],
    setDataJoin = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    chartOptions = _useState6[0],
    setChartOptions = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    chartType = _useState8[0],
    setChartType = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState10 = _slicedToArray(_useState9, 2),
    columnModel = _useState10[0],
    setColumnModel = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState12 = _slicedToArray(_useState11, 2),
    chartDataArray = _useState12[0],
    setChartDataArray = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    enableTrend = _useState14[0],
    setEnableTrend = _useState14[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (context.options.hasOwnProperty("chartFields")) {
      setChartValue();
      var _iterator = _createForOfIteratorHelper(context.data),
        _step;
      try {
        var _loop = function _loop() {
          var dt = _step.value;
          var refId = dt.refId || "";
          var columnModelArr = [];
          var _iterator2 = _createForOfIteratorHelper(dt.fields),
            _step2;
          try {
            var _loop2 = function _loop2() {
              var field = _step2.value;
              var columnModelObj = void 0;
              columnModelObj = columnModel.find(function (o) {
                return o.name === field.name && o.refId === refId;
              });
              columnModelArr.push(columnModelObj);
            };
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              _loop2();
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          var chartDataObjIndx = chartDataArray.findIndex(function (obj) {
            return obj.id === refId;
          });
          if (chartDataObjIndx !== -1) {
            chartDataArray[chartDataObjIndx].data = context.data;
            chartDataArray[chartDataObjIndx].columns = columnModelArr;
          } else {
            chartDataArray.push(new models_ChartModel__WEBPACK_IMPORTED_MODULE_4__.ChartData(refId, context.data, columnModelArr));
          }
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      setChartDataArray(chartDataArray);
    }
    function setChartValue() {
      if ('chartOptions' in context.options.chartFields) {
        setChartOptions(context.options.chartFields.chartOptions);
      }
      if ('chartType' in context.options.chartFields) {
        setChartType(context.options.chartFields.chartType);
      }
      if ('joinInstructions' in context.options.chartFields) {
        setDataJoin(context.options.chartFields.joinInstructions);
      }
      if ('transformDataInstruction' in context.options.chartFields) {
        setDataTransform(context.options.chartFields.transformDataInstruction);
      }
      if ('columnModel' in context.options.chartFields) {
        setColumnModel(context.options.chartFields.columnModel);
      }
      if ('enableTrend' in context.options.chartFields) {
        setEnableTrend(context.options.chartFields.enableTrend);
      } else {
        setColumnModel([new models_ChartModel__WEBPACK_IMPORTED_MODULE_4__.ColumnModel("", "")]);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  var onDataTransformChange = function onDataTransformChange(index) {
    return function (event) {
      setDataTransform(event.currentTarget.value);
      onChange(_extends({}, value, {
        transformDataInstruction: event.currentTarget.value
      }));
    };
  };
  var onDataJoinChange = function onDataJoinChange(index) {
    return function (event) {
      setDataJoin(event.currentTarget.value);
      onChange(_extends({}, value, {
        joinInstructions: event.currentTarget.value
      }));
    };
  };
  var onChartOptionsChange = function onChartOptionsChange(index) {
    return function (event) {
      setChartOptions(event.currentTarget.value);
      onChange(_extends({}, value, {
        chartOptions: event.currentTarget.value
      }));
    };
  };
  var onEnableTrendChange = function onEnableTrendChange(index) {
    return function () {
      setEnableTrend(function (prev) {
        return !prev;
      });
      onChange(_extends({}, value, {
        enableTrend: !enableTrend
      }));
    };
  };
  var onColumnModelChange = function onColumnModelChange(columnName, refId) {
    return function (option) {
      var i = columnModel.findIndex(function (element) {
        return element.name === columnName && element.refId === refId;
      });
      if (i > -1) {
        columnModel[i].type = option.value;
      } else {
        columnModel.push(new models_ChartModel__WEBPACK_IMPORTED_MODULE_4__.ColumnModel(columnName, option.value, refId));
      }
      var filterColModel = [];
      var _iterator3 = _createForOfIteratorHelper(context.data),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var dt = _step3.value;
          var _iterator4 = _createForOfIteratorHelper(dt.fields),
            _step4;
          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var field = _step4.value;
              filterColModel.push({
                "refId": dt.refId,
                "label": field.name
              });
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      var filteredList = columnModel.filter(function (el) {
        return filterColModel.some(function (f) {
          return f.refId === el.refId && f.label === el.name;
        });
      });
      setColumnModel(filteredList);
      onChange(_extends({}, value, {
        columnModel: filteredList
      }));
    };
  };
  var _googlechartutilities = (0,GoogleChartUtilities__WEBPACK_IMPORTED_MODULE_6__.googlechartutilities)(theme, dataTransform, dataJoin, google, true),
    buildDataTables = _googlechartutilities.buildDataTables,
    joinDataTables = _googlechartutilities.joinDataTables,
    transformData = _googlechartutilities.transformData,
    innerDimensions = _googlechartutilities.innerDimensions,
    applyTheme = _googlechartutilities.applyTheme;
  var renderChart = function renderChart(isEditChart) {
    if (context.data && context.data.length > 0) {
      var containerElem = document.getElementById("googleId");
      if (containerElem && google && google.charts) {
        if (isEditChart) {
          google.charts.load('46', {
            'packages': ['corechart', 'charteditor']
          });
          google.charts.setOnLoadCallback(executeEditChart());
        } else {
          if (chartOptions) {
            google.charts.load('46', {
              'packages': ['corechart']
            });
          }
        }
      } else {
        setTimeout(function () {
          renderChart(isEditChart);
        }, 50);
      }
    }
  };
  var saveChartOpts = function saveChartOpts() {
    var opts = document.getElementById("chartsOptId").value;
    setChartOptions(opts);
    onChange(_extends({}, value, {
      chartOptions: opts
    }));
  };
  var executeEditChart = function executeEditChart() {
    var data = buildChartData();
    var _buildChartOptions = buildChartOptions(),
      defchartOptions = _buildChartOptions.defchartOptions,
      contId = _buildChartOptions.contId,
      contIdView = _buildChartOptions.contIdView;
    var wrapper = new google.visualization.ChartWrapper({
      'chartType': chartType,
      'dataTable': data,
      'options': defchartOptions
    });
    chartEditor = new google.visualization.ChartEditor();
    var redrawChart = function redrawChart() {
      var _document$getElementB, _document$getElementB2;
      var chartWrapperTemp = chartEditor.getChartWrapper();
      var editorChartOptions = chartWrapperTemp.getOptions();
      var containerDimTemp = innerDimensions((_document$getElementB = document.getElementById(contId)) === null || _document$getElementB === void 0 ? void 0 : (_document$getElementB2 = _document$getElementB.parentNode) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.parentNode);
      var tempOptions = chartWrapperTemp.getOptions();
      tempOptions["height"] = containerDimTemp.height;
      tempOptions["width"] = containerDimTemp.width;
      tempOptions = lodash__WEBPACK_IMPORTED_MODULE_3___default().defaults(tempOptions, editorChartOptions);
      setChartOptions(JSON.stringify(tempOptions));
      onChange(_extends({}, value, {
        chartOptions: JSON.stringify(tempOptions)
      }));
      setChartType(chartWrapperTemp.getChartType());
      onChange(_extends({}, value, {
        chartType: chartWrapperTemp.getChartType()
      }));
      setTimeout(function () {
        chartWrapperTemp.draw(document.getElementById(contId), tempOptions);
      }, 2000);
      var viewElement = document.getElementById(contIdView);
      if (viewElement !== null) {
        var _document$getElementB3, _document$getElementB4;
        var chartWrapperview = chartEditor.getChartWrapper();
        var containerDimView = innerDimensions((_document$getElementB3 = document.getElementById(contId)) === null || _document$getElementB3 === void 0 ? void 0 : (_document$getElementB4 = _document$getElementB3.parentNode) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.parentNode);
        var tempViewOptions = tempOptions;
        tempViewOptions["height"] = containerDimView.height;
        tempViewOptions["width"] = containerDimView.width;
        setChartOptions(JSON.stringify(tempViewOptions));
        onChange(_extends({}, value, {
          chartOptions: JSON.stringify(tempViewOptions)
        }));
        setChartType(chartWrapperview.getChartType());
        onChange(_extends({}, value, {
          chartType: chartWrapperview.getChartType()
        }));
        chartWrapperview.draw(viewElement, tempViewOptions);
      }
      chartEditor.openDialog(chartEditor.getChartWrapper(), {});
      appendChartContainer();
    };
    chartEditor.openDialog(wrapper, {});
    appendChartContainer();
    google.visualization.events.addListener(chartEditor, 'ok', redrawChart);
    google.visualization.events.addListener(chartEditor, 'cancel', function () {
      jquery__WEBPACK_IMPORTED_MODULE_2___default()('#googleId').empty();
    });
    function buildChartOptions() {
      var _document$getElementB5, _document$getElementB6;
      if (chartType === null || chartType === undefined) {
        setChartType('PieChart');
      }
      var defchartOptions;
      if (chartOptions === undefined || chartOptions === "") {
        defchartOptions = {};
      } else {
        defchartOptions = JSON.parse(chartOptions);
      }
      var search = window.location.search;
      var searchParams = new URLSearchParams(search);
      var panelId = searchParams.get("editPanel");
      var contId = "containerIdDivEdit_insights_" + panelId;
      var contIdView = "containerIdDiv_insights_" + panelId;
      var containerDim = innerDimensions((_document$getElementB5 = document.getElementById(contId)) === null || _document$getElementB5 === void 0 ? void 0 : (_document$getElementB6 = _document$getElementB5.parentNode) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.parentNode);
      defchartOptions["height"] = containerDim.height;
      defchartOptions["width"] = containerDim.width;
      defchartOptions = applyTheme(defchartOptions);
      setChartOptions(JSON.stringify(defchartOptions));
      return {
        defchartOptions: defchartOptions,
        contId: contId,
        contIdView: contIdView
      };
    }
    function buildChartData() {
      var targetModelArr = [];
      var _iterator5 = _createForOfIteratorHelper(context.data),
        _step5;
      try {
        var _loop3 = function _loop3() {
          var dt = _step5.value;
          var refId = dt.refId || "";
          var columnModelArr = [];
          var _iterator6 = _createForOfIteratorHelper(dt.fields),
            _step6;
          try {
            var _loop4 = function _loop4() {
              var field = _step6.value;
              var columnModelObj = void 0;
              columnModelObj = columnModel.find(function (o) {
                return o.name === field.name && o.refId === refId;
              });
              columnModelArr.push(columnModelObj);
            };
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              _loop4();
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
          var chartDataObjIndx = chartDataArray.findIndex(function (obj) {
            return obj.id === refId;
          });
          if (chartDataObjIndx !== -1) {
            chartDataArray[chartDataObjIndx].data = context.data;
            chartDataArray[chartDataObjIndx].columns = columnModelArr;
          } else {
            chartDataArray.push(new models_ChartModel__WEBPACK_IMPORTED_MODULE_4__.ChartData(refId, context.data, columnModelArr));
          }
          var targetModel = new models_InsightsChartEditorModel__WEBPACK_IMPORTED_MODULE_5__.InsightsChartTargetModel(refId, columnModelArr);
          targetModelArr.push(targetModel);
        };
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          _loop3();
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      setChartDataArray(chartDataArray);
      onChange(_extends({}, value, {
        dataArray: chartDataArray
      }));
      var datatab = buildDataTables(chartDataArray);
      var data = joinDataTables(datatab);
      data = transformData(data);
      return data;
    }
  };
  var appendChartContainer = function appendChartContainer() {
    var dialog = jquery__WEBPACK_IMPORTED_MODULE_2___default()('.google-visualization-charteditor-dialog');
    if (dialog.length === 0) {
      setTimeout(function () {
        appendChartContainer();
      }, 50);
    } else {
      jquery__WEBPACK_IMPORTED_MODULE_2___default()('#googleId').empty();
      dialog.children().each(function () {
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('#googleId').append(this);
      });
      jquery__WEBPACK_IMPORTED_MODULE_2___default()(".modal-dialog-title").css({
        "background-color": theme.colors.background.primary,
        "color": theme.colors.text.primary
      });
      jquery__WEBPACK_IMPORTED_MODULE_2___default()(".modal-dialog-content").css({
        "background-color": theme.colors.background.primary,
        "color": theme.colors.text.primary
      });
      dialog.hide();
    }
  };
  if (context.data && context.data.length > 0) {
    var _ret = function () {
      var selectOptions = [{
        label: 'string',
        value: 'string'
      }, {
        label: 'number',
        value: 'number'
      }, {
        label: 'boolean',
        value: 'boolean'
      }, {
        label: 'date',
        value: 'date'
      }, {
        label: 'datetime',
        value: 'datetime'
      }, {
        label: 'timeofday',
        value: 'timeofday'
      }];
      var css = "      \n      .google-visualization-charteditor-preview-td{\n        position: relative !important;\n        top: 0px;\n        left: 0px\n      }\n      #google-visualization-charteditor-panel-navigate-div{\n        width: 350px \n      }\n      .marlft{\n        margin-left:20px\n      }\n      ";
      if (context.data) {
        var itemrows = [];
        var _iterator7 = _createForOfIteratorHelper(context.data),
          _step7;
        try {
          var _loop5 = function _loop5() {
            var dt = _step7.value;
            var refId = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, dt.refId);
            var fieldItems = dt.fields.map(function (field) {
              var _columnModel$find;
              return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
                key: "".concat(dt.refId)
              }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, field.name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.Select, {
                isLoading: false,
                value: (_columnModel$find = columnModel.find(function (obj) {
                  return obj.name === field.name && obj.refId === dt.refId;
                })) === null || _columnModel$find === void 0 ? void 0 : _columnModel$find.type,
                allowCustomValue: true,
                onChange: onColumnModelChange(field.name, dt.refId || ""),
                options: selectOptions
              }));
            });
            itemrows.push(refId);
            itemrows.push(fieldItems);
          };
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            _loop5();
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
        return {
          v: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("style", null, css), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, itemrows), _br || (_br = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("br", null)), chartType === "LineChart" && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.Field, {
            label: "Enable Trend indicator"
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.Switch, {
            value: enableTrend,
            disabled: false,
            transparent: true,
            onChange: onEnableTrendChange(1)
          }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            style: {
              paddingBottom: "20px;"
            }
          }, _label || (_label = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, "Data Transformation Instructions")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.TextArea, {
            placeholder: "Data Transformation Instructions",
            cols: 10,
            value: dataTransform,
            onChange: onDataTransformChange(1),
            name: "dataTransform"
          })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            style: {
              paddingBottom: "20px;"
            }
          }, _label2 || (_label2 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, "Data Join Instructions")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.TextArea, {
            placeholder: "Data Join Instructions",
            cols: 10,
            value: dataJoin,
            onChange: onDataJoinChange(1)
          })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            style: {
              paddingBottom: "20px;"
            }
          }, _label3 || (_label3 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, "Chart Option")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.TextArea, {
            placeholder: "Chart Options",
            cols: 10,
            value: chartOptions,
            onChange: onChartOptionsChange(1),
            id: "chartsOptId"
          })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
            size: "md",
            onClick: function onClick() {
              renderChart(true);
            }
          }, "Load Chart"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
            className: "marlft",
            size: "md",
            onClick: function onClick() {
              saveChartOpts();
            }
          }, "Save Chart")), _div || (_div = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null)), _div2 || (_div2 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            id: "chartEditorContainer"
          })), _div3 || (_div3 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            id: "googleId"
          })))
        };
      }
    }();
    if (_typeof(_ret) === "object") return _ret.v;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.Select, {
    onChange: function onChange() {},
    disabled: true
  });
};

/***/ }),

/***/ "./GoogleChartUtilities.tsx":
/*!**********************************!*\
  !*** ./GoogleChartUtilities.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   googlechartutilities: () => (/* binding */ googlechartutilities)
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function googlechartutilities(theme, transformDataInstruction, joinInstructions, google, isEditor) {
  var applyTheme = function applyTheme(chartOptions) {
    var grafanaBootData = window['grafanaBootData'];
    var version = Number(grafanaBootData.settings.buildInfo.version.split(".")[0]);
    if (version >= 5) {
      var textColor = '';
      var fillColor = '';
      fillColor = theme.colors.background.primary;
      textColor = theme.colors.text.primary;
      chartOptions['backgroundColor'] = fillColor;
      var hAxis = chartOptions['hAxis'];
      if (hAxis === undefined) {
        hAxis = {};
        chartOptions['hAxis'] = hAxis;
      }
      var hTextStyle = hAxis['textStyle'];
      if (hTextStyle === undefined) {
        hTextStyle = {};
        hAxis['textStyle'] = hTextStyle;
      }
      hTextStyle['color'] = textColor;
      var legendTextStyle = chartOptions['legendTextStyle'];
      if (legendTextStyle === undefined) {
        legendTextStyle = {};
        chartOptions['legendTextStyle'] = legendTextStyle;
      }
      legendTextStyle['color'] = textColor;
      var vAxes = chartOptions['vAxes'];
      if (vAxes === undefined) {
        vAxes = [{}];
        chartOptions['vAxes'] = vAxes;
      }
      for (var v in vAxes) {
        var vAxis = vAxes[v];
        var vTextStyle = vAxis['textStyle'];
        if (vTextStyle === undefined) {
          vTextStyle = {};
          vAxis['textStyle'] = vTextStyle;
        }
        vTextStyle['color'] = textColor;
      }
    }
    return chartOptions;
  };
  var innerDimensions = function innerDimensions(node) {
    var computedStyle = getComputedStyle(node);
    var width = node.clientWidth; // width with padding
    var height = node.clientHeight; // height with padding
    height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    return {
      height: height,
      width: width
    };
  };
  var transformData = function transformData(data) {
    if (transformDataInstruction === undefined || transformDataInstruction === null || transformDataInstruction === "") {
      return data;
    } else {
      var transformDataFunc = new Function('data', transformDataInstruction);
      return transformDataFunc(data);
    }
  };
  var joinDataTables = function joinDataTables(dataTables) {
    if (dataTables && dataTables.length > 0) {
      if (joinInstructions === undefined || joinInstructions === null || joinInstructions === "") {
        return dataTables[0];
      } else {
        var joinFunc = new Function('dataTables', joinInstructions);
        return joinFunc(dataTables);
      }
    }
  };
  var buildDataTables = function buildDataTables(dataArray) {
    var dataTables = [];
    if (dataArray) {
      var _iterator = _createForOfIteratorHelper(dataArray),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var data = _step.value;
          if (data.columns) {
            var typeMapping = [];
            var _iterator2 = _createForOfIteratorHelper(data.columns),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var column = _step2.value;
                typeMapping.push({
                  label: column.name,
                  type: column.type,
                  refId: column.refId
                });
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
            dataTables.push(convertData(data.data, typeMapping));
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return dataTables;
  };
  var convertData = function convertData(dataRows, typeMapping) {
    var data = new google.visualization.DataTable();
    var _iterator3 = _createForOfIteratorHelper(typeMapping),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var column = _step3.value;
        data.addColumn(column['type'], column['label']);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    var rowArr = [];
    var dataIter = [];
    if (!isEditor) {
      dataIter = dataRows.series;
    } else {
      dataIter = dataRows;
    }
    var dataRow = [];
    var _iterator4 = _createForOfIteratorHelper(dataIter),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var refD = _step4.value;
        if (refD.refId === typeMapping[0].refId) {
          dataRow = refD;
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    for (var i = 0; i < dataRow.length; i++) {
      var row = [];
      var _iterator5 = _createForOfIteratorHelper(dataRow.fields),
        _step5;
      try {
        var _loop = function _loop() {
          var fields = _step5.value;
          var columnObj = typeMapping.find(function (o) {
            return o.label === fields.name;
          });
          if (fields.values.buffer) {
            // For Grafana version < 10.0.0
            row.push(convertToType(fields.values.buffer[i], columnObj === null || columnObj === void 0 ? void 0 : columnObj.type));
          } else {
            // For Grafana version >= 10.0.0
            row.push(convertToType(fields.values[i], columnObj === null || columnObj === void 0 ? void 0 : columnObj.type));
          }
        };
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      rowArr.push(row);
    }
    data.addRows(rowArr);
    return data;
  };
  var convertToType = function convertToType(data, type) {
    if (data === undefined || data === null) {
      return null;
    } else {
      if (type === 'string') {
        return data.toString();
      } else if (type === 'number') {
        return Number(data);
      } else if (type === 'boolean') {
        if (typeof data === 'boolean') {
          return data;
        }
        return data === "true";
      } else if (type === 'date') {
        if (typeof data === 'number') {
          var dataStr = data.toString();
          if (dataStr.length < 13) {
            var appendZeros = '0000000000000';
            data = dataStr + appendZeros.substring(0, 13 - dataStr.length);
            return new Date(Number(data));
          } else {
            return new Date(Number(data));
          }
        } else {
          return new Date(data);
        }
      } else if (type === 'datetime') {} else if (type === 'timeofday') {} else {
        throw new TypeError('Unknown Type passed.');
      }
    }
  };
  return {
    buildDataTables: buildDataTables,
    joinDataTables: joinDataTables,
    transformData: transformData,
    innerDimensions: innerDimensions,
    applyTheme: applyTheme
  };
}

/***/ }),

/***/ "./GoogleCharts.tsx":
/*!**************************!*\
  !*** ./GoogleCharts.tsx ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GoogleCharts: () => (/* binding */ GoogleCharts)
/* harmony export */ });
/* harmony import */ var _models_ChartModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/ChartModel */ "./models/ChartModel.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _GoogleChartUtilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GoogleChartUtilities */ "./GoogleChartUtilities.tsx");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }




var GoogleCharts = function GoogleCharts(_ref) {
  var chartType = _ref.chartType,
    chartOptions = _ref.chartOptions,
    transformDataInstruction = _ref.transformDataInstruction,
    joinInstructions = _ref.joinInstructions,
    container = _ref.container,
    rootId = _ref.rootId,
    data = _ref.data,
    isEdit = _ref.isEdit,
    columnModel = _ref.columnModel;
  var theme = (0,_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.useTheme2)();
  var google = window.google;
  var _googlechartutilities = (0,_GoogleChartUtilities__WEBPACK_IMPORTED_MODULE_3__.googlechartutilities)(theme, transformDataInstruction, joinInstructions, google, false),
    buildDataTables = _googlechartutilities.buildDataTables,
    joinDataTables = _googlechartutilities.joinDataTables,
    transformData = _googlechartutilities.transformData,
    innerDimensions = _googlechartutilities.innerDimensions,
    applyTheme = _googlechartutilities.applyTheme;
  var contRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  var conatinerViewId = "containerIdDiv_";
  var containerEditId = "containerIdDivEdit_";
  var resizeObserver = new ResizeObserver(function (entries) {
    drawChart();
  });
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    google.charts.load('46', {
      'packages': ['corechart', 'charteditor', 'gantt']
    });
    google.charts.setOnLoadCallback(drawChart);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps
  var drawChart = function drawChart() {
    var _parentNd;
    var chartDataArr = [];
    var _iterator = _createForOfIteratorHelper(data.series),
      _step;
    try {
      var _loop = function _loop() {
        var dt = _step.value;
        var refId = dt.refId || "";
        var columnModelArr = [];
        var _iterator2 = _createForOfIteratorHelper(dt.fields),
          _step2;
        try {
          var _loop2 = function _loop2() {
            var field = _step2.value;
            var columnModelObj = void 0;
            columnModelObj = columnModel.find(function (o) {
              return o.name === field.name && o.refId === refId;
            });
            columnModelArr.push(columnModelObj);
          };
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            _loop2();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        var chartDataObjIndx = chartDataArr.findIndex(function (obj) {
          return obj.id === refId;
        });
        if (chartDataObjIndx !== -1) {
          chartDataArr[chartDataObjIndx].data = data;
          chartDataArr[chartDataObjIndx].columns = columnModelArr;
        } else {
          chartDataArr.push(new _models_ChartModel__WEBPACK_IMPORTED_MODULE_0__.ChartData(refId, data, columnModelArr));
        }
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var dataTables = buildDataTables(chartDataArr);
    var dataTb = joinDataTables(dataTables);
    dataTb = transformData(dataTb);
    var chartOptionsObj = {};
    if (chartOptions !== undefined && chartOptions !== "") {
      chartOptionsObj = JSON.parse(chartOptions);
    }
    var parentNd;
    var container;
    if (!isEdit) {
      var _document$getElementB, _document$getElementB2;
      container = conatinerViewId + rootId;
      parentNd = (_document$getElementB = document.getElementById(container)) === null || _document$getElementB === void 0 ? void 0 : (_document$getElementB2 = _document$getElementB.parentNode) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.parentNode;
    } else {
      var _document$getElementB3, _document$getElementB4;
      container = containerEditId + rootId;
      parentNd = (_document$getElementB3 = document.getElementById(container)) === null || _document$getElementB3 === void 0 ? void 0 : (_document$getElementB4 = _document$getElementB3.parentNode) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.parentNode;
    }
    resizeObserver.observe((_parentNd = parentNd) === null || _parentNd === void 0 ? void 0 : _parentNd.parentNode);
    var chartDimensions = innerDimensions(parentNd);
    chartOptionsObj["height"] = chartDimensions.height;
    chartOptionsObj["width"] = chartDimensions.width;
    chartOptionsObj = applyTheme(chartOptionsObj);
    var wrapper = new google.visualization.ChartWrapper({
      'chartType': chartType,
      'dataTable': dataTb,
      'containerId': container,
      'options': chartOptionsObj
    });
    wrapper.draw();
  };
  var returnHtml;
  if (!isEdit) {
    returnHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
      id: conatinerViewId + rootId,
      ref: contRef
    });
  } else {
    returnHtml = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
      id: containerEditId + rootId,
      ref: contRef
    });
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", null, returnHtml);
};

/***/ }),

/***/ "./SimplePanel.tsx":
/*!*************************!*\
  !*** ./SimplePanel.tsx ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SimplePanel: () => (/* binding */ SimplePanel)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var grafana_plugin_support__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! grafana-plugin-support */ "../node_modules/grafana-plugin-support/dist/index.js");
/* harmony import */ var _GoogleCharts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GoogleCharts */ "./GoogleCharts.tsx");
/* harmony import */ var Trend__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! Trend */ "./Trend.tsx");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var SimplePanel = function SimplePanel(_ref) {
  var _options$chartFields3, _options$chartFields4, _options$chartFields5, _options$chartFields6, _options$chartFields7, _options$chartFields8, _options$chartFields9;
  var options = _ref.options,
    data = _ref.data,
    width = _ref.width,
    height = _ref.height,
    timeRange = _ref.timeRange,
    onChangeTimeRange = _ref.onChangeTimeRange,
    timeZone = _ref.timeZone,
    onOptionsChange = _ref.onOptionsChange,
    id = _ref.id;
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    trends = _useState2[0],
    setTrends = _useState2[1];
  var usage = {
    schema: [],
    url: ''
  };
  var frame = data.series[0];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var _options$chartFields, _options$chartFields2;
    var dataArray = [];
    if (data && (_options$chartFields = options.chartFields) !== null && _options$chartFields !== void 0 && _options$chartFields.enableTrend && ((_options$chartFields2 = options.chartFields) === null || _options$chartFields2 === void 0 ? void 0 : _options$chartFields2.chartType) === "LineChart") {
      data.series[0].fields.forEach(function (field) {
        if (field.type === "number") {
          var currentValue = field.values.get(field.values.length - 1);
          var previousValue = field.values.length > 1 ? field.values.get(field.values.length - 2) : currentValue;
          var trend = {
            name: field.name,
            difference: (currentValue - previousValue) / previousValue * 100
          };
          dataArray.push(trend);
        }
      });
    }
    setTrends(dataArray);
  }, [data, options]);
  if (!frame) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      style: {
        width: width,
        height: height
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(grafana_plugin_support__WEBPACK_IMPORTED_MODULE_1__.PanelWizard, usage));
  }
  var rootID = "insights_" + id;
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var editMode = urlParams.has('editPanel');
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      position: "absolute",
      top: "-2px",
      zIndex: 100,
      fontWeight: '500'
    }
  }, ((_options$chartFields3 = options.chartFields) === null || _options$chartFields3 === void 0 ? void 0 : _options$chartFields3.enableTrend) && ((_options$chartFields4 = options.chartFields) === null || _options$chartFields4 === void 0 ? void 0 : _options$chartFields4.chartType) === "LineChart" && trends.map(function (trend) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Trend__WEBPACK_IMPORTED_MODULE_3__.Trend, {
      key: trend.name,
      trend: trend
    });
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_GoogleCharts__WEBPACK_IMPORTED_MODULE_2__.GoogleCharts, {
    chartType: (_options$chartFields5 = options.chartFields) === null || _options$chartFields5 === void 0 ? void 0 : _options$chartFields5.chartType,
    chartOptions: (_options$chartFields6 = options.chartFields) === null || _options$chartFields6 === void 0 ? void 0 : _options$chartFields6.chartOptions,
    transformDataInstruction: (_options$chartFields7 = options.chartFields) === null || _options$chartFields7 === void 0 ? void 0 : _options$chartFields7.transformDataInstruction,
    joinInstructions: (_options$chartFields8 = options.chartFields) === null || _options$chartFields8 === void 0 ? void 0 : _options$chartFields8.joinInstructions,
    container: (_options$chartFields9 = options.chartFields) === null || _options$chartFields9 === void 0 ? void 0 : _options$chartFields9.container,
    rootId: rootID,
    data: data,
    isEdit: editMode,
    columnModel: options.chartFields.columnModel
  }));
};

/***/ }),

/***/ "./Trend.tsx":
/*!*******************!*\
  !*** ./Trend.tsx ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Trend: () => (/* binding */ Trend)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

var Trend = function Trend(_ref) {
  var trend = _ref.trend;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      gap: "10px",
      fontWeight: "500 !important",
      cursor: "pointer"
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, trend.name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, trend.difference >= 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    style: {
      color: "green"
    },
    title: "Increase"
  }, "\u25B2") : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    style: {
      color: "red"
    },
    title: "Decrease"
  }, "\u25BC"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, " ", Math.round(Math.abs(trend.difference)), " %")));
};

/***/ }),

/***/ "./models/ChartModel.ts":
/*!******************************!*\
  !*** ./models/ChartModel.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChartData: () => (/* binding */ ChartData),
/* harmony export */   ChartModel: () => (/* binding */ ChartModel),
/* harmony export */   ColumnModel: () => (/* binding */ ColumnModel),
/* harmony export */   ContainerModel: () => (/* binding */ ContainerModel)
/* harmony export */ });
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var ChartModel = /*#__PURE__*/_createClass(function ChartModel(chartType, chartOptions, dataArray, container, transformDataInstruction, joinInstructions, enableTrend, columnModel) {
  _classCallCheck(this, ChartModel);
  this.chartType = chartType;
  this.chartOptions = chartOptions;
  this.dataArray = dataArray;
  this.container = container;
  this.transformDataInstruction = transformDataInstruction;
  this.joinInstructions = joinInstructions;
  this.enableTrend = enableTrend;
  this.columnModel = columnModel;
});
var ColumnModel = /*#__PURE__*/_createClass(function ColumnModel(name, type, refId) {
  _classCallCheck(this, ColumnModel);
  this.name = name;
  this.type = type;
  this.refId = refId;
});
var ContainerModel = /*#__PURE__*/_createClass(function ContainerModel(id, height) {
  _classCallCheck(this, ContainerModel);
  this.id = id;
  this.height = height;
});
var ChartData = /*#__PURE__*/_createClass(function ChartData(id, data, columns) {
  _classCallCheck(this, ChartData);
  this.id = id;
  this.data = data;
  this.columns = columns;
});

/***/ }),

/***/ "./models/InsightsChartEditorModel.ts":
/*!********************************************!*\
  !*** ./models/InsightsChartEditorModel.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InsightsChartEditorModel: () => (/* binding */ InsightsChartEditorModel),
/* harmony export */   InsightsChartTargetModel: () => (/* binding */ InsightsChartTargetModel)
/* harmony export */ });
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var InsightsChartEditorModel = /*#__PURE__*/_createClass(function InsightsChartEditorModel(targets, transformInstrctions, joinInstructions, chartOptions) {
  _classCallCheck(this, InsightsChartEditorModel);
  this.targets = targets;
  this.transformInstrctions = transformInstrctions;
  this.joinInstructions = joinInstructions;
  this.chartOptions = chartOptions;
});
var InsightsChartTargetModel = /*#__PURE__*/_createClass(function InsightsChartTargetModel(id, columnModel) {
  _classCallCheck(this, InsightsChartTargetModel);
  this.id = id;
  this.columnModel = columnModel;
});

/***/ }),

/***/ "../node_modules/grafana-plugin-support/dist/components/FieldSelectEditor.js":
/*!***********************************************************************************!*\
  !*** ../node_modules/grafana-plugin-support/dist/components/FieldSelectEditor.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FieldSelectEditor: () => (/* binding */ FieldSelectEditor)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__);


/**
 * FieldSelectEditor populates a Select with the names of the fields returned by
 * the query.
 *
 * Requires Grafana >=7.0.3. For more information, refer to the following
 * pull request:
 *
 * https://github.com/grafana/grafana/pull/24829
 */
var FieldSelectEditor = function (_a) {
    var _b;
    var item = _a.item, value = _a.value, onChange = _a.onChange, context = _a.context;
    if (context.data && context.data.length > 0) {
        var options = context.data
            .flatMap(function (frame) { return frame.fields; })
            .filter(function (field) {
            var _a, _b;
            return ((_a = item.settings) === null || _a === void 0 ? void 0 : _a.filterByType) ? (_b = item.settings) === null || _b === void 0 ? void 0 : _b.filterByType.some(function (_) { return field.type === _; }) : true;
        })
            .map(function (field) { return ({
            label: field.name,
            value: field.name,
        }); });
        if ((_b = item.settings) === null || _b === void 0 ? void 0 : _b.multi) {
            return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.MultiSelect, { isClearable: true, isLoading: false, value: value, onChange: function (e) { return onChange(e.map(function (_) { return _.value; })); }, options: options }));
        }
        else {
            return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.Select, { isClearable: true, isLoading: false, value: value, onChange: function (e) {
                    onChange(e === null || e === void 0 ? void 0 : e.value);
                }, options: options }));
        }
    }
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.Select, { onChange: function () { }, disabled: true });
};
//# sourceMappingURL=FieldSelectEditor.js.map

/***/ }),

/***/ "../node_modules/grafana-plugin-support/dist/components/PanelWizard.js":
/*!*****************************************************************************!*\
  !*** ../node_modules/grafana-plugin-support/dist/components/PanelWizard.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PanelWizard: () => (/* binding */ PanelWizard),
/* harmony export */   validateFields: () => (/* binding */ validateFields)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @grafana/ui */ "@grafana/ui");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! emotion */ "emotion");
/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(emotion__WEBPACK_IMPORTED_MODULE_2__);




var PanelWizard = function (_a) {
    var schema = _a.schema, fields = _a.fields, url = _a.url;
    var theme = (0,_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.useTheme)();
    var report = validateFields(fields !== null && fields !== void 0 ? fields : [], schema);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
        } },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.InfoBox, { title: "Configure your query", url: url, severity: "info", style: { maxWidth: "500px" } },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "Define a data source query that return at least the following field" + (report.length > 1 ? "s" : "") + ":"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, report.map(function (_a, key) {
                var type = _a.type, description = _a.description, ok = _a.ok;
                return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { key: key, className: (0,emotion__WEBPACK_IMPORTED_MODULE_2__.css)(templateObject_1 || (templateObject_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__makeTemplateObject)(["\n                display: flex;\n                align-items: center;\n                padding-bottom: ", ";\n                & > * {\n                  margin-right: ", ";\n                }\n                & > *:last-child {\n                  margin-right: 0;\n                }\n              "], ["\n                display: flex;\n                align-items: center;\n                padding-bottom: ", ";\n                & > * {\n                  margin-right: ", ";\n                }\n                & > *:last-child {\n                  margin-right: 0;\n                }\n              "])), theme.spacing.sm, theme.spacing.sm) },
                    ok ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.Icon, { name: "check-circle", size: "lg", style: {
                            color: theme.palette.brandSuccess,
                        } })) : (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.Icon, { name: "circle", size: "lg", style: {
                            color: theme.colors.linkDisabled,
                        } })),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_grafana_ui__WEBPACK_IMPORTED_MODULE_1__.Badge, { className: (0,emotion__WEBPACK_IMPORTED_MODULE_2__.css)(templateObject_2 || (templateObject_2 = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__makeTemplateObject)(["\n                  margin-top: 0;\n                "], ["\n                  margin-top: 0;\n                "]))), text: type.slice(0, 1).toUpperCase() + type.slice(1), color: "blue" }),
                    description && react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "" + description)));
            })))));
};
var validateFields = function (fields, schema) {
    var seen = [];
    return schema.map(function (_a) {
        var type = _a.type, description = _a.description;
        var field = fields
            .filter(function (field) { return !seen.includes(field); })
            .find(function (field) { return field.type === type; });
        if (field) {
            seen.push(field);
        }
        return { type: type, description: description, ok: !!field };
    });
};
var templateObject_1, templateObject_2;
//# sourceMappingURL=PanelWizard.js.map

/***/ }),

/***/ "../node_modules/grafana-plugin-support/dist/components/index.js":
/*!***********************************************************************!*\
  !*** ../node_modules/grafana-plugin-support/dist/components/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FieldSelectEditor: () => (/* reexport safe */ _FieldSelectEditor__WEBPACK_IMPORTED_MODULE_0__.FieldSelectEditor),
/* harmony export */   PanelWizard: () => (/* reexport safe */ _PanelWizard__WEBPACK_IMPORTED_MODULE_1__.PanelWizard)
/* harmony export */ });
/* harmony import */ var _FieldSelectEditor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FieldSelectEditor */ "../node_modules/grafana-plugin-support/dist/components/FieldSelectEditor.js");
/* harmony import */ var _PanelWizard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PanelWizard */ "../node_modules/grafana-plugin-support/dist/components/PanelWizard.js");


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../node_modules/grafana-plugin-support/dist/index.js":
/*!************************************************************!*\
  !*** ../node_modules/grafana-plugin-support/dist/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FieldSelectEditor: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.FieldSelectEditor),
/* harmony export */   PanelWizard: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.PanelWizard),
/* harmony export */   fieldConfigWithMinMaxCompat: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.fieldConfigWithMinMaxCompat),
/* harmony export */   getFormattedDisplayValue: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.getFormattedDisplayValue),
/* harmony export */   getPanelPluginOrFallback: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.getPanelPluginOrFallback),
/* harmony export */   hasCapability: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.hasCapability),
/* harmony export */   measureText: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.measureText),
/* harmony export */   standardOptionsCompat: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.standardOptionsCompat),
/* harmony export */   toTimeField: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.toTimeField)
/* harmony export */ });
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components */ "../node_modules/grafana-plugin-support/dist/components/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../node_modules/grafana-plugin-support/dist/utils/index.js");


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../node_modules/grafana-plugin-support/dist/utils/capability.js":
/*!***********************************************************************!*\
  !*** ../node_modules/grafana-plugin-support/dist/utils/capability.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fieldConfigWithMinMaxCompat: () => (/* binding */ fieldConfigWithMinMaxCompat),
/* harmony export */   hasCapability: () => (/* binding */ hasCapability),
/* harmony export */   standardOptionsCompat: () => (/* binding */ standardOptionsCompat)
/* harmony export */ });
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @grafana/data */ "@grafana/data");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_grafana_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _grafana_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @grafana/runtime */ "@grafana/runtime");
/* harmony import */ var _grafana_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_grafana_runtime__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var semver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! semver */ "../node_modules/semver/index.js");
/* harmony import */ var semver__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(semver__WEBPACK_IMPORTED_MODULE_2__);



/**
 * hasCapability returns true if the currently running version of Grafana
 * supports a given feature. Enables graceful degredation for earlier versions
 * that don't support a given capability.
 */
var hasCapability = function (capability) {
    var version = _grafana_runtime__WEBPACK_IMPORTED_MODULE_1__.config.buildInfo.version;
    switch (capability) {
        case "color-scheme":
            return (0,semver__WEBPACK_IMPORTED_MODULE_2__.gte)(version, "7.3.0");
        case "standard-options-object":
            return (0,semver__WEBPACK_IMPORTED_MODULE_2__.gte)(version, "7.4.0");
        case "custom-editor-context":
            return (0,semver__WEBPACK_IMPORTED_MODULE_2__.gte)(version, "7.0.3");
        case "field-config-with-min-max":
            return (0,semver__WEBPACK_IMPORTED_MODULE_2__.gte)(version, "7.4.0");
        default:
            return false;
    }
};
/**
 * standardOptionsCompat translates the standard options API prior to 7.4 to the
 * new API.
 */
var standardOptionsCompat = function (options) {
    if (hasCapability("standard-options-object")) {
        return options.reduce(function (acc, curr) {
            acc[curr] = {};
            return acc;
        }, {});
    }
    return options;
};
/**
 * fieldConfigWithMinMaxCompat uses the getFieldConfigWithMinMax if
 * available, otherwise falls back.
 */
var fieldConfigWithMinMaxCompat = function (field) {
    if (hasCapability("field-config-with-min-max")) {
        return (0,_grafana_data__WEBPACK_IMPORTED_MODULE_0__.getFieldConfigWithMinMax)(field, true);
    }
    return field.config;
};
//# sourceMappingURL=capability.js.map

/***/ }),

/***/ "../node_modules/grafana-plugin-support/dist/utils/dependency.js":
/*!***********************************************************************!*\
  !*** ../node_modules/grafana-plugin-support/dist/utils/dependency.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPanelPluginOrFallback: () => (/* binding */ getPanelPluginOrFallback)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @grafana/data */ "@grafana/data");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_grafana_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _grafana_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @grafana/runtime */ "@grafana/runtime");
/* harmony import */ var _grafana_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_grafana_runtime__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var semver__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! semver */ "../node_modules/semver/index.js");
/* harmony import */ var semver__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(semver__WEBPACK_IMPORTED_MODULE_3__);






/**
 * getPluginOrFallback checks if the currently running Grafana version satisfies
 * the plugin requirements. If not, an error is displayed instead.
 *
 * TODO: Is there anyway to detect the plugin id automatically?
 */
var getPanelPluginOrFallback = function (pluginId, plugin) { return (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__awaiter)(void 0, void 0, void 0, function () {
    var res, meta;
    return (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0,_grafana_runtime__WEBPACK_IMPORTED_MODULE_2__.getBackendSrv)().datasourceRequest({
                    url: "/public/plugins/" + pluginId + "/plugin.json",
                })];
            case 1:
                res = _a.sent();
                meta = res.data;
                if ((0,semver__WEBPACK_IMPORTED_MODULE_3__.satisfies)(_grafana_runtime__WEBPACK_IMPORTED_MODULE_2__.config.buildInfo.version, meta.dependencies.grafanaDependency, {
                    includePrerelease: true,
                })) {
                    return [2 /*return*/, plugin];
                }
                return [2 /*return*/, new _grafana_data__WEBPACK_IMPORTED_MODULE_1__.PanelPlugin(function (_a) {
                        var width = _a.width, height = _a.height;
                        var style = {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                        };
                        return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                                width: width,
                                height: height,
                            } },
                            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: style },
                                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
                                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null,
                                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("strong", null, "Error loading: " + meta.id)), "This plugin requires a more recent version of Grafana (" + meta.dependencies.grafanaDependency + ")."))));
                    })];
        }
    });
}); };
//# sourceMappingURL=dependency.js.map

/***/ }),

/***/ "../node_modules/grafana-plugin-support/dist/utils/fields.js":
/*!*******************************************************************!*\
  !*** ../node_modules/grafana-plugin-support/dist/utils/fields.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toTimeField: () => (/* binding */ toTimeField)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @grafana/data */ "@grafana/data");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_grafana_data__WEBPACK_IMPORTED_MODULE_0__);


var toTimeField = function (field, timeZone, theme) {
    if ((field === null || field === void 0 ? void 0 : field.type) === _grafana_data__WEBPACK_IMPORTED_MODULE_0__.FieldType.number) {
        var tmp = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, field), { type: _grafana_data__WEBPACK_IMPORTED_MODULE_0__.FieldType.time });
        tmp.display = (0,_grafana_data__WEBPACK_IMPORTED_MODULE_0__.getDisplayProcessor)({ field: tmp, timeZone: timeZone, theme: theme });
        return tmp;
    }
    else if ((field === null || field === void 0 ? void 0 : field.type) === _grafana_data__WEBPACK_IMPORTED_MODULE_0__.FieldType.string) {
        var tmp = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, field), { type: _grafana_data__WEBPACK_IMPORTED_MODULE_0__.FieldType.time, values: new _grafana_data__WEBPACK_IMPORTED_MODULE_0__.ArrayVector(field.values.toArray().map(function (_) {
                return (0,_grafana_data__WEBPACK_IMPORTED_MODULE_0__.dateTimeParse)(_, {
                    timeZone: timeZone,
                    format: "YYYY-MM-DDTHH:mm:ss.SSSSSSSZ",
                }).valueOf();
            })) });
        tmp.display = (0,_grafana_data__WEBPACK_IMPORTED_MODULE_0__.getDisplayProcessor)({ field: tmp, timeZone: timeZone, theme: theme });
        return tmp;
    }
    return field;
};
//# sourceMappingURL=fields.js.map

/***/ }),

/***/ "../node_modules/grafana-plugin-support/dist/utils/format.js":
/*!*******************************************************************!*\
  !*** ../node_modules/grafana-plugin-support/dist/utils/format.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFormattedDisplayValue: () => (/* binding */ getFormattedDisplayValue),
/* harmony export */   measureText: () => (/* binding */ measureText)
/* harmony export */ });
var measureText = function (text, size) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.font = size + " sans-serif";
        return ctx.measureText(text);
    }
    return undefined;
};
var getFormattedDisplayValue = function (displayValue) {
    var _a, _b;
    return displayValue
        ? "" + ((_a = displayValue.prefix) !== null && _a !== void 0 ? _a : "") + displayValue.text + ((_b = displayValue.suffix) !== null && _b !== void 0 ? _b : "")
        : "";
};
//# sourceMappingURL=format.js.map

/***/ }),

/***/ "../node_modules/grafana-plugin-support/dist/utils/index.js":
/*!******************************************************************!*\
  !*** ../node_modules/grafana-plugin-support/dist/utils/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fieldConfigWithMinMaxCompat: () => (/* reexport safe */ _capability__WEBPACK_IMPORTED_MODULE_0__.fieldConfigWithMinMaxCompat),
/* harmony export */   getFormattedDisplayValue: () => (/* reexport safe */ _format__WEBPACK_IMPORTED_MODULE_2__.getFormattedDisplayValue),
/* harmony export */   getPanelPluginOrFallback: () => (/* reexport safe */ _dependency__WEBPACK_IMPORTED_MODULE_3__.getPanelPluginOrFallback),
/* harmony export */   hasCapability: () => (/* reexport safe */ _capability__WEBPACK_IMPORTED_MODULE_0__.hasCapability),
/* harmony export */   measureText: () => (/* reexport safe */ _format__WEBPACK_IMPORTED_MODULE_2__.measureText),
/* harmony export */   standardOptionsCompat: () => (/* reexport safe */ _capability__WEBPACK_IMPORTED_MODULE_0__.standardOptionsCompat),
/* harmony export */   toTimeField: () => (/* reexport safe */ _fields__WEBPACK_IMPORTED_MODULE_1__.toTimeField)
/* harmony export */ });
/* harmony import */ var _capability__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./capability */ "../node_modules/grafana-plugin-support/dist/utils/capability.js");
/* harmony import */ var _fields__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fields */ "../node_modules/grafana-plugin-support/dist/utils/fields.js");
/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./format */ "../node_modules/grafana-plugin-support/dist/utils/format.js");
/* harmony import */ var _dependency__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dependency */ "../node_modules/grafana-plugin-support/dist/utils/dependency.js");




//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../node_modules/lru-cache/index.js":
/*!******************************************!*\
  !*** ../node_modules/lru-cache/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// A linked list to keep track of recently-used-ness
const Yallist = __webpack_require__(/*! yallist */ "../node_modules/yallist/yallist.js")

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache


/***/ }),

/***/ "../node_modules/semver/classes/comparator.js":
/*!****************************************************!*\
  !*** ../node_modules/semver/classes/comparator.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    comp = comp.trim().split(/\s+/).join(' ')
    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    options = parseOptions(options)

    // Special cases where nothing can possibly be lower
    if (options.includePrerelease &&
      (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
      return false
    }
    if (!options.includePrerelease &&
      (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
      return false
    }

    // Same direction increasing (> or >=)
    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
      return true
    }
    // Same direction decreasing (< or <=)
    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
      return true
    }
    // same SemVer and both sides are inclusive (<= or >=)
    if (
      (this.semver.version === comp.semver.version) &&
      this.operator.includes('=') && comp.operator.includes('=')) {
      return true
    }
    // opposite directions less than
    if (cmp(this.semver, '<', comp.semver, options) &&
      this.operator.startsWith('>') && comp.operator.startsWith('<')) {
      return true
    }
    // opposite directions greater than
    if (cmp(this.semver, '>', comp.semver, options) &&
      this.operator.startsWith('<') && comp.operator.startsWith('>')) {
      return true
    }
    return false
  }
}

module.exports = Comparator

const parseOptions = __webpack_require__(/*! ../internal/parse-options */ "../node_modules/semver/internal/parse-options.js")
const { safeRe: re, t } = __webpack_require__(/*! ../internal/re */ "../node_modules/semver/internal/re.js")
const cmp = __webpack_require__(/*! ../functions/cmp */ "../node_modules/semver/functions/cmp.js")
const debug = __webpack_require__(/*! ../internal/debug */ "../node_modules/semver/internal/debug.js")
const SemVer = __webpack_require__(/*! ./semver */ "../node_modules/semver/classes/semver.js")
const Range = __webpack_require__(/*! ./range */ "../node_modules/semver/classes/range.js")


/***/ }),

/***/ "../node_modules/semver/classes/range.js":
/*!***********************************************!*\
  !*** ../node_modules/semver/classes/range.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions(options)

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.format()
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First reduce all whitespace as much as possible so we do not have to rely
    // on potentially slow regexes like \s*. This is then stored and used for
    // future error messages as well.
    this.raw = range
      .trim()
      .split(/\s+/)
      .join(' ')

    // First, split on ||
    this.set = this.raw
      .split('||')
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${this.raw}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0]
      this.set = this.set.filter(c => !isNullSet(c[0]))
      if (this.set.length === 0) {
        this.set = [first]
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c]
            break
          }
        }
      }
    }

    this.format()
  }

  format () {
    this.range = this.set
      .map((comps) => comps.join(' ').trim())
      .join('||')
      .trim()
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts =
      (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) |
      (this.options.loose && FLAG_LOOSE)
    const memoKey = memoOpts + ':' + range
    const cached = cache.get(memoKey)
    if (cached) {
      return cached
    }

    const loose = this.options.loose
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)

    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range)

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)
    debug('tilde trim', range)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)
    debug('caret trim', range)

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        debug('loose invalid filter', comp, this.options)
        return !!comp.match(re[t.COMPARATORLOOSE])
      })
    }
    debug('range list', rangeList)

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map()
    const comparators = rangeList.map(comp => new Comparator(comp, this.options))
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp]
      }
      rangeMap.set(comp.value, comp)
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
      rangeMap.delete('')
    }

    const result = [...rangeMap.values()]
    cache.set(memoKey, result)
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}

module.exports = Range

const LRU = __webpack_require__(/*! lru-cache */ "../node_modules/lru-cache/index.js")
const cache = new LRU({ max: 1000 })

const parseOptions = __webpack_require__(/*! ../internal/parse-options */ "../node_modules/semver/internal/parse-options.js")
const Comparator = __webpack_require__(/*! ./comparator */ "../node_modules/semver/classes/comparator.js")
const debug = __webpack_require__(/*! ../internal/debug */ "../node_modules/semver/internal/debug.js")
const SemVer = __webpack_require__(/*! ./semver */ "../node_modules/semver/classes/semver.js")
const {
  safeRe: re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = __webpack_require__(/*! ../internal/re */ "../node_modules/semver/internal/re.js")
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __webpack_require__(/*! ../internal/constants */ "../node_modules/semver/internal/constants.js")

const isNullSet = c => c.value === '<0.0.0-0'
const isAny = c => c.value === ''

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceTilde(c, options))
    .join(' ')
}

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceCaret(c, options))
    .join(' ')
}

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp
    .split(/\s+/)
    .map((c) => replaceXRange(c, options))
    .join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<') {
        pr = '-0'
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp
    .trim()
    .replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp
    .trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return `${from} ${to}`.trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}


/***/ }),

/***/ "../node_modules/semver/classes/semver.js":
/*!************************************************!*\
  !*** ../node_modules/semver/classes/semver.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const debug = __webpack_require__(/*! ../internal/debug */ "../node_modules/semver/internal/debug.js")
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __webpack_require__(/*! ../internal/constants */ "../node_modules/semver/internal/constants.js")
const { safeRe: re, t } = __webpack_require__(/*! ../internal/re */ "../node_modules/semver/internal/re.js")

const parseOptions = __webpack_require__(/*! ../internal/parse-options */ "../node_modules/semver/internal/parse-options.js")
const { compareIdentifiers } = __webpack_require__(/*! ../internal/identifiers */ "../node_modules/semver/internal/identifiers.js")
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier, identifierBase) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier, identifierBase)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier, identifierBase)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier, identifierBase)
        this.inc('pre', identifier, identifierBase)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier, identifierBase)
        }
        this.inc('pre', identifier, identifierBase)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre': {
        const base = Number(identifierBase) ? 1 : 0

        if (!identifier && identifierBase === false) {
          throw new Error('invalid increment argument: identifier is empty')
        }

        if (this.prerelease.length === 0) {
          this.prerelease = [base]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            if (identifier === this.prerelease.join('.') && identifierBase === false) {
              throw new Error('invalid increment argument: identifier already exists')
            }
            this.prerelease.push(base)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          let prerelease = [identifier, base]
          if (identifierBase === false) {
            prerelease = [identifier]
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease
            }
          } else {
            this.prerelease = prerelease
          }
        }
        break
      }
      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.raw = this.format()
    if (this.build.length) {
      this.raw += `+${this.build.join('.')}`
    }
    return this
  }
}

module.exports = SemVer


/***/ }),

/***/ "../node_modules/semver/functions/clean.js":
/*!*************************************************!*\
  !*** ../node_modules/semver/functions/clean.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const parse = __webpack_require__(/*! ./parse */ "../node_modules/semver/functions/parse.js")
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
module.exports = clean


/***/ }),

/***/ "../node_modules/semver/functions/cmp.js":
/*!***********************************************!*\
  !*** ../node_modules/semver/functions/cmp.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const eq = __webpack_require__(/*! ./eq */ "../node_modules/semver/functions/eq.js")
const neq = __webpack_require__(/*! ./neq */ "../node_modules/semver/functions/neq.js")
const gt = __webpack_require__(/*! ./gt */ "../node_modules/semver/functions/gt.js")
const gte = __webpack_require__(/*! ./gte */ "../node_modules/semver/functions/gte.js")
const lt = __webpack_require__(/*! ./lt */ "../node_modules/semver/functions/lt.js")
const lte = __webpack_require__(/*! ./lte */ "../node_modules/semver/functions/lte.js")

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a === b

    case '!==':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp


/***/ }),

/***/ "../node_modules/semver/functions/coerce.js":
/*!**************************************************!*\
  !*** ../node_modules/semver/functions/coerce.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(/*! ../classes/semver */ "../node_modules/semver/classes/semver.js")
const parse = __webpack_require__(/*! ./parse */ "../node_modules/semver/functions/parse.js")
const { safeRe: re, t } = __webpack_require__(/*! ../internal/re */ "../node_modules/semver/internal/re.js")

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next
    while ((next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
}
module.exports = coerce


/***/ }),

/***/ "../node_modules/semver/functions/compare-build.js":
/*!*********************************************************!*\
  !*** ../node_modules/semver/functions/compare-build.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(/*! ../classes/semver */ "../node_modules/semver/classes/semver.js")
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild


/***/ }),

/***/ "../node_modules/semver/functions/compare-loose.js":
/*!*********************************************************!*\
  !*** ../node_modules/semver/functions/compare-loose.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(/*! ./compare */ "../node_modules/semver/functions/compare.js")
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose


/***/ }),

/***/ "../node_modules/semver/functions/compare.js":
/*!***************************************************!*\
  !*** ../node_modules/semver/functions/compare.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(/*! ../classes/semver */ "../node_modules/semver/classes/semver.js")
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ "../node_modules/semver/functions/diff.js":
/*!************************************************!*\
  !*** ../node_modules/semver/functions/diff.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const parse = __webpack_require__(/*! ./parse.js */ "../node_modules/semver/functions/parse.js")

const diff = (version1, version2) => {
  const v1 = parse(version1, null, true)
  const v2 = parse(version2, null, true)
  const comparison = v1.compare(v2)

  if (comparison === 0) {
    return null
  }

  const v1Higher = comparison > 0
  const highVersion = v1Higher ? v1 : v2
  const lowVersion = v1Higher ? v2 : v1
  const highHasPre = !!highVersion.prerelease.length
  const lowHasPre = !!lowVersion.prerelease.length

  if (lowHasPre && !highHasPre) {
    // Going from prerelease -> no prerelease requires some special casing

    // If the low version has only a major, then it will always be a major
    // Some examples:
    // 1.0.0-1 -> 1.0.0
    // 1.0.0-1 -> 1.1.1
    // 1.0.0-1 -> 2.0.0
    if (!lowVersion.patch && !lowVersion.minor) {
      return 'major'
    }

    // Otherwise it can be determined by checking the high version

    if (highVersion.patch) {
      // anything higher than a patch bump would result in the wrong version
      return 'patch'
    }

    if (highVersion.minor) {
      // anything higher than a minor bump would result in the wrong version
      return 'minor'
    }

    // bumping major/minor/patch all have same result
    return 'major'
  }

  // add the `pre` prefix if we are going to a prerelease version
  const prefix = highHasPre ? 'pre' : ''

  if (v1.major !== v2.major) {
    return prefix + 'major'
  }

  if (v1.minor !== v2.minor) {
    return prefix + 'minor'
  }

  if (v1.patch !== v2.patch) {
    return prefix + 'patch'
  }

  // high and low are preleases
  return 'prerelease'
}

module.exports = diff


/***/ }),

/***/ "../node_modules/semver/functions/eq.js":
/*!**********************************************!*\
  !*** ../node_modules/semver/functions/eq.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(/*! ./compare */ "../node_modules/semver/functions/compare.js")
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq


/***/ }),

/***/ "../node_modules/semver/functions/gt.js":
/*!**********************************************!*\
  !*** ../node_modules/semver/functions/gt.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(/*! ./compare */ "../node_modules/semver/functions/compare.js")
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),

/***/ "../node_modules/semver/functions/gte.js":
/*!***********************************************!*\
  !*** ../node_modules/semver/functions/gte.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(/*! ./compare */ "../node_modules/semver/functions/compare.js")
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),

/***/ "../node_modules/semver/functions/inc.js":
/*!***********************************************!*\
  !*** ../node_modules/semver/functions/inc.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(/*! ../classes/semver */ "../node_modules/semver/classes/semver.js")

const inc = (version, release, options, identifier, identifierBase) => {
  if (typeof (options) === 'string') {
    identifierBase = identifier
    identifier = options
    options = undefined
  }

  try {
    return new SemVer(
      version instanceof SemVer ? version.version : version,
      options
    ).inc(release, identifier, identifierBase).version
  } catch (er) {
    return null
  }
}
module.exports = inc


/***/ }),

/***/ "../node_modules/semver/functions/lt.js":
/*!**********************************************!*\
  !*** ../node_modules/semver/functions/lt.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(/*! ./compare */ "../node_modules/semver/functions/compare.js")
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt


/***/ }),

/***/ "../node_modules/semver/functions/lte.js":
/*!***********************************************!*\
  !*** ../node_modules/semver/functions/lte.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(/*! ./compare */ "../node_modules/semver/functions/compare.js")
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte


/***/ }),

/***/ "../node_modules/semver/functions/major.js":
/*!*************************************************!*\
  !*** ../node_modules/semver/functions/major.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(/*! ../classes/semver */ "../node_modules/semver/classes/semver.js")
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major


/***/ }),

/***/ "../node_modules/semver/functions/minor.js":
/*!*************************************************!*\
  !*** ../node_modules/semver/functions/minor.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(/*! ../classes/semver */ "../node_modules/semver/classes/semver.js")
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor


/***/ }),

/***/ "../node_modules/semver/functions/neq.js":
/*!***********************************************!*\
  !*** ../node_modules/semver/functions/neq.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(/*! ./compare */ "../node_modules/semver/functions/compare.js")
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq


/***/ }),

/***/ "../node_modules/semver/functions/parse.js":
/*!*************************************************!*\
  !*** ../node_modules/semver/functions/parse.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(/*! ../classes/semver */ "../node_modules/semver/classes/semver.js")
const parse = (version, options, throwErrors = false) => {
  if (version instanceof SemVer) {
    return version
  }
  try {
    return new SemVer(version, options)
  } catch (er) {
    if (!throwErrors) {
      return null
    }
    throw er
  }
}

module.exports = parse


/***/ }),

/***/ "../node_modules/semver/functions/patch.js":
/*!*************************************************!*\
  !*** ../node_modules/semver/functions/patch.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(/*! ../classes/semver */ "../node_modules/semver/classes/semver.js")
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch


/***/ }),

/***/ "../node_modules/semver/functions/prerelease.js":
/*!******************************************************!*\
  !*** ../node_modules/semver/functions/prerelease.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const parse = __webpack_require__(/*! ./parse */ "../node_modules/semver/functions/parse.js")
const prerelease = (version, options) => {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}
module.exports = prerelease


/***/ }),

/***/ "../node_modules/semver/functions/rcompare.js":
/*!****************************************************!*\
  !*** ../node_modules/semver/functions/rcompare.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(/*! ./compare */ "../node_modules/semver/functions/compare.js")
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare


/***/ }),

/***/ "../node_modules/semver/functions/rsort.js":
/*!*************************************************!*\
  !*** ../node_modules/semver/functions/rsort.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compareBuild = __webpack_require__(/*! ./compare-build */ "../node_modules/semver/functions/compare-build.js")
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort


/***/ }),

/***/ "../node_modules/semver/functions/satisfies.js":
/*!*****************************************************!*\
  !*** ../node_modules/semver/functions/satisfies.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Range = __webpack_require__(/*! ../classes/range */ "../node_modules/semver/classes/range.js")
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies


/***/ }),

/***/ "../node_modules/semver/functions/sort.js":
/*!************************************************!*\
  !*** ../node_modules/semver/functions/sort.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compareBuild = __webpack_require__(/*! ./compare-build */ "../node_modules/semver/functions/compare-build.js")
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort


/***/ }),

/***/ "../node_modules/semver/functions/valid.js":
/*!*************************************************!*\
  !*** ../node_modules/semver/functions/valid.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const parse = __webpack_require__(/*! ./parse */ "../node_modules/semver/functions/parse.js")
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
module.exports = valid


/***/ }),

/***/ "../node_modules/semver/index.js":
/*!***************************************!*\
  !*** ../node_modules/semver/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// just pre-load all the stuff that index.js lazily exports
const internalRe = __webpack_require__(/*! ./internal/re */ "../node_modules/semver/internal/re.js")
const constants = __webpack_require__(/*! ./internal/constants */ "../node_modules/semver/internal/constants.js")
const SemVer = __webpack_require__(/*! ./classes/semver */ "../node_modules/semver/classes/semver.js")
const identifiers = __webpack_require__(/*! ./internal/identifiers */ "../node_modules/semver/internal/identifiers.js")
const parse = __webpack_require__(/*! ./functions/parse */ "../node_modules/semver/functions/parse.js")
const valid = __webpack_require__(/*! ./functions/valid */ "../node_modules/semver/functions/valid.js")
const clean = __webpack_require__(/*! ./functions/clean */ "../node_modules/semver/functions/clean.js")
const inc = __webpack_require__(/*! ./functions/inc */ "../node_modules/semver/functions/inc.js")
const diff = __webpack_require__(/*! ./functions/diff */ "../node_modules/semver/functions/diff.js")
const major = __webpack_require__(/*! ./functions/major */ "../node_modules/semver/functions/major.js")
const minor = __webpack_require__(/*! ./functions/minor */ "../node_modules/semver/functions/minor.js")
const patch = __webpack_require__(/*! ./functions/patch */ "../node_modules/semver/functions/patch.js")
const prerelease = __webpack_require__(/*! ./functions/prerelease */ "../node_modules/semver/functions/prerelease.js")
const compare = __webpack_require__(/*! ./functions/compare */ "../node_modules/semver/functions/compare.js")
const rcompare = __webpack_require__(/*! ./functions/rcompare */ "../node_modules/semver/functions/rcompare.js")
const compareLoose = __webpack_require__(/*! ./functions/compare-loose */ "../node_modules/semver/functions/compare-loose.js")
const compareBuild = __webpack_require__(/*! ./functions/compare-build */ "../node_modules/semver/functions/compare-build.js")
const sort = __webpack_require__(/*! ./functions/sort */ "../node_modules/semver/functions/sort.js")
const rsort = __webpack_require__(/*! ./functions/rsort */ "../node_modules/semver/functions/rsort.js")
const gt = __webpack_require__(/*! ./functions/gt */ "../node_modules/semver/functions/gt.js")
const lt = __webpack_require__(/*! ./functions/lt */ "../node_modules/semver/functions/lt.js")
const eq = __webpack_require__(/*! ./functions/eq */ "../node_modules/semver/functions/eq.js")
const neq = __webpack_require__(/*! ./functions/neq */ "../node_modules/semver/functions/neq.js")
const gte = __webpack_require__(/*! ./functions/gte */ "../node_modules/semver/functions/gte.js")
const lte = __webpack_require__(/*! ./functions/lte */ "../node_modules/semver/functions/lte.js")
const cmp = __webpack_require__(/*! ./functions/cmp */ "../node_modules/semver/functions/cmp.js")
const coerce = __webpack_require__(/*! ./functions/coerce */ "../node_modules/semver/functions/coerce.js")
const Comparator = __webpack_require__(/*! ./classes/comparator */ "../node_modules/semver/classes/comparator.js")
const Range = __webpack_require__(/*! ./classes/range */ "../node_modules/semver/classes/range.js")
const satisfies = __webpack_require__(/*! ./functions/satisfies */ "../node_modules/semver/functions/satisfies.js")
const toComparators = __webpack_require__(/*! ./ranges/to-comparators */ "../node_modules/semver/ranges/to-comparators.js")
const maxSatisfying = __webpack_require__(/*! ./ranges/max-satisfying */ "../node_modules/semver/ranges/max-satisfying.js")
const minSatisfying = __webpack_require__(/*! ./ranges/min-satisfying */ "../node_modules/semver/ranges/min-satisfying.js")
const minVersion = __webpack_require__(/*! ./ranges/min-version */ "../node_modules/semver/ranges/min-version.js")
const validRange = __webpack_require__(/*! ./ranges/valid */ "../node_modules/semver/ranges/valid.js")
const outside = __webpack_require__(/*! ./ranges/outside */ "../node_modules/semver/ranges/outside.js")
const gtr = __webpack_require__(/*! ./ranges/gtr */ "../node_modules/semver/ranges/gtr.js")
const ltr = __webpack_require__(/*! ./ranges/ltr */ "../node_modules/semver/ranges/ltr.js")
const intersects = __webpack_require__(/*! ./ranges/intersects */ "../node_modules/semver/ranges/intersects.js")
const simplifyRange = __webpack_require__(/*! ./ranges/simplify */ "../node_modules/semver/ranges/simplify.js")
const subset = __webpack_require__(/*! ./ranges/subset */ "../node_modules/semver/ranges/subset.js")
module.exports = {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: constants.RELEASE_TYPES,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
}


/***/ }),

/***/ "../node_modules/semver/internal/constants.js":
/*!****************************************************!*\
  !*** ../node_modules/semver/internal/constants.js ***!
  \****************************************************/
/***/ ((module) => {

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6

const RELEASE_TYPES = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease',
]

module.exports = {
  MAX_LENGTH,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 0b001,
  FLAG_LOOSE: 0b010,
}


/***/ }),

/***/ "../node_modules/semver/internal/debug.js":
/*!************************************************!*\
  !*** ../node_modules/semver/internal/debug.js ***!
  \************************************************/
/***/ ((module) => {

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),

/***/ "../node_modules/semver/internal/identifiers.js":
/*!******************************************************!*\
  !*** ../node_modules/semver/internal/identifiers.js ***!
  \******************************************************/
/***/ ((module) => {

const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers,
}


/***/ }),

/***/ "../node_modules/semver/internal/parse-options.js":
/*!********************************************************!*\
  !*** ../node_modules/semver/internal/parse-options.js ***!
  \********************************************************/
/***/ ((module) => {

// parse out just the options we care about
const looseOption = Object.freeze({ loose: true })
const emptyOpts = Object.freeze({ })
const parseOptions = options => {
  if (!options) {
    return emptyOpts
  }

  if (typeof options !== 'object') {
    return looseOption
  }

  return options
}
module.exports = parseOptions


/***/ }),

/***/ "../node_modules/semver/internal/re.js":
/*!*********************************************!*\
  !*** ../node_modules/semver/internal/re.js ***!
  \*********************************************/
/***/ ((module, exports, __webpack_require__) => {

const {
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_LENGTH,
} = __webpack_require__(/*! ./constants */ "../node_modules/semver/internal/constants.js")
const debug = __webpack_require__(/*! ./debug */ "../node_modules/semver/internal/debug.js")
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const safeRe = exports.safeRe = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const LETTERDASHNUMBER = '[a-zA-Z0-9-]'

// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
  ['\\s', 1],
  ['\\d', MAX_LENGTH],
  [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
]

const makeSafeRegex = (value) => {
  for (const [token, max] of safeRegexReplacements) {
    value = value
      .split(`${token}*`).join(`${token}{0,${max}}`)
      .split(`${token}+`).join(`${token}{1,${max}}`)
  }
  return value
}

const createToken = (name, value, isGlobal) => {
  const safe = makeSafeRegex(value)
  const index = R++
  debug(name, index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
  safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '\\d+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`)

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`)

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$')


/***/ }),

/***/ "../node_modules/semver/ranges/gtr.js":
/*!********************************************!*\
  !*** ../node_modules/semver/ranges/gtr.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Determine if version is greater than all the versions possible in the range.
const outside = __webpack_require__(/*! ./outside */ "../node_modules/semver/ranges/outside.js")
const gtr = (version, range, options) => outside(version, range, '>', options)
module.exports = gtr


/***/ }),

/***/ "../node_modules/semver/ranges/intersects.js":
/*!***************************************************!*\
  !*** ../node_modules/semver/ranges/intersects.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Range = __webpack_require__(/*! ../classes/range */ "../node_modules/semver/classes/range.js")
const intersects = (r1, r2, options) => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2, options)
}
module.exports = intersects


/***/ }),

/***/ "../node_modules/semver/ranges/ltr.js":
/*!********************************************!*\
  !*** ../node_modules/semver/ranges/ltr.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const outside = __webpack_require__(/*! ./outside */ "../node_modules/semver/ranges/outside.js")
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr


/***/ }),

/***/ "../node_modules/semver/ranges/max-satisfying.js":
/*!*******************************************************!*\
  !*** ../node_modules/semver/ranges/max-satisfying.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(/*! ../classes/semver */ "../node_modules/semver/classes/semver.js")
const Range = __webpack_require__(/*! ../classes/range */ "../node_modules/semver/classes/range.js")

const maxSatisfying = (versions, range, options) => {
  let max = null
  let maxSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}
module.exports = maxSatisfying


/***/ }),

/***/ "../node_modules/semver/ranges/min-satisfying.js":
/*!*******************************************************!*\
  !*** ../node_modules/semver/ranges/min-satisfying.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(/*! ../classes/semver */ "../node_modules/semver/classes/semver.js")
const Range = __webpack_require__(/*! ../classes/range */ "../node_modules/semver/classes/range.js")
const minSatisfying = (versions, range, options) => {
  let min = null
  let minSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}
module.exports = minSatisfying


/***/ }),

/***/ "../node_modules/semver/ranges/min-version.js":
/*!****************************************************!*\
  !*** ../node_modules/semver/ranges/min-version.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(/*! ../classes/semver */ "../node_modules/semver/classes/semver.js")
const Range = __webpack_require__(/*! ../classes/range */ "../node_modules/semver/classes/range.js")
const gt = __webpack_require__(/*! ../functions/gt */ "../node_modules/semver/functions/gt.js")

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt(compver, setMin)) {
            setMin = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
    if (setMin && (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion


/***/ }),

/***/ "../node_modules/semver/ranges/outside.js":
/*!************************************************!*\
  !*** ../node_modules/semver/ranges/outside.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(/*! ../classes/semver */ "../node_modules/semver/classes/semver.js")
const Comparator = __webpack_require__(/*! ../classes/comparator */ "../node_modules/semver/classes/comparator.js")
const { ANY } = Comparator
const Range = __webpack_require__(/*! ../classes/range */ "../node_modules/semver/classes/range.js")
const satisfies = __webpack_require__(/*! ../functions/satisfies */ "../node_modules/semver/functions/satisfies.js")
const gt = __webpack_require__(/*! ../functions/gt */ "../node_modules/semver/functions/gt.js")
const lt = __webpack_require__(/*! ../functions/lt */ "../node_modules/semver/functions/lt.js")
const lte = __webpack_require__(/*! ../functions/lte */ "../node_modules/semver/functions/lte.js")
const gte = __webpack_require__(/*! ../functions/gte */ "../node_modules/semver/functions/gte.js")

const outside = (version, range, hilo, options) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let high = null
    let low = null

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

module.exports = outside


/***/ }),

/***/ "../node_modules/semver/ranges/simplify.js":
/*!*************************************************!*\
  !*** ../node_modules/semver/ranges/simplify.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __webpack_require__(/*! ../functions/satisfies.js */ "../node_modules/semver/functions/satisfies.js")
const compare = __webpack_require__(/*! ../functions/compare.js */ "../node_modules/semver/functions/compare.js")
module.exports = (versions, range, options) => {
  const set = []
  let first = null
  let prev = null
  const v = versions.sort((a, b) => compare(a, b, options))
  for (const version of v) {
    const included = satisfies(version, range, options)
    if (included) {
      prev = version
      if (!first) {
        first = version
      }
    } else {
      if (prev) {
        set.push([first, prev])
      }
      prev = null
      first = null
    }
  }
  if (first) {
    set.push([first, null])
  }

  const ranges = []
  for (const [min, max] of set) {
    if (min === max) {
      ranges.push(min)
    } else if (!max && min === v[0]) {
      ranges.push('*')
    } else if (!max) {
      ranges.push(`>=${min}`)
    } else if (min === v[0]) {
      ranges.push(`<=${max}`)
    } else {
      ranges.push(`${min} - ${max}`)
    }
  }
  const simplified = ranges.join(' || ')
  const original = typeof range.raw === 'string' ? range.raw : String(range)
  return simplified.length < original.length ? simplified : range
}


/***/ }),

/***/ "../node_modules/semver/ranges/subset.js":
/*!***********************************************!*\
  !*** ../node_modules/semver/ranges/subset.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Range = __webpack_require__(/*! ../classes/range.js */ "../node_modules/semver/classes/range.js")
const Comparator = __webpack_require__(/*! ../classes/comparator.js */ "../node_modules/semver/classes/comparator.js")
const { ANY } = Comparator
const satisfies = __webpack_require__(/*! ../functions/satisfies.js */ "../node_modules/semver/functions/satisfies.js")
const compare = __webpack_require__(/*! ../functions/compare.js */ "../node_modules/semver/functions/compare.js")

// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true

const subset = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true
  }

  sub = new Range(sub, options)
  dom = new Range(dom, options)
  let sawNonNull = false

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options)
      sawNonNull = sawNonNull || isSub !== null
      if (isSub) {
        continue OUTER
      }
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull) {
      return false
    }
  }
  return true
}

const minimumVersionWithPreRelease = [new Comparator('>=0.0.0-0')]
const minimumVersion = [new Comparator('>=0.0.0')]

const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true
  }

  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true
    } else if (options.includePrerelease) {
      sub = minimumVersionWithPreRelease
    } else {
      sub = minimumVersion
    }
  }

  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true
    } else {
      dom = minimumVersion
    }
  }

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver)
    }
  }

  if (eqSet.size > 1) {
    return null
  }

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver, lt.semver, options)
    if (gtltComp > 0) {
      return null
    } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies(eq, String(gt), options)) {
      return null
    }

    if (lt && !satisfies(eq, String(lt), options)) {
      return null
    }

    for (const c of dom) {
      if (!satisfies(eq, String(c), options)) {
        return false
      }
    }

    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  // if the subset has a prerelease, we need a comparator in the superset
  // with the same tuple and a prerelease, or it's not a subset
  let needDomLTPre = lt &&
    !options.includePrerelease &&
    lt.semver.prerelease.length ? lt.semver : false
  let needDomGTPre = gt &&
    !options.includePrerelease &&
    gt.semver.prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomGTPre.major &&
            c.semver.minor === needDomGTPre.minor &&
            c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c && higher !== gt) {
          return false
        }
      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
        return false
      }
    }
    if (lt) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomLTPre.major &&
            c.semver.minor === needDomLTPre.minor &&
            c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c && lower !== lt) {
          return false
        }
      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
        return false
      }
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0) {
      return false
    }
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0) {
    return false
  }

  if (lt && hasDomGT && !gt && gtltComp !== 0) {
    return false
  }

  // we needed a prerelease range in a specific tuple, but didn't get one
  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  // because it includes prereleases in the 1.2.3 tuple
  if (needDomGTPre || needDomLTPre) {
    return false
  }

  return true
}

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
}

module.exports = subset


/***/ }),

/***/ "../node_modules/semver/ranges/to-comparators.js":
/*!*******************************************************!*\
  !*** ../node_modules/semver/ranges/to-comparators.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Range = __webpack_require__(/*! ../classes/range */ "../node_modules/semver/classes/range.js")

// Mostly just for testing and legacy API reasons
const toComparators = (range, options) =>
  new Range(range, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '))

module.exports = toComparators


/***/ }),

/***/ "../node_modules/semver/ranges/valid.js":
/*!**********************************************!*\
  !*** ../node_modules/semver/ranges/valid.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Range = __webpack_require__(/*! ../classes/range */ "../node_modules/semver/classes/range.js")
const validRange = (range, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}
module.exports = validRange


/***/ }),

/***/ "../node_modules/tslib/tslib.es6.js":
/*!******************************************!*\
  !*** ../node_modules/tslib/tslib.es6.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldIn: () => (/* binding */ __classPrivateFieldIn),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __esDecorate: () => (/* binding */ __esDecorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __propKey: () => (/* binding */ __propKey),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __runInitializers: () => (/* binding */ __runInitializers),
/* harmony export */   __setFunctionName: () => (/* binding */ __setFunctionName),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};

function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};

function __propKey(x) {
    return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}


/***/ }),

/***/ "../node_modules/yallist/iterator.js":
/*!*******************************************!*\
  !*** ../node_modules/yallist/iterator.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";

module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}


/***/ }),

/***/ "../node_modules/yallist/yallist.js":
/*!******************************************!*\
  !*** ../node_modules/yallist/yallist.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  __webpack_require__(/*! ./iterator.js */ "../node_modules/yallist/iterator.js")(Yallist)
} catch (er) {}


/***/ }),

/***/ "@grafana/data":
/*!********************************!*\
  !*** external "@grafana/data" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__grafana_data__;

/***/ }),

/***/ "@grafana/runtime":
/*!***********************************!*\
  !*** external "@grafana/runtime" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__grafana_runtime__;

/***/ }),

/***/ "@grafana/ui":
/*!******************************!*\
  !*** external "@grafana/ui" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__grafana_ui__;

/***/ }),

/***/ "emotion":
/*!**************************!*\
  !*** external "emotion" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_emotion__;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jquery" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jquery__;

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_react__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************!*\
  !*** ./module.ts ***!
  \*******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   plugin: () => (/* binding */ plugin)
/* harmony export */ });
/* harmony import */ var _SimplePanel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SimplePanel */ "./SimplePanel.tsx");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @grafana/data */ "@grafana/data");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_grafana_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _CustomFieldSelectEditor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CustomFieldSelectEditor */ "./CustomFieldSelectEditor.tsx");



var plugin = new _grafana_data__WEBPACK_IMPORTED_MODULE_1__.PanelPlugin(_SimplePanel__WEBPACK_IMPORTED_MODULE_0__.SimplePanel).setPanelOptions(function (builder) {
  return builder.addCustomEditor({
    id: 'chartFields',
    path: 'chartFields',
    name: 'ChartFields',
    description: 'Fields required for Insights Charts',
    editor: _CustomFieldSelectEditor__WEBPACK_IMPORTED_MODULE_2__.CustomFieldSelectEditor
  });
});
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});;
//# sourceMappingURL=module.js.map