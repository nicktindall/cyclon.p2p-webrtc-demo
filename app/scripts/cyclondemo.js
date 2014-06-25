'use strict';

var angular = require("angular");
var DemoPageController = require("./controllers/DemoPageController");
var GuidService = require("./services/GuidService");
var OverlayService = require("./services/OverlayService");
var CacheContentsTable = require("./directives/CacheContentsTable");

var LocalSimulationController = require("./controllers/LocalSimulationController");
var LocalSimulationService = require("./services/LocalSimulationService");
var FrontendVersionService = require("./services/FrontendVersionService");
var LocationProviderService = require("./services/LocationProviderService");
var PlatformDetectionService = require("./services/PlatformDetectionService");
var ClientInfoService = require("./services/ClientInfoService");
var ShuffleStatsService = require("./services/ShuffleStatsService");
var IncomingSuccessRateFilter = require("./filters/IncomingSuccessRateFilter");
var OutgoingSuccessRateFilter = require("./filters/OutgoingSuccessRateFilter");

var appModule = angular.module("cyclon-demo", []);

appModule.filter("incomingsuccessrate", IncomingSuccessRateFilter);
appModule.filter("outgoingsuccessrate", OutgoingSuccessRateFilter);
appModule.factory("ShuffleStatsService", ["$rootScope", ShuffleStatsService]);
appModule.factory("FrontendVersionService", FrontendVersionService);
appModule.factory("GuidService", GuidService);
appModule.factory("OverlayService", ["$log", "$rootScope", "GuidService", "FrontendVersionService", "LocationProviderService", "PlatformDetectionService", "ClientInfoService", "ShuffleStatsService", OverlayService]);
appModule.factory("LocalSimulationService", ['$log', '$interval', LocalSimulationService]);
appModule.factory("LocationProviderService", ["$log", "$http", LocationProviderService]);
appModule.factory("PlatformDetectionService", PlatformDetectionService);
appModule.factory("ClientInfoService", ClientInfoService);
appModule.directive("cacheContentsTable", CacheContentsTable);
appModule.controller("DemoPageController", ['$http', '$interval', '$log', '$scope', "OverlayService", "ClientInfoService", DemoPageController]);
appModule.controller("LocalSimulationController", ['LocalSimulationService', LocalSimulationController]);

angular.element(document).ready(function() {
    angular.bootstrap(document, ['cyclon-demo']);
});
