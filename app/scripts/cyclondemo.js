'use strict';

var rtc = require("cyclon.p2p-rtc-client");
var Utils = require("cyclon.p2p-common");

var LocalSimulationService = require("./services/LocalSimulationService");
var GuidService = require("./services/GuidService");
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
var StorageService = require("./services/StorageService");

var DemoPageController = require("./controllers/DemoPageController");
var LocalSimulationController = require("./controllers/LocalSimulationController");
var ConnectivityTestController = require("./controllers/ConnectivityTestController");

var CacheContentsTable = require("./directives/CacheContentsTable");
var NodeInfo = require("./directives/NodeInfo");
var TopNodesTable = require("./directives/TopNodesTable");

var OutgoingSuccessRateFilter = require("./filters/OutgoingSuccessRateFilter");
var IncomingSuccessRateFilter = require("./filters/IncomingSuccessRateFilter");
var IdOrInfoFilter = require("./filters/IdOrInfoFilter");
var RunningTimeFilter = require("./filters/RunningTimeFilter");

var appModule = angular.module("cyclon-demo", ["ui.bootstrap"]);

appModule.constant("IceServers", [
    // The Google STUN server
    {urls: ['stun:stun.l.google.com:19302']},
    // Turn over TCP on port 80 for networks with totalitarian security regimes
    {urls: ['turn:54.187.115.223:80?transport=tcp'], username: 'cyclonjsuser', credential: 'sP4zBGasNVKI'}
]);

appModule.constant("SignallingServers",
    JSON.parse('/* @echo SIGNALLING_SERVERS */')
);

appModule.filter("incomingSuccessRate", IncomingSuccessRateFilter);
appModule.filter("outgoingSuccessRate", OutgoingSuccessRateFilter);
appModule.filter("idOrInfo", IdOrInfoFilter);
appModule.filter("runningTime", ["SessionInformationService", RunningTimeFilter]);
appModule.factory("ShuffleStatsService", ["$rootScope", ShuffleStatsService]);
appModule.factory("SessionInformationService", ["StorageService", SessionInformationService]);
appModule.factory("RankingService", ["$rootScope", "$interval", "OverlayService", "SessionInformationService", RankingService]);
appModule.factory("FrontendVersionService", FrontendVersionService);
appModule.factory("GuidService", GuidService);
appModule.factory("OverlayService", ["$log", "$rootScope", "GuidService", "FrontendVersionService", "LocationProviderService", "PlatformDetectionService", "ClientInfoService", "ShuffleStatsService", "SessionInformationService", "StorageService",  "IceServers", "SignallingServers", OverlayService]);
appModule.factory("LocalSimulationService", ['$log', '$interval', LocalSimulationService]);
appModule.factory("LocationProviderService", ["$log", "$http", LocationProviderService]);
appModule.factory("PlatformDetectionService", PlatformDetectionService);
appModule.factory("ClientInfoService", ["StorageService", ClientInfoService]);
appModule.factory("VersionCheckService", ["$rootScope", "$interval", "$http", "$log", "FrontendVersionService", VersionCheckService]);
appModule.factory("RTCService", ["$log", "StorageService", "IceServers", "SignallingServers", RTCService]);
appModule.factory("StorageService", StorageService);

appModule.directive("cacheContentsTable", CacheContentsTable);
appModule.directive("nodeInfo", NodeInfo);
appModule.directive("topNodesTable", TopNodesTable);
appModule.controller("DemoPageController", ['$http', '$interval', '$log', '$scope', "OverlayService", "ClientInfoService", "VersionCheckService", "RankingService", "StorageService", DemoPageController]);
appModule.controller("LocalSimulationController", ['LocalSimulationService', LocalSimulationController]);
appModule.controller("ConnectivityTestController", ["$timeout", "$scope", "RTCService", ConnectivityTestController]);

// Disable debug, its very noisy
appModule.config(["$logProvider", function ($logProvider) {
    $logProvider.debugEnabled(false);
}]);

angular.element(document).ready(function () {
    angular.bootstrap(document, ['cyclon-demo']);
});
