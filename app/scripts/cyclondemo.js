'use strict';

var cyclon = require("cyclon.p2p");
var rtc = require("cyclon.p2p-rtc-client");
var rtcComms = require("cyclon.p2p-rtc-comms");
var Utils = require("cyclon.p2p-common");
var StorageService = require("./services/StorageService");

function construct(constructor) {
    return function() {
        var args = arguments;
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    }
}

/**
 * RTC Module
 */
var rtcModule = angular.module("cyclon-rtc", []);

rtcModule.factory("RTC", ["SignallingService", "ChannelFactory", construct(rtc.RTC)]);
rtcModule.factory("ChannelFactory", ["AsyncExecService", "PeerConnectionFactory", "SignallingService", "$log", construct(rtc.ChannelFactory)]);
rtcModule.factory("PeerConnectionFactory", ["RTCObjectFactory", "AsyncExecService", "$log", "IceServers", construct(rtc.PeerConnectionFactory)]);
rtcModule.factory("RTCObjectFactory", ["$log", construct(rtc.AdapterJsRTCObjectFactory)]);
rtcModule.factory("AsyncExecService", Utils.asyncExecService);
rtcModule.factory("SignallingService", ["SignallingSocket", "$log", "HttpRequestService", "StorageService", construct(rtc.SocketIOSignallingService)]);
rtcModule.factory("SignallingSocket", ["SignallingServerService", "SocketFactory", "$log", "AsyncExecService", "StorageService", "TimingService", construct(rtc.RedundantSignallingSocket)]);
rtcModule.factory("HttpRequestService", construct(rtc.HttpRequestService));
rtcModule.factory("StorageService", StorageService);
rtcModule.factory("SignallingServerService", ["SignallingServers", construct(rtc.StaticSignallingServerService)]);
rtcModule.factory("SocketFactory", construct(rtc.SocketFactory));
rtcModule.factory("TimingService", construct(rtc.TimingService));

/**
 * Config below here
 */
rtcModule.constant("IceServers", [
    // The Google STUN server
    {urls: ['stun:stun.l.google.com:19302']},
    // Turn over TCP on port 80 for networks with totalitarian security regimes
    {urls: ['turn:54.187.115.223:80?transport=tcp'], username: 'cyclonjsuser', credential: 'sP4zBGasNVKI'}
]);
rtcModule.constant("SignallingServers", JSON.parse('/* @echo SIGNALLING_SERVERS */'));

/**
 * RTC Comms Module
 */
var rtcCommsModule = angular.module("cyclon-rtc-comms", ["cyclon-rtc"]);

rtcCommsModule.factory("Comms", ["RTC", "ShuffleStateFactory", "$log", construct(rtcComms.WebRTCComms)]);
rtcCommsModule.factory("ShuffleStateFactory", ["$log", "AsyncExecService", construct(rtcComms.ShuffleStateFactory)]);
rtcCommsModule.factory("Bootstrap", ["SignallingSocket", "HttpRequestService", construct(rtcComms.SignallingServerBootstrap)]);

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
appModule.factory("RankingService", ["$rootScope", "$interval", "OverlayService", "SessionInformationService", RankingService]);
appModule.factory("FrontendVersionService", FrontendVersionService);
appModule.factory("OverlayService", ["$log", "$rootScope", "FrontendVersionService",
    "LocationProviderService", "PlatformDetectionService", "ClientInfoService",
    "ShuffleStatsService", "SessionInformationService", "StorageService",
    "Comms", "Bootstrap", "AsyncExecService", OverlayService]);
appModule.factory("LocalSimulationService", ['$log', '$interval', LocalSimulationService]);
appModule.factory("LocationProviderService", ["$log", "$http", LocationProviderService]);
appModule.factory("PlatformDetectionService", PlatformDetectionService);
appModule.factory("ClientInfoService", ["StorageService", ClientInfoService]);
appModule.factory("VersionCheckService", ["$rootScope", "$interval", "$http", "$log", "FrontendVersionService", VersionCheckService]);
appModule.factory("RTCService", ["RTC", "$log", RTCService]);

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
