'use strict';

const buildRTCClientModule = require("./modules/rtc-client-module");
const buildRTCCommsModule = require("./modules/rtc-comms-module");
const angular = require('angular');
require("angular-bootstrap/ui-bootstrap-tpls");
const StorageService = require("./services/StorageService");

/**
 * RTC Module
 */
buildRTCClientModule(angular)
    .factory("StorageService", StorageService)
    .value("IceServers", [
        // The Google STUN server
        {urls: ['stun:stun.l.google.com:19302']}
    ])
    .value("SignallingServers", JSON.parse('/* @echo SIGNALLING_SERVERS */'));

/**
 * RTC Comms Module
 */
buildRTCCommsModule(angular);

/**
 * Demo app module
 */
var LocalSimulationService = require("./services/LocalSimulationService");
var OverlayService = require("./services/OverlayService");
var FrontendVersionService = require("./services/FrontendVersionService");
var LocationProviderService = require("./services/LocationProviderService");
var PlatformDetectionService = require("./services/PlatformDetectionService");
var ClientInfoService = require("./services/ClientInfoService");
var ShuffleStatsService = require("./services/ShuffleStatsService");
var VersionCheckService = require("./services/VersionCheckService");
var RTCService = require("./services/RTCService");
var SessionInformationService = require("./services/SessionInformationService");
var RankingService = require("./services/RankingService");

var DemoPageController = require("./controllers/DemoPageController");
var LocalSimulationController = require("./controllers/LocalSimulationController");
var ConnectivityTestController = require("./controllers/ConnectivityTestController");

var CacheContentsTable = require("./directives/CacheContentsTable");
var NodeInfo = require("./directives/NodeInfo");
var TopNodesTable = require("./directives/TopNodesTable");
var LocalNodePointerPanel = require("./directives/LocalNodePointerPanel");
var RemoteNodePointerPanel = require("./directives/RemoteNodePointerPanel");

var OutgoingSuccessRateFilter = require("./filters/OutgoingSuccessRateFilter");
var IncomingSuccessRateFilter = require("./filters/IncomingSuccessRateFilter");
var IdOrInfoFilter = require("./filters/IdOrInfoFilter");
var RunningTimeFilter = require("./filters/RunningTimeFilter");

var appModule = angular.module("cyclon-demo", ["ui.bootstrap", "cyclon-rtc-comms"]);

appModule.filter("incomingSuccessRate", IncomingSuccessRateFilter);
appModule.filter("outgoingSuccessRate", OutgoingSuccessRateFilter);
appModule.filter("idOrInfo", IdOrInfoFilter);
appModule.filter("runningTime", ["SessionInformationService", RunningTimeFilter]);
appModule.factory("ShuffleStatsService", ["$rootScope", ShuffleStatsService]);
appModule.factory("SessionInformationService", ["StorageService", SessionInformationService]);
appModule.service("RankingService", ["$rootScope", "$interval", "OverlayService", "SessionInformationService", RankingService]);
appModule.factory("FrontendVersionService", FrontendVersionService);
appModule.factory("OverlayService", ["$log", "$rootScope", "FrontendVersionService",
    "LocationProviderService", "PlatformDetectionService", "ClientInfoService",
    "ShuffleStatsService", "SessionInformationService", "StorageService",
    "Comms", "Bootstrap", "AsyncExecService", OverlayService]);
appModule.factory("LocalSimulationService", ['$rootScope', '$log', '$interval', LocalSimulationService]);
appModule.factory("LocationProviderService", ["$log", "$http", LocationProviderService]);
appModule.factory("PlatformDetectionService", PlatformDetectionService);
appModule.factory("ClientInfoService", ["StorageService", ClientInfoService]);
appModule.service("VersionCheckService", ["$rootScope", "$interval", "$http", "$log", "FrontendVersionService", VersionCheckService]);
appModule.factory("RTCService", ["RTC", "$log", "$rootScope", RTCService]);

appModule.directive("cacheContentsTable", CacheContentsTable);
appModule.directive("nodeInfo", NodeInfo);
appModule.directive("topNodesTable", TopNodesTable);
appModule.directive("localNodePointerPanel", LocalNodePointerPanel);
appModule.directive("remoteNodePointerPanel", RemoteNodePointerPanel);
appModule.controller("DemoPageController", ['$interval', '$log', '$scope', "OverlayService", "ClientInfoService", "VersionCheckService", "RankingService", "StorageService", DemoPageController]);
appModule.controller("LocalSimulationController", ['$scope', 'LocalSimulationService', LocalSimulationController]);
appModule.controller("ConnectivityTestController", ["$timeout", "$scope", "RTCService", ConnectivityTestController]);

// Disable debug, its very noisy
appModule.config(["$logProvider", "$sceDelegateProvider", function ($logProvider, $sceDelegateProvider) {
    $logProvider.debugEnabled(false);
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://get.geojs.io/v1/ip/geo.js']);
}]);

angular.element(document).ready(function () {
    angular.bootstrap(document, ['cyclon-demo']);
});
